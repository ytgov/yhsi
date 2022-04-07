import express, { Request, Response } from "express";
export const deployRouter = express.Router();


deployRouter.get("/", async (req: Request, res: Response) => {
    const exec = require('child_process').exec;
    exec('sh ../../deploy.sh');
});