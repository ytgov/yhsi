import express, { Request, Response } from 'express';
import knex from 'knex';

import { DB_CONFIG } from '../config';

export const placeThemesRouter = express.Router();
const db = knex(DB_CONFIG);

placeThemesRouter.get('/', (req: Request, res: Response) => {
	return db('PlaceTheme')
		.select('id', 'category', 'type')
		.then((results) => {
			res.json({ data: results });
		})
		.catch((error) => {
			return res.status(422).json({
				messages: [{ variant: 'error', text: error.message }],
			});
		});
});
