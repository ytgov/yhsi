import express, { Request, Response } from "express";
import axios from "axios";
import { DB_CONFIG, ISSUER_BASE_URL, CLIENT_ID, AUTH_DB_CONNECTION } from "../config"
import { body, param } from "express-validator";
import { UserService } from "../services";
import { ReturnValidationErrors } from "../middleware";
import moment from "moment";
import { authorize, UserRoleOptions, UserRoles } from "../middleware/authorization";

export const userRouter = express.Router();
const db = new UserService(DB_CONFIG);

userRouter.get("/", authorize([UserRoles.ADMINISTRATOR]),
    async (req: Request, res: Response) => {
        let users = await db.getAll();

        for (let user of users) {
            user.last_login_date_display = moment(user.last_login_date).utc(true).format("YYYY-MM-DD @ h:mmA");

            if (user.expire_date) {
                let isExpired = moment().isAfter(moment(user.expire_date))
                if (user.status == "Active" && isExpired)
                    user.status = "Expired";
            }
        }

        res.json({ data: users });
    });

userRouter.get("/roles", authorize(),
    async (req: Request, res: Response) => {
        return res.json({ data: UserRoleOptions });
    });

userRouter.get("/me", authorize([], true),
    async (req: Request, res: Response) => {
        let person = req.user;

        if (person)
            return res.json({ data: await makeDTO(person) });
    });

userRouter.get("/:id", authorize([UserRoles.ADMINISTRATOR]),
    [param("id").notEmpty()], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        let user = await db.getById(parseInt(id));

        if (user?.expire_date) {
            let isExpired = moment().isAfter(moment(user.expire_date))
            if (isExpired)
                user.status = "Expired";

            user.expire_date_display = moment(user.expire_date).utc(false).format("YYYY-MM-DD");
        }

        res.json({ data: user });
    });

userRouter.put("/:id", authorize([UserRoles.ADMINISTRATOR]),
    [param("id").notEmpty(), body("first_name").notEmpty().trim(), body("last_name").notEmpty().trim(), body("status").notEmpty()], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        let { first_name, last_name, expire_date_display, role_list, status } = req.body;
        let item = { first_name, last_name, expire_date: expire_date_display, role_list, status }

        await db.update(id, item);

        res.json({ messages: [{ variant: "success", text: "User saved" }] });
    });

userRouter.post("/sign-up-external",
    [body("email").isEmail().normalizeEmail().withMessage("This email appears invalid"),
    body("first_name").notEmpty(),
    body("last_name").notEmpty(),
    body("password").notEmpty().isStrongPassword().withMessage("Your password needs to be more complex")], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let { email, first_name, last_name, password } = req.body;
        let existingEmail = await db.getByEmail(email);

        if (existingEmail) {
            return res.status(400).json({ errors: [{ msg: "A user with that email already exists, try to sign in" }] });
        }

        let body = {
            email, username: email, given_name: first_name,
            family_name: last_name, password,
            client_id: CLIENT_ID, connection: AUTH_DB_CONNECTION,
            name: `${first_name} ${last_name}`,
            nickname: first_name
        }

        axios.post(`${ISSUER_BASE_URL}dbconnections/signup`, body)
            .then(resp => {
                return res.json({ messages: [{ variant: "success", text: "User account created" }] });
            })
            .catch(err => {
                return res.status(400).json({ errors: [{ msg: err.response.data.description }] });
            })
    });

userRouter.post("/:id/access", authorize([UserRoles.ADMINISTRATOR]),
    [param("id").notEmpty(),], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        const { id } = req.params;
        let { access_type_id, access_text, user_id } = req.body;
        let item = { access_type_id, access_text, user_id }

        await db.createAccess(item);

        res.json({ messages: [{ variant: "success", text: "Site access saved" }] });
    });

userRouter.put("/:id/access/:accessId", authorize([UserRoles.ADMINISTRATOR]),
    [param("id").notEmpty(), param("accessId").notEmpty()], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        const { id, accessId } = req.params;
        let { access_type_id, access_text } = req.body;
        let item = { access_type_id, access_text };

        await db.updateAccess(accessId, item);

        res.json({ messages: [{ variant: "success", text: "Site access saved" }] });
    });

userRouter.delete("/:id/access/:accessId", authorize([UserRoles.ADMINISTRATOR]),
    [param("id").notEmpty(), param("accessId").notEmpty()], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        const { id, accessId } = req.params;
        await db.deleteAccess(accessId);
        res.json({ messages: [{ variant: "success", text: "Site access removed" }] });
    });

async function makeDTO(userRaw: any) {
    let dto = userRaw;
    dto.display_name = `${userRaw.first_name} ${userRaw.last_name}`;

    if (userRaw.expire_date)
        dto.expire_date_display = moment(userRaw.expire_date).utc(false).format("YYYY-MM-DD");

    //dto.roles = _.split(userRaw.roles, ",").filter(r => r.length > 0);
    //dto.access = await db.getAccessFor(userRaw.email);
    //dto.display_access = _.join(dto.access.map((a: any) => a.level), ", ")

    return dto;
}
