import express, { Request, Response } from 'express';

import { RECORD_TYPES } from '../models';

export const recordTypesRouter = express.Router();

recordTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: RECORD_TYPES });
});
