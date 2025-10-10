import { Request, Response } from 'express';
var express = require('express');
var router = express.Router();
import { RequiresAuthentication } from '../middleware';
// const cors = require('cors')//
// router.use(cors());
// router.all('*', cors());
router.get('/', RequiresAuthentication, async (req: Request, res: Response) => {
	const db = req.app.get('db');
	const {
		page = 0,
		limit = 10,
		textToMatch = '',
		sortBy = 'ownerid',
		sort = 'asc',
	} = req.query;
	const offset = Number(page) * Number(limit) || 0;
	let counter = 0;
	let owners = [];

	if (textToMatch) {
		counter = await db
			.from('boat.Owner AS BO')
			.join('boat.boatowner AS CO', 'CO.ownerid', '=', 'BO.Id')
			.where('BO.OwnerName', 'like', `%${textToMatch}%`)
			.countDistinct('BO.id', { as: 'count' });

		owners = await db
			.select(
				'boat.boatowner.currentowner',
				'boat.Owner.OwnerName',
				'boat.owner.id'
			)
			.distinct('boat.boatowner.ownerid')
			.from('boat.boatowner')
			.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
			//.orderBy('boat.boatowner.ownerid', 'asc')
			.orderBy(`${sortBy}`, `${sort}`)
			.where('boat.Owner.OwnerName', 'like', `%${textToMatch}%`)
			.limit(limit)
			.offset(offset);
	} else {
		counter = await db
			.from('boat.Owner AS BO')
			.join('boat.boatowner AS CO', 'CO.ownerid', '=', 'BO.Id')
			.countDistinct('BO.id', { as: 'count' })
			.first();

		owners = await db
			.select(
				'boat.boatowner.currentowner',
				'boat.Owner.OwnerName',
				'boat.owner.id'
			)
			.distinct('boat.boatowner.ownerid')
			.from('boat.boatowner')
			.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
			//.orderBy('boat.boatowner.ownerid', 'asc')
			.orderBy(`${sortBy}`, `${sort}`)
			.limit(limit)
			.offset(offset);
	}

	res.status(200).send({ count: counter, body: owners });
});

router.get(
	'/:ownerId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');
		const { ownerId } = req.params;
		const owner = await db
			.select('*')
			.distinct('boat.boatowner.ownerid')
			.from('boat.boatowner')
			.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
			.where('boat.boatowner.ownerid', ownerId)
			.first();

		owner.boats = await db
			.select('*')
			.from('boat.boat')
			.join('boat.BoatOwner', 'boat.BoatOwner.boatid', '=', 'boat.boat.id')
			.where('boat.boatowner.ownerid', ownerId);

		owner.histories = await db
			.select('*')
			.from('boat.OwnerHistory')
			.where('boat.OwnerHistory.OwnerId', ownerId);

		owner.alias = await db
			.select('*')
			.from('boat.owneralias')
			.where('boat.owneralias.ownerid', ownerId);

		res.status(200).send(owner);
	}
);

router.put(
	'/:ownerId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { ownerId } = req.params;

		const { owner = {}, newOwnerAlias = [], editOwnerAlias = [] } = req.body;
		const { OwnerName } = owner;

		await db('boat.owner')
			.update({ OwnerName })
			.where('boat.owner.id', ownerId);

		let newArray = [];
		// const editArray = [];

		newArray = newOwnerAlias.map((alias: any) => {
			return { OwnerId: ownerId, ...alias };
		});

		await db
			.insert(newArray)
			.into('boat.OwnerAlias')
			.returning('*')
			.then((rows: any) => {
				return rows;
			});

		for (const obj of editOwnerAlias) {
			await db('boat.OwnerAlias')
				.update({ Alias: obj.Alias })
				.where('boat.OwnerAlias.id', obj.Id);
		}

		res.status(200).send({ message: 'success' });
	}
);

router.post(
	'/new',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { owner = {}, ownerAlias = [] } = req.body;

		const response = await db
			.insert(owner)
			.into('boat.owner')
			.returning('*')
			.then(async (rows: any) => {
				const newOwner = rows[0];

				if (ownerAlias.length) {
					const newOwnerAlias = ownerAlias.map((alias: any) => ({
						...alias,
						OwnerId: newOwner.Id,
					}));

					await db
						.insert(newOwnerAlias)
						.into('boat.OwnerAlias')
						.returning('*')
						.then((rows: any) => {
							return rows;
						});
				}

				return newOwner;
			});

		res.status(200).send(response);
	}
);

module.exports = router;
