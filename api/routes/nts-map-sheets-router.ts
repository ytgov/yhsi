import express, { Request, Response } from 'express';

import db from '@/db/db-client';

export const ntsMapSheetsRouter = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
