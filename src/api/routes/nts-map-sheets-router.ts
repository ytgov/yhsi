import express, { Request, Response } from 'express';
import knex from 'knex';

import { DB_CONFIG } from '../config';

export const ntsMapSheetsRouter = express.Router();
const db = knex(DB_CONFIG);

ntsMapSheetsRouter.get('/', (req: Request, res: Response) => {
	return db
		.select('NTSMapSheet as name')
		.from('place')
		.distinct()
		.whereNotNull('NTSMapSheet')
		.then((results) => {
			return res.json({ data: results });
		});
});
