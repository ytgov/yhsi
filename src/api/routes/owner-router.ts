import express, { Request, Response } from "express";
import { DB_CONFIG } from '../config';
import knex from "knex";
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import { BoatOwnerService } from "../services";
import { renderFile } from "pug";
import { generatePDF } from "../utils/pdf-generator";

export const ownerRouter = express.Router();
const boatOwnerService = new BoatOwnerService();
const db = knex(DB_CONFIG);

ownerRouter.get(
	'/',
	[
		query('page').default(0).isInt(),
		query('limit').default(10).isInt({ gt: 0 }),
	],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {

		const { textToMatch = '', sortBy = 'OwnerName', sort = 'asc' } = req.query;
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		let data = await boatOwnerService.doSearch(page, limit, offset, {textToMatch, sortBy, sort});

		res.status(200).send(data);
	}
);

ownerRouter.get(
	'/:ownerId',
	[param('ownerId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {

		const { ownerId } = req.params;
		const owner = await boatOwnerService.getById(ownerId);

		res.status(200).send(owner);
	}
);

ownerRouter.put(
	'/:ownerId',
	[param('ownerId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {

		const { ownerId } = req.params;
		const { owner = {}, newOwnerAlias = [], editOwnerAlias = [], newBoatsOwned = [] } = req.body;
		const { OwnerName } = owner;
		
		await db('Boat.Owner')
			.update({ OwnerName })
			.where('Boat.Owner.Id', ownerId);

		let newArray = [];
		// const editArray = [];

		newArray = newOwnerAlias.map((alias: any) => {
			return { OwnerId: ownerId, ...alias };
		});
		if(newArray.lenth > 0){
			await db
			.insert(newArray)
			.into('boat.OwnerAlias')
			.returning('*')
			.then((rows: any) => {
				return rows;
			});
		}


		for (const obj of editOwnerAlias) {
			await db('boat.OwnerAlias')
				.update({ Alias: obj.Alias })
				.where('boat.OwnerAlias.id', obj.Id);
		}
		//BOATS OWNED
		let newBoats = newBoatsOwned.map((boatOwned: any) => { return { OwnerId: ownerId, BoatID: boatOwned.BoatID, CurrentOwner: 0 } });

		if(newBoats.length > 0){
			await db
			.insert(newBoats)
			.into('boat.BoatOwner')
			.returning('*')
			.then((rows: any) => {
				return rows;
			});
		}
		

		res.status(200).send({ message: 'success' });
	}
);

// changed this route from "/new" to "/" to follow RESTFUL conventions
ownerRouter.post('/', async (req: Request, res: Response) => {

	const { owner = {}, newOwnerAlias = [], newBoatsOwned = [] } = req.body;
		// const editArray = [];
	const response = await db
		.insert(owner)
		.into('boat.owner')
		.returning('*')
		.then(async (rows: any) => {
			const newOwner = rows[0];

			if (newOwnerAlias.length) {
				const newArray = newOwnerAlias.map((alias: any) => ({
					...alias,
					OwnerId: newOwner.Id,
				}));

				await db
					.insert(newArray)
					.into('boat.OwnerAlias')
					.returning('*')
					.then((rows: any) => {
						return rows;
					});
			}
			if(newBoatsOwned.length){
				let newBoats = newBoatsOwned.map((boatOwned: any) => { return { OwnerId: newOwner.Id, BoatID: boatOwned.BoatID, CurrentOwner: 0 } });
				await db
				.insert(newBoats)
				.into('boat.BoatOwner')
				.returning('*')
				.then((rows: any) => {
					return rows;
				});
			}

			return newOwner;
		});

	res.status(200).send(response);
});


//PDF EXPORTS

ownerRouter.post(
	'/pdf/:ownerId',
	[param('ownerId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { ownerId } = req.params;

		const owner = await boatOwnerService.getById(ownerId);

		let data = renderFile('./templates/boat-owners/boatOwnerView.pug', {
			data: owner
		});

		let pdf = await generatePDF(data)
		res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
});


ownerRouter.post('/pdf', async (req: Request, res: Response) => {
		
	let owners = await boatOwnerService.getAll();

	//console.log(owners);
	let data = renderFile('./templates/boat-owners/boatOwnerGrid.pug', {
		data: owners
	});

	let pdf = await generatePDF(data)
	res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
	res.setHeader('Content-type', 'application/pdf');
	res.send(pdf);
}
);

ownerRouter.post('/export', async (req: Request, res: Response) => {
	
	let data = await boatOwnerService.getAll();

	res.status(200).send(data);
});


