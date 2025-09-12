import express, { Request, Response } from 'express';

import { OWNER_CONSENT_TYPES } from '../models';

export const ownerConsentTypesRouter = express.Router();

ownerConsentTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: OWNER_CONSENT_TYPES });
});
