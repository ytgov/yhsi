import express, { Request, Response } from 'express';

import { DATE_TYPES } from '../models';

export const dateTypesRouter = express.Router();

dateTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: DATE_TYPES });
});
