import express, { Request, Response } from 'express';

import { DESCRIPTION_TYPES } from '../models';

export const descriptionTypesRouter = express.Router();

descriptionTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: DESCRIPTION_TYPES });
});
