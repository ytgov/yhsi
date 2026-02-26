import express, { Request, Response } from 'express';

import { StatuteService } from '../services';

export const statutesRouter = express.Router();
const statuteService = new StatuteService();

statutesRouter.get('/', (_req: Request, res: Response) => {
	return statuteService
		.getAll()
		.then((results) => {
			res.json({ data: results });
		})
		.catch((error) => {
			return res.status(422).json({
				messages: [{ variant: 'error', text: error.message }],
			});
		});
});
