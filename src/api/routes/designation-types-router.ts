import express, { Request, Response } from 'express';

import { DESIGNATION_TYPES } from '../models';

export const designationTypesRouter = express.Router();

designationTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: DESIGNATION_TYPES });
});
