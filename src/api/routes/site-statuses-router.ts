import express, { Request, Response } from 'express';
import knex from 'knex';

import { DB_CONFIG } from '../config';

export const siteStatusesRouter = express.Router();
const db = knex(DB_CONFIG);

siteStatusesRouter.get('/', (req: Request, res: Response) => {
	return db
		.select({ id: 'Site_Status_Id' }, 'description')
		.from('Site_Status_CD')
		.then((results) => {
			return res.json({ data: results });
		});
});
