import express, { Request, Response } from 'express';

import db from '@/db/db-client';

export const functionalTypesRouter = express.Router();

functionalTypesRouter.get('/', (_req: Request, res: Response) => {
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
