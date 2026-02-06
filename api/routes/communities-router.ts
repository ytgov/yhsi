import express, { Request, Response } from 'express';

import db from '@/db/db-client';

export const communitiesRouter = express.Router();

communitiesRouter.get('/', (_req: Request, res: Response) => {
	return db
		.select('id', 'name')
		.from('community')
		.then((results) => {
			return res.json({ data: results });
		});
});
