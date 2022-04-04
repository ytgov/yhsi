import express, { Request, Response } from 'express';

import { CATEGORY_TYPES } from '../models';

export const categoryTypesRouter = express.Router();

categoryTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: CATEGORY_TYPES });
});
