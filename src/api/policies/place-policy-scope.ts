import { isEmpty, intersection } from 'lodash';
import { Knex } from 'knex';

import { BasePolicyScope } from '.';
import { User, UserRoles } from '../models';

export class PlacePolicyScope extends BasePolicyScope {
	constructor(scope: Knex.QueryBuilder, user: User) {
		super(scope, user);
		this.scope = scope
			.select(['Place.Id'])
			.leftOuterJoin(
				'FirstNationAssociation',
				'Place.Id',
				'FirstNationAssociation.PlaceId'
			);
	}

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
			let query = clauses.join(' OR ');
			return this.scope.whereRaw(`(${query})`);
		}

		return this.emptyScope;
	}
}
