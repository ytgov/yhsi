import express, { Request, Response } from 'express';

import { REVISION_LOG_TYPES } from '../models';

export const revisionLogTypesRouter = express.Router();

revisionLogTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: REVISION_LOG_TYPES });
});
