import express, { Request, Response } from 'express';

import { COORDINATE_DETERMINATION_TYPES } from '../models';

export const coordinateDeterminationTypesRouter = express.Router();

coordinateDeterminationTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: COORDINATE_DETERMINATION_TYPES });
});
