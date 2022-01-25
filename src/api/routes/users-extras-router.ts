import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config"
import knex from "knex";
import { ReturnValidationErrors } from "../middleware";
import { param, query } from "express-validator";

export const usersExtraRouter = express.Router();
const db = knex(DB_CONFIG);

usersExtraRouter.get('/',
  [query("page").default(0).isInt(), query("limit").default(10).isInt({ gt: 0 })], ReturnValidationErrors,
  async (req: Request, res: Response) => {
    /* const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('view')) res.sendStatus(403);
  
    const db = req.app.get('db'); */

    const { textToMatch = '', sortBy = 'UserId', sort = 'asc' } = req.query;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const offset = (page * limit) || 0;
    let counter = [{ count: 0 }];
    let aircrashes = [];

    if (textToMatch) {
      counter = await db.from('dbo.Ibbit_User')
        .where('Email', 'like', `%${textToMatch}%`)
        .orWhere('FirstName', 'like', `%${textToMatch}%`)
        .orWhere('LastName', 'like', `%${textToMatch}%`)
        .orWhere('CreateDate', 'like', `%${textToMatch}%`)
        .count('UserId', { as: 'count' });

      aircrashes = await db.from('dbo.Ibbit_User')
        .where('Email', 'like', `%${textToMatch}%`)
        .orWhere('FirstName', 'like', `%${textToMatch}%`)
        .orWhere('LastName', 'like', `%${textToMatch}%`)
        .orWhere('CreateDate', 'like', `%${textToMatch}%`)
        .orderBy(`${sortBy}`, `${sort}`)
        .limit(limit).offset(offset);

    }
    else {
      counter = await db.from('dbo.Ibbit_User').count('UserId', { as: 'count' });

      aircrashes = await db.from('dbo.Ibbit_User')
        .orderBy(`${sortBy}`, `${sort}`)
        .limit(limit).offset(offset);
    }

    res.status(200).send({ count: counter[0].count, body: aircrashes });
  });

usersExtraRouter.get('/:userId',
  [param("userId").notEmpty()], ReturnValidationErrors,
  async (req: Request, res: Response) => {
    /* const db = req.app.get('db');
  
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('view')) res.sendStatus(403); */
    const { userId } = req.params;

    const user = await db.column('IU.*', 'HSU.ExpirationDate')
      .select()
      .from('dbo.Ibbit_User as IU')
      .join('dbo.HSUser as HSU', 'HSU.UserId', '=', 'IU.UserId')
      .where('IU.UserId', userId)
      .first();

    user.access = await db.select('*')
      .from('dbo.HSUserAccess')
      .where('dbo.HSUserAccess.UserId', userId);

    if (!user) {
      res.status(403).send('User id not found');
      return
    };

    res.status(200).send(user);
  });

usersExtraRouter.put('/:userId',
  [param("userId").notEmpty()], ReturnValidationErrors,
  async (req: Request, res: Response) => {
    /* const db = req.app.get('db');
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('edit')) res.sendStatus(403); */

    const { userId } = req.params;

    const { user = {},
      expirationDate,
      access } = req.body;

    //updates the main user table
    const updatedUser = await db('dbo.Ibbit_User')
      .update(user)
      .where('dbo.Ibbit_User.UserId', userId)
      .returning('*');
    if (updatedUser) {
      //updates the expiration date
      await db('dbo.Ibbit_User').update({ ExpirationDate: expirationDate })
        .where('dbo.Ibbit_User.UserId', userId);
      // updates the user access
      // await db('dbo.HSUserAccess')
      // .where('dbo.HSUserAccess.UserId', userId);
    }

    res.status(200).send({ message: 'success' });
  });
