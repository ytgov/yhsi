import knex from 'knex';
import { Request, Response } from 'express';

import { DB_CONFIG } from '../config';
import { buildDatabaseSort, PlaceService } from '../services';
import { User } from '../models';
import { NotFoundError } from '../utils/validation';
import { PlacePolicy, PlacePolicyScope } from '../policies';

const db = knex(DB_CONFIG);
const placeService = new PlaceService(DB_CONFIG);

export function getPlace(req: Request, res: Response) {
	const id = parseInt(req.params.id);
	let currentUser = req.user as User;

	return placeService
		.getById(id, currentUser)
		.then(({ place, relationships }) => {
			const policy = new PlacePolicy(currentUser, place);
			if (policy.show()) {
				return res.json({
					data: place,
					relationships,
				});
			}

			return res.status(403).json({
				messages: [
					{
						variant: 'error',
						text: 'You are not authorized to access this content.',
					},
				],
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

export function searchPlaces(req: Request, res: Response) {
	let { query, sortBy, sortDesc, page, itemsPerPage } = req.body;
	let currentUser = req.user as User;
	const sort = buildDatabaseSort(sortBy, sortDesc);

	let skip = (page - 1) * itemsPerPage;
	let take = itemsPerPage;

	const allPlaces = db('Place');
	const placePolicyScope = new PlacePolicyScope(allPlaces, currentUser);
	const permittedPlaces = placePolicyScope.resolve();

	return placeService
		.doSearch(permittedPlaces, query, sort, page, itemsPerPage, skip, take)
		.then((results) => {
			return res.json(results);
		})
		.catch((error) => {
			return res.status(422).json({
				messages: [{ variant: 'error', text: error.message }],
			});
		});
}

export default {
	getPlace,
	searchPlaces,
};
