import express, { Request, Response } from 'express';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import { BoatService } from '../services';
import { renderFile } from 'pug';
import { generatePDF } from '../utils/pdf-generator';
import { authorize } from '../middleware/authorization';
import { UserRoles } from '../models';
const {
	Parser,
	transforms: { unwind },
} = require('json2csv');
export const boatsRouter = express.Router();
const db = knex(DB_CONFIG);
const boatService = new BoatService();

boatsRouter.get(
	'/',
	authorize([
		UserRoles.ADMINISTRATOR,
		UserRoles.BOATS_EDITOR,
		UserRoles.BOATS_VIEWER,
	]),
	[
		query('textToMatch').default('').isString(),
		query('sortBy').default('Name').isString(),
		query('sort').default('asc').isString(),
		query('page').default(0).isInt(),
		query('limit').default(10).isInt({ gt: 0 }),
	],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const {
			textToMatch = '',
			Owner = '',
			ConstructionDate = '',
			ServiceStart = '',
			ServiceEnd = '',
			sortBy = 'Name',
			sort = 'asc',
		} = req.query;
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;

		const data = await boatService.doSearch(page, limit, offset, {
			textToMatch,
			Owner,
			ConstructionDate,
			ServiceStart,
			ServiceEnd,
			sortBy,
			sort,
		});

		res.status(200).send(data);
	}
);

boatsRouter.get(
	'/:boatId',
	authorize([
		UserRoles.ADMINISTRATOR,
		UserRoles.BOATS_EDITOR,
		UserRoles.BOATS_VIEWER,
	]),
	[param('boatId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { boatId } = req.params;
		const boat = await boatService.getById(parseInt(boatId));

		if (!boat) {
			res.status(404).send({ message: 'Data not found' });
			return;
		}

		res.status(200).send(boat);
	}
);

// changed this route from "/new" to "/" to follow RESTFUL conventions
boatsRouter.post(
	'/',
	authorize([UserRoles.ADMINISTRATOR, UserRoles.BOATS_EDITOR]),
	async (req: Request, res: Response) => {
		/*   const db = req.app.get('db');
  
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('create')) res.sendStatus(403);
   */
		const {
			boat = {},
			ownerNewArray = [],
			histories = [],
			pastNamesNewArray = [],
		} = req.body;

		const response = await db
			.insert(boat)
			.into('boat.boat')
			.returning('*')
			.then(async (rows: any) => {
				const newBoat = rows[0];

				if (ownerNewArray.length) {
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

				if (histories.length) {
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

		res.send(response);
	}
);

boatsRouter.put(
	'/:boatId',
	authorize([UserRoles.ADMINISTRATOR, UserRoles.BOATS_EDITOR]),
	async (req: Request, res: Response) => {
		/*  const db = req.app.get('db');
   const permissions = req.decodedToken['yg-claims'].permissions;
   if (!permissions.includes('edit')) res.sendStatus(403);
  */
		const {
			boat = {},
			ownerNewArray = [],
			ownerRemovedArray = [],
			pastNamesNewArray = [],
			pastNamesEditArray = [],
		} = req.body;
		const { boatId } = req.params;
		//make the update

		await db('boat.boat').update(boat).where('boat.boat.id', boatId);

		//Add the new owners (done)
		await db
			.insert(ownerNewArray.map((owner: any) => ({ BoatId: boatId, ...owner })))
			.into('boat.boatowner')
			.then((rows: any) => {
				return rows;
			});

		//remove the previous owners (done)
		for (const obj of ownerRemovedArray) {
			await db('boat.boatowner').where('boat.boatowner.ownerid', obj.id).del();
		}

		//update the past names (seems to work!)
		for (const obj of pastNamesEditArray) {
			await db('boat.pastnames')
				.update({ BoatName: obj.BoatName })
				.where('boat.pastnames.Id', obj.Id)
				.andWhere('boat.pastnames.BoatId', boatId);
		}

		//Add the new past names (done)
		await db
			.insert(
				pastNamesNewArray.map((name: any) => ({ BoatId: boatId, ...name }))
			)
			.into('boat.pastnames')
			.then((rows: any) => {
				return rows;
			});

		res.status(200).send({ message: 'success' });
	}
);

//PDF AND EXPORTS
boatsRouter.post(
	'/pdf/:boatId',
	authorize([
		UserRoles.ADMINISTRATOR,
		UserRoles.BOATS_EDITOR,
		UserRoles.BOATS_VIEWER,
	]),
	[param('boatId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { boatId } = req.params;

		const boat = await boatService.getById(parseInt(boatId));

		let data = renderFile('./templates/boats/boatView.pug', {
			data: boat,
		});

		let pdf = await generatePDF(data);
		res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
	}
);

boatsRouter.post(
	'/pdf',
	authorize([
		UserRoles.ADMINISTRATOR,
		UserRoles.BOATS_EDITOR,
		UserRoles.BOATS_VIEWER,
	]),
	async (req: Request, res: Response) => {
		const {
			textToMatch = '',
			Owner = '',
			ConstructionDate = '',
			ServiceStart = '',
			ServiceEnd = '',
			sortBy = 'Name',
			sort = 'asc',
			page = 0,
			limit = 0,
		} = req.body;

		const boats = await boatService.doSearch(page, limit, 0, {
			textToMatch,
			Owner,
			ConstructionDate,
			ServiceStart,
			ServiceEnd,
			sortBy,
			sort,
		});
		let data = renderFile('./templates/boats/boatGrid.pug', {
			data: boats.body,
		});

		let pdf = await generatePDF(data);
		res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
	}
);

boatsRouter.post(
	'/export',
	authorize([
		UserRoles.ADMINISTRATOR,
		UserRoles.BOATS_EDITOR,
		UserRoles.BOATS_VIEWER,
	]),
	async (req: Request, res: Response) => {
		const {
			textToMatch = '',
			Owner = '',
			ConstructionDate = '',
			ServiceStart = '',
			ServiceEnd = '',
			sortBy = 'Name',
			sort = 'asc',
			page = 0,
			limit = 0,
		} = req.body;

		const boats = await boatService.doSearch(page, limit, 0, {
			textToMatch,
			Owner,
			ConstructionDate,
			ServiceStart,
			ServiceEnd,
			sortBy,
			sort,
		});

		const json2csvParser = new Parser();

		const csv = json2csvParser.parse(boats.body);

		res.setHeader('Content-Type', 'text/csv');
		res.attachment('boats.csv').send(csv);
	}
);
