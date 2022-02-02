import express, { Request, Response } from "express";
import { DB_CONFIG } from '../config';
import knex from "knex";
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';

export const photoOwnersRouter = express.Router();
const db = knex(DB_CONFIG);

photoOwnersRouter.get(
  '/',
  [
    query('page').default(0).isInt(),
    query('limit').default(10).isInt({ gt: 0 }),
    query('textToMatch').default('').isString(),
    query('sortBy').default('ownerid').isString(),
    query('sort').default('asc').isString(),
  ],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
    const textToMatch = (req.query.textToMatch as string);
    const sortBy = (req.query.sortBy as string);
    const sort = (req.query.sort as string);

		const offset = page * limit || 0;

    let counter = 0;
    let owners = [];
  
    if (textToMatch) {
      owners = await db
        .select('*')
        .from('dbo.PhotoOwner')
        .orderBy(`${sortBy}`, `${sort}`)
        .where('dbo.PhotoOwner.Name', 'like', `%${textToMatch}%`)
        .limit(limit)
        .offset(offset);
    } else {
      owners = await db
        .select('*')
        .from('dbo.PhotoOwner')
        .orderBy(`${sortBy}`, `${sort}`)
        .limit(limit)
        .offset(offset);
    }
  
    res.status(200).send({ body: owners });
  }
);