import express, { Request, Response } from 'express';

import db from '@/db/db-client';

export const placeThemesRouter = express.Router();

placeThemesRouter.get('/', (_req: Request, res: Response) => {
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
