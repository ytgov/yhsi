import express, { Request, Response } from 'express';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import { AircrashService } from '../services';
import { renderFile } from "pug";
import puppeteer from "puppeteer";

export const aircrashRouter = express.Router();
const db = knex(DB_CONFIG);
const aircrashService = new AircrashService();

aircrashRouter.get(
	'/',
	[
		query('page').default(0).isInt(),
		query('limit').default(10).isInt({ gt: 0 }),
	],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {

		const {
			textToMatch = '',
			sortBy = 'yacsinumber',
			sort = 'asc',
		} = req.query;
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;

		const data = await aircrashService.doSearch(page, limit, offset, 
		{ 
			textToMatch,
			sortBy,
			sort 
		});

		res.status(200).send(data);
	}
);

aircrashRouter.get(
	'/:aircrashId',
	[param('aircrashId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {

		const { aircrashId } = req.params;
		const aircrash = await aircrashService.getById(aircrashId);

		if (!aircrash) {
			res.status(404).send('Airplane crash id not found');
			return;
		}

		res.status(200).send(aircrash);
});

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
		//console.log(newInfoSources);
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


//PDFS 
aircrashRouter.post(
	'/pdf/:aircrashId',
	[param('aircrashId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { aircrashId } = req.params;

		let aircrash = await aircrashService.getById(aircrashId);
		
		if(!aircrash) {
			res.status(404).send({ message: "Data not found"});
			return;
		}
		// Compile template.pug, and render a set of data
		let data = renderFile('./templates/aircrashes/aircrashView.pug', {
			data: aircrash
		});

		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.setContent(data);
		const pdf = await page.pdf({ format: "a3", landscape: true });
	
		res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
});

aircrashRouter.post('/pdf', async (req: Request, res: Response) => {

	let aircrashes = await aircrashService.getAll();

	// Compile template.pug, and render a set of data
	let data = renderFile('./templates/aircrashes/aircrashGrid.pug', {
		data: aircrashes
	});

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setContent(data);
	const pdf = await page.pdf({ format: "a3", landscape: true });

	res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
	res.setHeader('Content-type', 'application/pdf');
	res.send(pdf);
});

aircrashRouter.post('/export', async (req: Request, res: Response) => {
	
	let aircrashes = await aircrashService.getAll();

	res.status(200).send(aircrashes);
});