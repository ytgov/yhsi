import { Request, Response, NextFunction } from 'express';
import { User, UserRoles } from '../models';

const USER_ACTIVE_STATUS = 'Active';

export const UserRoleOptions = [
	UserRoles.ADMINISTRATOR,
	UserRoles.SITE_ADMIN,
	UserRoles.SITE_EDITOR,
	UserRoles.SITE_VIEWER,
	UserRoles.SITE_VIEWER_LIMITED,
	UserRoles.PHOTO_ADMIN,
	UserRoles.PHOTO_EDITOR,
	UserRoles.PHOTO_VIEWER,
	UserRoles.AIRPLANE_CRASH_EDITOR,
	UserRoles.AIRPLANE_CRASH_VIEWER,
	UserRoles.BOATS_EDITOR,
	UserRoles.BOATS_VIEWER,
	UserRoles.PLACE_EDITOR,
	UserRoles.BURIALS_EDITOR,
	UserRoles.BURIALS_VIEWER,
	UserRoles.PEOPLE_EDITOR,
	UserRoles.YRHP_EDITOR,
	UserRoles.ADVANCED_MAPS,
	UserRoles.INTERPRETIVE_SITES_EDITOR,
	UserRoles.INTERPRETIVE_SITES_VIEWER,
];

// req.user is normally a User instance, but fall back to splitting the raw
// column so a plain object can't silently bypass the role check.
function roleListFor(user: User): string[] {
	if (user.role_list) return user.role_list;

	return user.roles?.split(',').map((role) => role.trim()) || [];
}

export function authorize(roles: string[] = [], allowPending = false) {
	return (req: Request, res: Response, next: NextFunction) => {
		const currentUser = req.user as User;

		if (!req.oidc.isAuthenticated() || !currentUser)
			return res.status(401).send('Not authenticated');

		if (currentUser.status != USER_ACTIVE_STATUS && !allowPending)
			return res.status(403).json({ message: 'Unauthorized - User inactive' });

		// if route only requires an active user
		if (roles.length == 0) return next();

		// Match whole roles only. `roles` is a comma-delimited string, so testing
		// it with indexOf lets a substring match through - "Site Viewer Limited"
		// would satisfy a check for "Site Viewer".
		const currentUserRoles = roleListFor(currentUser);

		for (const role of roles) {
			if (currentUserRoles.includes(role)) return next();
		}

		//TODO for RYAN add an override for ADMINISTRATOR role, maybe? If it doesn't break anything?

		return res
			.status(403)
			.json({ message: 'Unauthorized - Missing role(s): ' + roles });
	};
}
