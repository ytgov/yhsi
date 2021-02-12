import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config"
import { validationResult } from "express-validator";
import { UserService } from "../services";

export const userRouter = express.Router();

const userService = new UserService(DB_CONFIG);

userRouter.post("/login", async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let { username, password } = req.body;
    //let loggedInUser = await userService.login(username, password);

    //if (loggedInUser) {
    /*  let userDTO = userService.makeDTO(loggedInUser);
     userDTO.organizations = await orgService.makeDTOsForUser(loggedInUser.id);
     userDTO.unread_notification_count = await notificationService.getUnreadCountForUser(loggedInUser.id);

     await sessionService.create(req, res, userDTO); */

    return res.send({ data: {} });
    //}

    res.send({ errors: ["Authentication failed - Username or password is not correct"] });
});

userRouter.get("/login_check", async (req: Request, res: Response) => {
    //let userDTO = req.user;
    //userDTO.unread_notification_count = await notificationService.getUnreadCountForUser(userDTO.id);
    return res.send({ data: {} });
});

userRouter.post("/logout", async (req: Request, res: Response) => {
    //sessionService.destroy(req);

    res.status(200).send("Logout complete");
});
