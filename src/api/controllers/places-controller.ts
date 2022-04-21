import { Request, Response } from 'express';

import { DB_CONFIG } from '../config';
import { PlaceService } from '../services';
import { User } from '../models';
import { NotFoundError } from '../utils/validation';
import { PlacePolicy } from '../policies';

const placeService = new PlaceService(DB_CONFIG);

export function getPlace(req: Request, res: Response) {
	const id = parseInt(req.params.id);
	let currentUser = req.user as User;

	return placeService
		.getById(id, currentUser)
		.then(({ place, relationships }) => {
			const policy = new PlacePolicy(currentUser, place);
			if (!policy.show()) {
				return res.status(403).json({
					messages: [
						{
							variant: 'error',
							text: 'You are not authorized to access this content.',
						},
					],
				});
			}

			return res.json({
				data: place,
				relationships,
			});
		})
		.catch((error) => {
			if (error instanceof NotFoundError) {
				return res.status(404).send('Not found');
			}

			console.log('error', error);

			return res.status(422).json({
				messages: [{ variant: 'error', text: error.message }],
			});
		});
}

export default {
	getPlace,
};
