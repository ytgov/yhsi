import express, { Request, Response } from 'express';

import { CONSTRUCTION_PERIOD_TYPES } from '../models';

export const constructionPeriodTypesRouter = express.Router();

constructionPeriodTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: CONSTRUCTION_PERIOD_TYPES });
});
