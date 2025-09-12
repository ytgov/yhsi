import express, { Request, Response } from 'express';
import knex from 'knex';

import { DB_CONFIG } from '../config';

export const functionalTypesRouter = express.Router();
const db = knex(DB_CONFIG);

functionalTypesRouter.get('/', (req: Request, res: Response) => {
	return db('FunctionalType')
		.select('id', 'description')
		.then((results) => {
			res.json({ data: results });
		})
		.catch((error) => {
			return res.status(422).json({
				messages: [{ variant: 'error', text: error.message }],
			});
		});
});
