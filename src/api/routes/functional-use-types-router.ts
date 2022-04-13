import express, { Request, Response } from 'express';

import { FUNCTIONAL_USE_TYPES } from '../models';

export const functionalUseTypesRouter = express.Router();

functionalUseTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: FUNCTIONAL_USE_TYPES });
});
