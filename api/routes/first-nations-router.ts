import express, { Request, Response } from 'express';

import db from '@/db/db-client';

export const firstNationsRouter = express.Router();

firstNationsRouter.get('/', (_req: Request, res: Response) => {
	return db
		.select('id', 'description')
		.from('FirstNation')
		.then((results) => {
			return res.json({ data: results });
		});
});
