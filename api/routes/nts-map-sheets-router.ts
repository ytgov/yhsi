import express, { Request, Response } from 'express';

import db from '@/db/db-client';

export const ntsMapSheetsRouter = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
ntsMapSheetsRouter.get('/', (req: Request, res: Response) => {
	return db
		.select('Map50k as name')
		.from('YHIS.MapSheetLookup')
		.distinct()
		.then((results) => {
			return res.json({ data: results });
		});
});
