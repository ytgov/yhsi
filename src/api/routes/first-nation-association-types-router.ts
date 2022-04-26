import express, { Request, Response } from 'express';

import { FIRST_NATION_ASSOCIATION_TYPES } from '../models';

export const firstNationAssociationTypesRouter = express.Router();

firstNationAssociationTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: FIRST_NATION_ASSOCIATION_TYPES });
});
