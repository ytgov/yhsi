import express, { Request, Response } from 'express';

import { WEB_LINK_TYPES } from '../models';

export const webLinkTypesRouter = express.Router();

webLinkTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: WEB_LINK_TYPES });
});
