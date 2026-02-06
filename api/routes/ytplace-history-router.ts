import express, { Request, Response } from 'express';
import { param } from 'express-validator';

import db from '@/db/db-client';
import { ReturnValidationErrors } from '../middleware';

export const ytPlaceHistoryRouter = express.Router();

ytPlaceHistoryRouter.post('/', async (req: Request, res: Response) => {
	const history = req.body;
	history.placeId = parseInt(history.placeId);

	const response = await db.insert(history).into('Place.PlaceHistory').returning('*');

	res.status(200).send(response);
});

ytPlaceHistoryRouter.put(
	'/:historyId',
	[param('historyId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const history = req.body;
		const { historyId } = req.params;
		//make the update
		await db('Place.PlaceHistory').update(history).where('Place.PlaceHistory.id', historyId);

		res.status(200).send({ message: 'success' });
	}
);
