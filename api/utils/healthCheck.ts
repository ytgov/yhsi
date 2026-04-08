import { Response } from "express";
import { DB_CONFIG } from "../config";
import { UserService } from "../services";

const userService = new UserService(DB_CONFIG);

export async function doHealthCheck(res: Response) {
    let dbConnected = await userService.isConnected()

    if (!dbConnected)
        return res.status(500).send("Health check failed: database is not connected.");

    res.send("Health check passed: database is connected and functioning.");
}
