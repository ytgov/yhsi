import express, { Request, Response } from 'express';

import { DB_CONFIG } from '../config';

import { StatuteService } from '../services';

export const statutesRouter = express.Router();
const statuteService = new StatuteService(DB_CONFIG);

statutesRouter.get('/', (req: Request, res: Response) => {
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
