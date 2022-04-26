import express, { Request, Response } from 'express';
import knex from 'knex';

import { SITE_STATUS_TYPES } from '../models';

export const siteStatusTypesRouter = express.Router();

siteStatusTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: SITE_STATUS_TYPES });
});
