import express, { Request, Response } from 'express';

import { CONTACT_TYPES } from '../models';

export const contactTypesRouter = express.Router();

contactTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: CONTACT_TYPES });
});
