import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config"
import { validationResult } from "express-validator";
import { PhotoService } from "../services";

const photoService = new PhotoService(DB_CONFIG);

export const photoRouter = express.Router();

photoRouter.get("/", async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let { username, password } = req.body;
    return res.send({ data: {} });

    res.send({ errors: ["Authentication failed - Username or password is not correct"] });
});