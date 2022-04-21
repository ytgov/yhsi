import { isEmpty, intersection } from 'lodash';

import { BasePolicy } from '.';
import { User, Place, UserRoles } from '../models';

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
