import { Request, Response } from 'express';
const express = require('express');
const router = express.Router();
// const cors = require('cors')//
// router.use(cors());
// router.all('*', cors());
import { RequiresAuthentication } from '../middleware';
var _ = require('lodash'); //added for testing

router.use(express.json()); // for parsing application/json
router.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

router.get('/', RequiresAuthentication, async (req: Request, res: Response) => {
	const db = req.app.get('db');

	const {
		page = 0,
		limit = 10,
		textToMatch = '',
		sortBy = 'Id',
		sort = 'asc',
	} = req.query;

	const offset = Number(page) * Number(limit) || 0;

	let counter = 0;
	let boats = [];

	if (textToMatch) {
		counter = await db
			.from('boat.boat')
			.where('name', 'like', `%${textToMatch}%`)
			.count('Id', { as: 'count' });

		boats = await db
			.select('*')
			.from('boat.boat')
			.where('name', 'like', `%${textToMatch}%`)
			//.orderBy('boat.boat.id', 'asc')
			.orderBy(`${sortBy}`, `${sort}`)
			.limit(limit)
			.offset(offset);
	} else {
		counter = await db.from('boat.boat').count('Id', { as: 'count' }).first();

		boats = await db
			.select('*')
			.from('boat.boat')
			//.orderBy('boat.boat.id', 'asc')
			.orderBy(`${sortBy}`, `${sort}`)
			.limit(limit)
			.offset(offset);
	}

	for (const boat of boats) {
		boat.owners = await db
			.select('boat.boatowner.currentowner', 'boat.Owner.OwnerName')
			.from('boat.boatowner')
			.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
			.where('boat.boatowner.boatid', boat.Id);
	}

	res.status(200).send({ count: counter, body: boats });
});

router.get(
	'/:boatId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');
		const { boatId } = req.params;

		const boat = await db
			.select('*')
			.from('boat.boat')
			.where('boat.boat.id', boatId)
			.first();

		if (!boat) {
			res.status(403).send('Boat id not found');
			return;
		}

		boat.pastNames = await db
			.select('*')
			.from('boat.pastnames')
			.where('boat.pastnames.boatid', boatId);

		boat.owners = await db
			.select(
				'boat.boatowner.currentowner',
				'boat.Owner.OwnerName',
				'boat.owner.id'
			) //added boat.owner.id to the query (I need this for the details button)
			.from('boat.boatowner')
			.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
			.where('boat.boatowner.boatid', boatId);

		boat.histories = await db
			.select('*')
			.from('boat.history')
			.where('boat.history.uid', boatId);

		res.status(200).send(boat);
	}
);

router.post(
	'/new',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const {
			boat = {},
			ownerNewArray = [],
			histories = [],
			pastNamesNewArray = [],
		} = req.body;
		// VALIDATION FOR THE REGISTRATION NUMBER
		const exists = await db
			.select('*')
			.from('boat.boat')
			.where('boat.boat.RegistrationNumber', boat.RegistrationNumber)
			.first();

		if (exists) {
			res.status(409).send('The Registration Number already exists');
			return;
		}

		const response = await db
			.insert(boat)
			.into('boat.boat')
			.returning('*')
			.then(async (rows: any) => {
				const newBoat = rows[0];

				if (ownerNewArray.length > 0) {
					const newOwners = ownerNewArray.map((owner: any) => ({
						...owner,
						BoatId: newBoat.Id,
					}));

					await db
						.insert(newOwners)
						.into('boat.boatowner')
						.returning('*')
						.then((rows: any) => {
							return rows;
						});
				}

				//Add the new past names (done)
				if (pastNamesNewArray.length > 0) {
					await db
						.insert(
							pastNamesNewArray.map((name: any) => ({
								BoatId: newBoat.Id,
								...name,
							}))
						)
						.into('boat.pastnames')
						.then((rows: any) => {
							return rows;
						});
				}

				if (histories.length > 0) {
					const newHistories = histories.map((history: any) => ({
						...history,
						UID: newBoat.Id,
					}));
					await db
						.insert(newHistories)
						.into('boat.history')
						.returning('*')
						.then((rows: any) => {
							return rows;
						});
				}

				return newBoat;
			});

		res.status(200).send(response);
	}
);

router.put(
	'/:boatId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const {
			boat = {},
			ownerNewArray = [],
			ownerRemovedArray = [],
			pastNamesNewArray = [],
			pastNamesEditArray = [],
		} = req.body;
		const { boatId } = req.params;

		await db('boat.boat').update(boat).where('boat.boat.id', boatId);

		if (ownerNewArray.length > 0) {
			await db
				.insert(
					ownerNewArray.map((owner: any) => ({ BoatId: boatId, ...owner }))
				)
				.into('boat.boatowner')
				.then((rows: any) => {
					return rows;
				});
		}

		for (const obj of ownerRemovedArray) {
			await db('boat.boatowner').where('boat.boatowner.ownerid', obj.id).del();
		}

		for (const obj of pastNamesEditArray) {
			await db('boat.pastnames')
				.update({ BoatName: obj.BoatName })
				.where('boat.pastnames.Id', obj.Id)
				.andWhere('boat.pastnames.BoatId', boatId);
		}

		if (pastNamesNewArray.length > 0) {
			await db
				.insert(
					pastNamesNewArray.map((name: any) => ({ BoatId: boatId, ...name }))
				)
				.into('boat.pastnames')
				.then((rows: any) => {
					return rows;
				});
		}

		res.status(200).send({ message: 'success' });
	}
);

router.get(
	'/available_number/:RegistrationNumber',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { RegistrationNumber } = req.params;
		let available = true;

		const exists = await db
			.select('*')
			.from('boat.boat')
			.where('boat.boat.RegistrationNumber', RegistrationNumber)
			.first();

		if (exists) {
			available = false;
		}

		res.status(200).send({ available });
	}
);

module.exports = router;
