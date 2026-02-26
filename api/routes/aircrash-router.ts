import { param, query } from 'express-validator';
import express, { Request, Response } from 'express';
import { difference } from 'lodash';
import { renderFile } from 'pug';
const {
	Parser,
	transforms: { unwind },
} = require('json2csv');

import db from '@/db/db-client';

import { ReturnValidationErrors } from '../middleware';
import { AircrashService } from '../services';
import { generatePDF } from '../utils/pdf-generator';
import { UserRoles } from '../models/user-roles';
import { authorize } from '../middleware/authorization';

export const aircrashRouter = express.Router();

const aircrashService = new AircrashService();

/* Routes which are available to
    UserRoles.AIRPLANE_CRASH_EDITOR,
		UserRoles.AIRPLANE_CRASH_VIEWER,
*/
const airCrashViewers = [
	// 'UserRoles.AIRPLANE_CRASH_VIEWER',

	UserRoles.AIRPLANE_CRASH_EDITOR,
	UserRoles.AIRPLANE_CRASH_VIEWER,
];

aircrashRouter.use(authorize(airCrashViewers));

aircrashRouter.get(
	'/',
	[query('page').default(0).isInt(), query('limit').default(10).isInt({ gt: 0 })],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		try {
			const {
				textToMatch = '',
				sortBy = 'yacsinumber',
				sort = 'asc',
				crashdate = '',
				aircrafttype = '',
				aircraftregistration = '',
				nation = '',
				militarycivilian = '',
				crashlocation = '',
				pilot = '',
				soulsonboard = '',
				injuries = '',
				fatalities = '',
			} = req.query;

			const page = parseInt(req.query.page?.toString() || '') || 1;
			const perPage = parseInt(req.query.limit?.toString() || '') || 10;

			const data = await aircrashService.doSearch(page, perPage, {
				textToMatch,
				sortBy,
				sort,
				crashdate,
				aircrafttype,
				aircraftregistration,
				nation,
				militarycivilian,
				crashlocation,
				pilot,
				soulsonboard,
				injuries,
				fatalities,
			});

			return res.status(200).send(data);
		} catch (error) {
			console.error(error);
			return res.status(400).send({ message: 'Error fetching airplane crashes' });
		}
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
	}
);

const airCrashEditors = [UserRoles.AIRPLANE_CRASH_EDITOR, UserRoles.ADMINISTRATOR];

aircrashRouter.use(authorize(airCrashEditors));

aircrashRouter.put(
	'/:aircrashId',
	[param('aircrashId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		/*  const db = req.app.get('db');
     const permissions = req.decodedToken['yg-claims'].permissions;
     if (!permissions.includes('edit')) res.sendStatus(403); */

		const { aircrashId } = req.params;

		const { aircrash = {}, removedInfoSources, newInfoSources, editedInfoSources } = req.body;
		//make the update
		await db('AirCrash.AirCrash')
			.update(aircrash)
			.where('AirCrash.AirCrash.yacsinumber', aircrashId);

		//Add the new info sources (in progress)

		if (newInfoSources && newInfoSources.length > 0) {
			await db
				.insert(
					newInfoSources.map((source: any) => ({
						YACSINumber: aircrashId,
						...source,
					}))
				)
				.into('AirCrash.InfoSource');
		}

		//remove the previous owners (DONE)
		for (const obj of removedInfoSources) {
			await db('AirCrash.InfoSource').where('AirCrash.InfoSource.Id', obj.Id).del();
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
	try {
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

					await db.insert(finalInfoSources).into('AirCrash.InfoSource');
				}

				return newAirCrash;
			});

		res.status(200).send(response);
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
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

		const aircrash = await aircrashService.getById(aircrashId);

		if (!aircrash) {
			res.status(404).send({ message: 'Data not found' });
			return;
		}
		// Compile template.pug, and render a set of data
		const data = renderFile('./templates/aircrashes/aircrashView.pug', {
			data: aircrash,
		});

		const pdf = await generatePDF(data);
		res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
	}
);

aircrashRouter.post('/pdf', async (req: Request, res: Response) => {
	const { page = 1, limit = 0, filters = {} } = req.body;
	const aircrashes = await aircrashService.doSearch(page, limit, filters);

	// Compile template.pug, and render a set of data
	const data = renderFile('./templates/aircrashes/aircrashGrid.pug', {
		data: aircrashes.body,
	});

	const pdf = await generatePDF(data);
	res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
	res.setHeader('Content-type', 'application/pdf');
	res.send(pdf);
});

aircrashRouter.post('/export', async (req: Request, res: Response) => {
	const { page = 1, limit = 0, filters = {} } = req.body;

	const aircrashes = await aircrashService.doSearch(page, limit, filters);
	const json2csvParser = new Parser();

	const csv = json2csvParser.parse(aircrashes.body);
	res.setHeader('Content-Type', 'text/csv');
	res.attachment('boats.csv').send(csv);
});

aircrashRouter.post(
	'/:yacsiNumber/photos/link',
	authorize([UserRoles.SITE_ADMIN, UserRoles.SITE_EDITOR, UserRoles.ADMINISTRATOR]),
	async (request: Request, response: Response) => {
		try {
			const { yacsiNumber } = request.params;
			const { linkPhotos } = request.body;

			const currentPhotos = await db
				.select('Photo_RowID')
				.from('AirCrash.Photo')
				.where('YACSINumber', yacsiNumber);

			const filteredLinkPhotos = difference(
				linkPhotos,
				currentPhotos.map((x: any) => {
					return x.Photo_RowID;
				})
			);

			for (const photo of filteredLinkPhotos) {
				await db
					.insert({ YACSINumber: yacsiNumber, Photo_RowID: photo.rowId })
					.into('AirCrash.Photo')
					.returning('*')
					.then((rows: any) => {
						return rows;
					});
			}

			return response.json({ message: 'Successfully linked the photos' });
		} catch (error) {
			console.log(error);
			return response.status(500).json({ data: 'failed to link' });
		}
	}
);
