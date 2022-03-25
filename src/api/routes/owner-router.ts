import express, { Request, Response } from "express";
import { DB_CONFIG } from '../config';
import knex from "knex";
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import { BoatOwnerService } from "../services";
<<<<<<< HEAD
const pdf = require('html-pdf');
const pug = require('pug');
=======
import { renderFile } from "pug";
import { generatePDF } from "../utils/pdf-generator";

>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
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

		const { textToMatch = '', sortBy = 'ownerid', sort = 'asc' } = req.query;
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


//PDF EXPORTS

ownerRouter.post(
	'/pdf/:ownerId',
	[param('ownerId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { ownerId } = req.params;

		const owner = await boatOwnerService.getById(ownerId);

<<<<<<< HEAD
		let data = pug.renderFile('./templates/boat-owners/boatOwnerView.pug', {
			data: owner
		});
		res.setHeader('Content-disposition', 'attachment; filename="owner.html"');
		res.setHeader('Content-type', 'application/pdf');
		pdf.create(data, {
			format: 'A3',
			orientation: 'landscape'
		}).toBuffer(function(err: any, buffer: any){
			//console.log(err);
			//console.log('This is a buffer:', Buffer.isBuffer(buffer));

			res.send(buffer);
		}); 
=======
		let data = renderFile('./templates/boat-owners/boatOwnerView.pug', {
			data: owner
		});

		let pdf = await generatePDF(data)
		res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
});


ownerRouter.post('/pdf', async (req: Request, res: Response) => {
		
	let owners = await boatOwnerService.getAll();

	//console.log(owners);
<<<<<<< HEAD
	let data = pug.renderFile('./templates/boat-owners/boatOwnerGrid.pug', {
		data: owners
	});

	res.setHeader('Content-disposition', 'attachment; filename="owners.html"');
	res.setHeader('Content-type', 'application/pdf');
	pdf.create(data, {
		format: 'A3',
		orientation: 'portrait'
	}).toBuffer(function(err: any, buffer: any){
		//console.log(err);
		//console.log('This is a buffer:', Buffer.isBuffer(buffer));

		res.send(buffer);
	});
=======
	let data = renderFile('./templates/boat-owners/boatOwnerGrid.pug', {
		data: owners
	});

	let pdf = await generatePDF(data)
	res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
	res.setHeader('Content-type', 'application/pdf');
	res.send(pdf);
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
}
);

ownerRouter.post('/export', async (req: Request, res: Response) => {
	
	let data = await boatOwnerService.getAll();

	res.status(200).send(data);
});


