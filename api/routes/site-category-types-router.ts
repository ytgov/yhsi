import express, { Request, Response } from 'express';

import { SITE_CATEGORY_TYPES } from '../models';

export const siteCategoryTypesRouter = express.Router();

siteCategoryTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: SITE_CATEGORY_TYPES });
});
