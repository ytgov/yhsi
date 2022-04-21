import { isEmpty, intersection, toInteger } from 'lodash';
import { Knex } from 'knex';

import { BasePolicy, BasePolicyScope } from '.';
import { User, Place, UserRoles } from '../models';

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

		let query = '';
		if (!isEmpty(this.user.permittedMapSheets)) {
			const permittedMapSheets = this.user.permittedMapSheets.join("','");
			query += ` OR NTSMapSheet IN ('${permittedMapSheets}')`;
		}
		if (!isEmpty(this.user.permittedCommunityIds)) {
			const permittedCommunityIds = this.user.permittedCommunityIds.join("','");
			query += ` OR CommunityId IN (${permittedCommunityIds})`;
		}
		if (!isEmpty(this.user.permittedFirstNationsIds)) {
			const permittedFirstNationsIds =
				this.user.permittedFirstNationsIds.join("','");
			query += ` OR [FirstNationAssociation].[FirstNationId] IN (${permittedFirstNationsIds})`;
		}

		if (!isEmpty(query)) {
			query += `(${query})`;
			return this.scope.whereRaw(query);
		}

		return this.emptyScope;
	}
}

export class PlacePolicy extends BasePolicy<Place> {
	constructor(user: User, record: Place) {
		super(user, record);
	}

	show() {
		if (this.user.roleList.includes(UserRoles.ADMINISTRATOR)) return true;
		if (
			isEmpty(
				intersection(this.user.roleList, [
					UserRoles.SITE_ADMIN,
					UserRoles.SITE_EDITOR,
					UserRoles.SITE_VIEWER,
				])
			)
		)
			return false;

		if (
			this.record.nTSMapSheet &&
			this.user.permittedMapSheets.includes(this.record.nTSMapSheet)
		) {
			return true;
		}

		if (
			this.record.communityId &&
			this.user.permittedCommunityIds.includes(this.record.communityId)
		) {
			return true;
		}

		if (
			this.record.firstNationAssociations &&
			!isEmpty(
				intersection(this.user.permittedFirstNationsIds, this.firstNationsIds)
			)
		) {
			return true;
		}

		return false;
	}

	// helpers
	get firstNationsIds(): number[] {
		return (
			this.record.firstNationAssociations?.map((f) => f.firstNationId) || []
		);
	}
}

export default PlacePolicy;
