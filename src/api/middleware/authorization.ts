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
    UserRoles.BOATS_EDITOR,
    UserRoles.PLACE_EDITOR,
    UserRoles.BURIALS_EDITOR,
    UserRoles.PEOPLE_EDITOR,
    UserRoles.YRHP_EDITOR,
    UserRoles.ADVANCED_MAPS
]

export function authorize(roles: string[] = [], allowPending: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {
        let currentUser = req.user as User;

        if (!req.oidc.isAuthenticated() || !currentUser)
            return res.status(401).send('Not authenticated');

        if (currentUser.status != USER_ACTIVE_STATUS && !allowPending)
            return res.status(401).json({ message: "Unauthorized - User inactive" });

        // if route only requires an active user
        if (roles.length == 0)
            return next();

        for (let role of roles) {
            if (currentUser.roles && currentUser.roles.indexOf(role) >= 0)
                return next();
        }

        return res.status(401).json({ message: 'Unauthorized - Missing role(s): ' + roles });
    };
}
