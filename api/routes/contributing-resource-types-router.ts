import express, { Request, Response } from 'express';

import { CONTRIBUTING_RESOURCE_TYPES } from '../models';

export const contributingResourceTypesRouter = express.Router();

contributingResourceTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: CONTRIBUTING_RESOURCE_TYPES });
});
