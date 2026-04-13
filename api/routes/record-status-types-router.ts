import express, { Request, Response } from 'express';

import { RECORD_STATUS_TYPES } from '../models';

export const recordStatusTypesRouter = express.Router();

recordStatusTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: RECORD_STATUS_TYPES });
});
