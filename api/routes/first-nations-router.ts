import express, { Request, Response } from 'express';
import knex from 'knex';

import { DB_CONFIG } from '../config';

export const firstNationsRouter = express.Router();
const db = knex(DB_CONFIG);

firstNationsRouter.get('/', (req: Request, res: Response) => {
	return db
		.select('id', 'description')
		.from('FirstNation')
		.then((results) => {
			return res.json({ data: results });
		});
});
