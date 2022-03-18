import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config"
import { body, param, query } from "express-validator";
import { UserService } from "../services";
import { ReturnValidationErrors } from "../middleware";
import moment from "moment";

export const userRouter = express.Router();

const db = new UserService(DB_CONFIG);



userRouter.get("/",
    async (req: Request, res: Response) => {
        let users = await db.getAll();

        for (let user of users) {
            user.Status = "Inactive";

            if (user.LastLogin)
                user.LastLogin = moment(user.LastLogin).format("YYYY-MM-DD @ h:mm A");

            if (user.ExpirationDate) {
                let isExpired = moment().isAfter(moment(user.ExpirationDate))
                if (isExpired)
                    user.Status = "Expired";
            }

            if (user.Roles && user.Roles.indexOf(1) >= 0 && user.Status != "Expired")
                user.Status = "Active";
        }

        res.json({ data: users });
    });

userRouter.get("/roles",
    async (req: Request, res: Response) => {
        return res.json({ data: await db.getAllRoles() });
    });

userRouter.get("/me",
    async (req: Request, res: Response) => {
        let person = req.user;

        if (person)
            return res.json({ data: await makeDTO(person) });
    });

userRouter.get("/:id",
    [param("id").notEmpty()], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        let user = await db.getOne({ "Ibbit_User.UserId": id });

        user.Status = "Inactive";

        if (user.ExpirationDate) {
            let isExpired = moment().isAfter(moment(user.ExpirationDate))
            if (isExpired)
                user.Status = "Expired";

            user.ExpirationDate = moment(user.ExpirationDate).utc(false).format("YYYY-MM-DD");
        }

        if (user.Roles && user.Roles.indexOf(1) >= 0 && user.Status != "Expired")
            user.Status = "Active";


        res.json({ data: user });
    });

userRouter.put("/:id",
    [param("id").notEmpty(), body("FirstName").notEmpty().trim(), body("LastName").notEmpty().trim(), body("Email").notEmpty().isEmail()], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        const { id } = req.params;

        let { FirstName, LastName, Email, ExpirationDate, Roles } = req.body;
        //let user = await db.getOne({ "Ibbit_User.UserId": id });
        let item = { FirstName, LastName, Email, ExpirationDate, Roles }

        await db.update(id, item);


        //user.Roles = await db.getRolesForUser(id);

        res.json({ data: {} });
    });

userRouter.post("/:id/access",
    [param("id").notEmpty(),], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        let { AccessType, AccessText, UserId } = req.body;
        let item = { AccessType, AccessText, UserId }

        await db.createAccess(item);

        res.json({ data: {} });
    });

userRouter.put("/:id/access/:accessId",
    [param("id").notEmpty(), param("accessId").notEmpty()], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        const { id, accessId } = req.params;
        let { AccessType, AccessText } = req.body;
        let item = { AccessType, AccessText };

        await db.updateAccess(accessId, item);

        res.json({ data: {} });
    });

userRouter.delete("/:id/access/:accessId",
    [param("id").notEmpty(), param("accessId").notEmpty()], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        const { id, accessId } = req.params;
        await db.deleteAccess(accessId);
        res.json({ data: {} });
    });

async function makeDTO(userRaw: any) {
	let dto = userRaw;
	dto.display_name = `${userRaw.first_name} ${userRaw.last_name}`;
	//dto.roles = _.split(userRaw.roles, ",").filter(r => r.length > 0);
	//dto.access = await db.getAccessFor(userRaw.email);
	//dto.display_access = _.join(dto.access.map((a: any) => a.level), ", ")

	return dto;
}
