import { isEmpty, intersection } from 'lodash';
import { Knex } from 'knex';

import { BasePolicyScope } from '.';
import { User, UserRoles } from '../models';

export class PlacePolicyScope extends BasePolicyScope {
	resolve() {
		// without a user passed in, you see nothing
		if (!this.user) {
			return this.emptyScope;
		}

		// Administrators see everything
		if (this.user.roleList.includes(UserRoles.ADMINISTRATOR)) {
			return this.scope;
		}

		// If you don't have one of the site roles, you see nothing
		if (
			isEmpty(
				intersection(this.user.roleList, [
					UserRoles.SITE_ADMIN,
					UserRoles.SITE_EDITOR,
					UserRoles.SITE_VIEWER,
				])
			)
		) {
			return this.emptyScope;
		}

		let clauses = [];
		if (!isEmpty(this.user.permittedMapSheets)) {
			const permittedMapSheets = this.user.permittedMapSheets.join(', ');
			clauses.push(`NTSMapSheet IN ('${permittedMapSheets}')`);
		}
		if (!isEmpty(this.user.permittedCommunityIds)) {
			const permittedCommunityIds = this.user.permittedCommunityIds.join(', ');
			clauses.push(`CommunityId IN (${permittedCommunityIds})`);
		}
		if (!isEmpty(this.user.permittedFirstNationsIds)) {
			const permittedFirstNationsIds =
				this.user.permittedFirstNationsIds.join(', ');
			clauses.push(
				`[FirstNationAssociation].[FirstNationId] IN (${permittedFirstNationsIds})`
			);
		}

		if (!isEmpty(clauses)) {
			const condition = clauses.join(' OR ');
			const restrictedScope = this.scope
				.select(['Place.Id'])
				.leftOuterJoin(
					'FirstNationAssociation',
					'Place.Id',
					'FirstNationAssociation.PlaceId'
				)
				.whereRaw(`(${condition})`);
			return this.scope.innerJoin(
				restrictedScope.as('RestrictedPlace'),
				'Place.Id',
				'RestrictedPlace.Id'
			);
		}

		return this.emptyScope;
	}
}
