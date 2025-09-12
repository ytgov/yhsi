import express, { Request, Response } from 'express';

import { ASSOCIATION_TYPES } from '../models';

export const associationTypesRouter = express.Router();

associationTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: ASSOCIATION_TYPES });
});
