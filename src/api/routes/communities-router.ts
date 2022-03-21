import express, { Request, Response } from 'express';
import knex from 'knex';

import { DB_CONFIG } from '../config';

export const communitiesRouter = express.Router();
const db = knex(DB_CONFIG);

communitiesRouter.get('/', (req: Request, res: Response) => {
	return db
		.select('id', 'name')
		.from('community')
		.then((results) => {
			return res.json({ data: results });
		});
});
