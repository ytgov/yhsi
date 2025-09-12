import express, { Request, Response } from 'express';

import { HISTORICAL_PATTERN_TYPES } from '../models';

export const historicalPatternTypesRouter = express.Router();

historicalPatternTypesRouter.get('/', (req: Request, res: Response) => {
	return res.json({ data: HISTORICAL_PATTERN_TYPES });
});
