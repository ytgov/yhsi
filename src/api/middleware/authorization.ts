import { Request, Response, NextFunction } from "express";
import { isUndefined } from "lodash";
import { User } from "../models";

const USER_ACTIVE_STATUS = "Active";

export const UserRoles = {
    ADMINISTRATOR: "Administrator",
    SITE_ADMIN: "Site Admin",
    SITE_EDITOR: "Site Editor",
    SITE_VIEWER: "Site Viewer",
    PHOTO_ADMIN: "Photo Admin",
    PHOTO_EDITOR: "Photo Editor",
    PHOTO_VIEWER: "Photo Viewer",
    SITE_VIEWER_LIMITED: "Site Viewer Limited",
    AIRPLANE_CRASH_EDITOR: "Airplane Crash Editor",
    BOATS_EDITOR: "Boats Editor",
    PLACE_EDITOR: "Places Editor",
    BURIALS_EDITOR: "Burials Editor",
    PEOPLE_EDITOR: "People Editor",
    YRHP_EDITOR: "YRHP Editor"
};

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
    UserRoles.YRHP_EDITOR
]

export function authorize(roles: string[] = [], allowPending: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {
        let currentUser = req.user as User;

        if (!req.oidc.isAuthenticated() || !currentUser)
            return res.status(401).send('Not authenticated');

        console.log(currentUser.status, allowPending)

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
