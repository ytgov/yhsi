import express, { Request, Response } from 'express';

import { CONDITION_TYPES } from '../models';

export const conditionTypesRouter = express.Router();

conditionTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: CONDITION_TYPES });
});
