import express, { Request, Response } from "express";
import { DB_CONFIG } from '../config';
import knex from "knex";
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';

export const ownerRouter = express.Router();
const db = knex(DB_CONFIG);

ownerRouter.get(
	'/',
	[
		query('page').default(0).isInt(),
		query('limit').default(10).isInt({ gt: 0 }),
	],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		/*  const permissions = req.decodedToken['yg-claims'].permissions;
	 if (!permissions.includes('view')) res.sendStatus(403);
	*/
		const { textToMatch = '', sortBy = 'ownerid', sort = 'asc' } = req.query;
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		let counter = [{ count: 0 }];
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
				.limit(limit)
				.offset(offset);
		}

		res.status(200).send({ count: counter[0].count, body: owners });
	}
);

ownerRouter.get(
	'/:ownerId',
	[param('ownerId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		/*  const permissions = req.decodedToken['yg-claims'].permissions;
	 if (!permissions.includes('view')) res.sendStatus(403);
   
	 const db = req.app.get('db'); */
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

ownerRouter.put(
	'/:ownerId',
	[param('ownerId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		/*   const db = req.app.get('db');
	  const permissions = req.decodedToken['yg-claims'].permissions;
	  if (!permissions.includes('edit')) res.sendStatus(403);
	 */
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

// changed this route from "/new" to "/" to follow RESTFUL conventions
ownerRouter.post('/', async (req: Request, res: Response) => {
	/*   const db = req.app.get('db');
  
	const permissions = req.decodedToken['yg-claims'].permissions;
	if (!permissions.includes('create')) res.sendStatus(403); */

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
});
