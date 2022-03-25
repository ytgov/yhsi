import express, { Request, Response } from 'express';

import { CONSTRUCTION_PERIODS } from '../data';

export const constructionPeriodsRouter = express.Router();

constructionPeriodsRouter.get('/', (req: Request, res: Response) => {
	return  res.json({ data: CONSTRUCTION_PERIODS })
});
