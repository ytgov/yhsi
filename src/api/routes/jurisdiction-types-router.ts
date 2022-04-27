import express, { Request, Response } from 'express';

import { JURISDICTION_TYPES } from '../models';

export const jurisdictionTypesRouter = express.Router();

jurisdictionTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: JURISDICTION_TYPES });
});
