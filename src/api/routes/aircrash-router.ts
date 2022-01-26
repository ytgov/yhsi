import express, { Request, Response } from "express";
import { DB_CONFIG } from '../config';
import knex from "knex";
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';

export const aircrashRouter = express.Router();
const db = knex(DB_CONFIG);

aircrashRouter.get(
	'/',
	[
		query('page').default(0).isInt(),
		query('limit').default(10).isInt({ gt: 0 }),
	],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		/* const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('view')) res.sendStatus(403);
  
    const db = req.app.get('db'); */

		const {
			textToMatch = '',
			sortBy = 'yacsinumber',
			sort = 'asc',
		} = req.query;
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		let counter = [{ count: 0 }];
		let aircrashes = [];

		if (textToMatch) {
			counter = await db
				.from('dbo.vAircrash')
				.where('yacsinumber', 'like', `%${textToMatch}%`)
				.orWhere('crashdate', 'like', `%${textToMatch}%`)
				.orWhere('aircrafttype', 'like', `%${textToMatch}%`)
				.orWhere('aircraftregistration', 'like', `%${textToMatch}%`)
				.orWhere('nation', 'like', `%${textToMatch}%`)
				.orWhere('militarycivilian', 'like', `%${textToMatch}%`)
				.orWhere('crashlocation', 'like', `%${textToMatch}%`)
				.orWhere('pilot', 'like', `%${textToMatch}%`)
				.orWhere('soulsonboard', 'like', `%${textToMatch}%`)
				.orWhere('injuries', 'like', `%${textToMatch}%`)
				.orWhere('fatalities', 'like', `%${textToMatch}%`)
				.count('yacsinumber', { as: 'count' });

			aircrashes = await db
				.select('*')
				.from('dbo.vAircrash')
				.where('yacsinumber', 'like', `%${textToMatch}%`)
				.orWhere('crashdate', 'like', `%${textToMatch}%`)
				.orWhere('aircrafttype', 'like', `%${textToMatch}%`)
				.orWhere('aircraftregistration', 'like', `%${textToMatch}%`)
				.orWhere('nation', 'like', `%${textToMatch}%`)
				.orWhere('militarycivilian', 'like', `%${textToMatch}%`)
				.orWhere('crashlocation', 'like', `%${textToMatch}%`)
				.orWhere('pilot', 'like', `%${textToMatch}%`)
				.orWhere('soulsonboard', 'like', `%${textToMatch}%`)
				.orWhere('injuries', 'like', `%${textToMatch}%`)
				.orWhere('fatalities', 'like', `%${textToMatch}%`)
				//.orderBy('yacsinumber', 'asc')
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db
				.from('dbo.vAircrash')
				.count('yacsinumber', { as: 'count' });

			aircrashes = await db
				.select('*')
				.from('dbo.vAircrash')
				//.orderBy('dbo.vAircrash.yacsinumber', 'asc')
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}

		res.status(200).send({ count: counter[0].count, body: aircrashes });
	}
);

aircrashRouter.get(
	'/:aircrashId',
	[param('aircrashId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		/*  const db = req.app.get('db');
   
     const permissions = req.decodedToken['yg-claims'].permissions;
     if (!permissions.includes('view')) res.sendStatus(403); */

		const { aircrashId } = req.params;
		const aircrash = await db
			.select('*')
			.from('dbo.vAircrash')
			.where('dbo.vAircrash.yacsinumber', aircrashId)
			.first();

		aircrash.infoSources = await db
			.select('*')
			.from('AirCrash.InfoSource')
			.where('AirCrash.InfoSource.YACSINumber', aircrashId);

		if (!aircrash) {
			res.status(403).send('Airplane crash id not found');
			return;
		}

		res.status(200).send(aircrash);
	}
);

aircrashRouter.put(
	'/:aircrashId',
	[param('aircrashId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		/*  const db = req.app.get('db');
     const permissions = req.decodedToken['yg-claims'].permissions;
     if (!permissions.includes('edit')) res.sendStatus(403); */

		const { aircrashId } = req.params;

		const {
			aircrash = {},
			removedInfoSources,
			newInfoSources,
			editedInfoSources,
		} = req.body;

		//make the update
		await db('AirCrash.AirCrash')
			.update(aircrash)
			.where('AirCrash.AirCrash.yacsinumber', aircrashId);

		//Add the new info sources (in progress)
		console.log(newInfoSources);
		await db
			.insert(
				newInfoSources.map((source: any) => ({
					YACSINumber: aircrashId,
					...source,
				}))
			)
			.into('AirCrash.InfoSource')
			.then((rows: any) => {
				return rows;
			});

		//remove the previous owners (DONE)
		for (const obj of removedInfoSources) {
			await db('AirCrash.InfoSource')
				.where('AirCrash.InfoSource.Id', obj.Id)
				.del();
		}

		//update the info sources (DONE)
		for (const obj of editedInfoSources) {
			await db('AirCrash.InfoSource')
				.update({ Source: obj.Source })
				.where('AirCrash.InfoSource.Id', obj.Id);
		}

		res.status(200).send({ message: 'success' });
	}
);

aircrashRouter.post('/', async (req: Request, res: Response) => {
	/* const db = req.app.get('db');
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('create')) res.sendStatus(403); */

	const { aircrash = {}, newInfoSources } = req.body;
	/*
      const response = await db.insert(aircrash)
        .into('AirCrash.AirCrash')
        .returning('*');
    */
	const exists = await db
		.select('*')
		.from('dbo.vAircrash')
		.where('dbo.vAircrash.yacsinumber', aircrash.yacsinumber)
		.first();

	if (exists) {
		//this is a 409 conflict, i might change the status to 409 after some tests
		res.status(409).send('The YACSI Number already exists');
		return;
	}

	const response = await db
		.insert(aircrash)
		.into('AirCrash.AirCrash')
		.returning('*')
		.then(async (rows: any) => {
			const newAirCrash = rows[0];

			if (newInfoSources.length) {
				const finalInfoSources = newInfoSources.map((source: any) => ({
					YACSINumber: newAirCrash.YACSINumber,
					...source,
				}));

				await db
					.insert(finalInfoSources)
					.into('AirCrash.InfoSource')
					.returning('*')
					.then((rows: any) => {
						return rows;
					});
			}

			return newAirCrash;
		});

	res.status(200).send(response);
});

aircrashRouter.get(
	'/available_yacsi/:YACSINumber',
	[param('YACSINumber').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		/* const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('view')) res.sendStatus(403);
  
    const db = req.app.get('db'); */

		const { YACSINumber } = req.params;
		let available = true;

		const exists = await db
			.select('*')
			.from('dbo.vAircrash')
			.where('dbo.vAircrash.yacsinumber', YACSINumber)
			.first();

		if (exists) {
			available = false;
		}

		res.status(200).send({ available });
	}
);
