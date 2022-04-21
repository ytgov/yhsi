import { isEmpty, intersection, toInteger } from 'lodash';

import { BasePolicy } from '.';
import { User, Place, UserRoles, SiteAccesType } from '../models';

export class PlacePolicy extends BasePolicy<Place> {
	constructor(user: User, place: Place) {
		super(user, place);
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
			this.permittedMapSheets.includes(this.record.nTSMapSheet)
		) {
			return true;
		}

		if (
			this.record.communityId &&
			this.permittedCommunityIds.includes(this.record.communityId)
		) {
			return true;
		}

		if (
			this.record.firstNationAssociations &&
			!isEmpty(
				intersection(this.permittedFirstNationsIds, this.firstNationsIds)
			)
		) {
			return true;
		}

		return false;
	}

	// helpers
	get permittedMapSheets(): string[] {
		return this.user.siteAccess
			.filter((a) => a.accessTypeId == SiteAccesType.MAP_SHEET)
			.map((a) => a.accessText.toString());
	}

	get permittedCommunityIds(): number[] {
		return this.user.siteAccess
			.filter((a) => a.accessTypeId == SiteAccesType.COMMUNITY)
			.map((a) => toInteger(a.accessText));
	}

	get permittedFirstNationsIds(): number[] {
		return this.user.siteAccess
			.filter((a) => a.accessTypeId == SiteAccesType.FIRST_NATION)
			.map((a) => toInteger(a.accessText));
	}

	get firstNationsIds(): number[] {
		return (
			this.record.firstNationAssociations?.map((f) => f.firstNationId) || []
		);
	}
}

export default PlacePolicy;
