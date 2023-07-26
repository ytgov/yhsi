import express, { Request, Response } from 'express';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import { BurialService } from '../services';
import { renderFile } from 'pug';
import { generatePDF } from '../utils/pdf-generator';
const {
	Parser,
	transforms: { unwind },
} = require('json2csv');
export const burialsRouter = express.Router();
const db = knex(DB_CONFIG);
const burialService = new BurialService();

burialsRouter.get(
	'/',
	[
		query('page').default(0).isInt(),
		query('limit').default(10).isInt({ gt: 0 }),
	],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const {
			textToMatch = '',
			sortBy = 'LastName',
			sort = 'asc',
			BirthYear = '',
			BirthMonth = '',
			BirthDay = '',
			DeathYear = '',
			DeathMonth = '',
			DeathDay = '',
			Gender = '',
			Cause = '',
			Manner = '',
			Cemetary = '',
			OriginCountry = '',
		} = req.query;

		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;

		const data = await burialService.doSearch(page, limit, offset, {
			textToMatch,
			sortBy,
			sort,
			BirthYear,
			BirthMonth,
			BirthDay,
			DeathYear,
			DeathMonth,
			DeathDay,
			Gender,
			Cause,
			Manner,
			Cemetary,
			OriginCountry,
		});

		res.status(200).send(data);
	}
);

burialsRouter.get(
	'/:burialId',
	[param('burialId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { burialId } = req.params;
		const burial = await burialService.getById(burialId);

		if (!burial) {
			res.status(404).send('Burial not found');
			return;
		}

		res.status(200).send(burial);
	}
);

// changed this route from "/new" to "/" to follow RESTFUL conventions
burialsRouter.post('/', async (req: Request, res: Response) => {
	const {
		burial = {},
		Memberships,
		SiteVisits,
		Kinships,
		Occupations,
		Sources,
	} = req.body;

	const response = await db
		.insert(burial)
		.into('Burial.Burial')
		.returning('*')
		.then(async (rows: any) => {
			const newBurial = rows[0];
			//OCCUPATIONS
			await db
				.insert(
					Occupations.filter((x: any) => x.new == true && !x.deleted).map(
						(x: any) => ({
							BurialID: newBurial.BurialID,
							OccupationID: x.OccupationLupID,
						})
					)
				)
				.into('Burial.Occupation')
				.then((rows: any) => {
					return rows;
				});
			//MEMBERSHIPS
			await db
				.insert(
					Memberships.filter((x: any) => x.new == true).map((x: any) => ({
						BurialID: newBurial.BurialID,
						MembershipID: x.MembershipLUpID,
						Chapter: x.Chapter,
						Notes: x.Notes,
					}))
				)
				.into('Burial.Membership')
				.then((rows: any) => {
					return rows;
				});
			//KINSHIPS
			await db
				.insert(
					Kinships.filter((x: any) => x.new == true).map((x: any) => ({
						BurialID: newBurial.BurialID,
						RelationshipID: x.RelationshipID,
						Quantity: x.Quantity,
						Name: x.Name,
						Location: x.Location,
					}))
				)
				.into('Burial.NOKin')
				.then((rows: any) => {
					return rows;
				});
			//SITE VISITS
			await db
				.insert(
					SiteVisits.filter((x: any) => x.new == true).map((x: any) => ({
						BurialID: newBurial.BurialID,
						VisitYear: x.VisitYear,
						Condition: x.Condition,
						MarkerDescription: x.MarkerDescription,
						Inscription: x.Inscription,
						RecordedBy: x.RecordedBy,
					}))
				)
				.into('Burial.SiteVisit')
				.then((rows: any) => {
					return rows;
				});
			//SOURCES
			await db
				.insert(
					Sources.filter((x: any) => x.new == true).map((x: any) => ({
						BurialID: newBurial.BurialID,
						Source: x.Source,
					}))
				)
				.into('Burial.Source')
				.then((rows: any) => {
					return rows;
				});

			return newBurial;
		});

	res.send(response);
});

burialsRouter.put('/:burialId', async (req: Request, res: Response) => {
	const {
		burial = {},
		Memberships,
		SiteVisits,
		Kinships,
		Occupations,
		Sources,
	} = req.body;
	const { burialId } = req.params;

	let resp = await db('Burial.Burial')
		.update(burial)
		.where('Burial.Burial.BurialID', burialId);
	if (!resp) {
		res.status(404).send({ message: 'Burial not found' });
	}

	//OCCUPATIONS
	await db
		.insert(
			Occupations.filter((x: any) => x.new == true && !x.deleted).map(
				(x: any) => ({ BurialID: burialId, OccupationID: x.OccupationLupID })
			)
		)
		.into('Burial.Occupation')
		.then((rows: any) => {
			return rows;
		});

	const deletedOccupations = Occupations.filter(
		(x: any) => x.deleted == true
	).map((x: any) => ({
		BurialID: burialId,
		OccupationID: x.OccupationID,
		ID: x.ID,
	}));
	for (const item of deletedOccupations) {
		await db('Burial.Occupation').where('Burial.Occupation.ID', item.ID).del();
	}

	const editOccupations = Occupations.filter(
		(x: any) => x.edited == true && x.deleted == undefined
	).map((x: any) => ({
		BurialID: burialId,
		OccupationID: x.OccupationID,
		ID: x.ID,
	}));
	for (const item of editOccupations) {
		await db('Burial.Occupation')
			.update({ BurialID: burialId, OccupationID: item.OccupationID })
			.where('Burial.Occupation.ID', item.ID);
	}

	//MEMBERSHIPS
	await db
		.insert(
			Memberships.filter((x: any) => x.new == true).map((x: any) => ({
				BurialID: burialId,
				MembershipID: x.MembershipLUpID,
				Chapter: x.Chapter,
				Notes: x.Notes,
			}))
		)
		.into('Burial.Membership')
		.then((rows: any) => {
			return rows;
		});

	const deletedMemberships = Memberships.filter(
		(x: any) => x.deleted == true
	).map((x: any) => ({ BurialID: burialId, ID: x.ID }));
	for (const item of deletedMemberships) {
		await db('Burial.Membership').where('Burial.Membership.ID', item.ID).del();
	}

	const editMemberships = Memberships.filter(
		(x: any) => x.edited == true && x.deleted == undefined
	).map((x: any) => ({
		BurialID: burialId,
		MembershipID: x.MembershipLUpID,
		Chapter: x.Chapter,
		Notes: x.Notes,
		ID: x.ID,
	}));
	for (const item of editMemberships) {
		await db('Burial.Membership')
			.update({
				BurialID: burialId,
				MembershipID: item.MembershipLUpID,
				Chapter: item.Chapter,
				Notes: item.Notes,
			})
			.where('Burial.Membership.ID', item.ID);
	}

	//KINSHIPS
	await db
		.insert(
			Kinships.filter((x: any) => x.new == true).map((x: any) => ({
				BurialID: burialId,
				RelationshipID: x.RelationshipID,
				Quantity: x.Quantity,
				Name: x.Name,
				Location: x.Location,
			}))
		)
		.into('Burial.NOKin')
		.then((rows: any) => {
			return rows;
		});

	const deletedKinships = Kinships.filter((x: any) => x.deleted == true).map(
		(x: any) => ({ BurialID: burialId, ID: x.NOKID })
	);
	for (const item of deletedKinships) {
		await db('Burial.NOKin').where('Burial.NOKin.NOKID', item.ID).del();
	}

	const editKinships = Kinships.filter(
		(x: any) => x.edited == true && x.deleted == undefined
	).map((x: any) => ({
		BurialID: burialId,
		RelationshipID: x.RelationshipID,
		Quantity: x.Quantity,
		Name: x.Name,
		Location: x.Location,
		ID: x.NOKID,
	}));
	for (const item of editKinships) {
		await db('Burial.NOKin')
			.update({
				BurialID: burialId,
				RelationshipID: item.RelationshipID,
				Quantity: item.Quantity,
				Name: item.Name,
				Location: item.Location,
			})
			.where('Burial.NOKin.NOKID', item.ID);
	}

	//SITE VISITS
	await db
		.insert(
			SiteVisits.filter((x: any) => x.new == true).map((x: any) => ({
				BurialID: burialId,
				VisitYear: x.VisitYear,
				Condition: x.Condition,
				MarkerDescription: x.MarkerDescription,
				Inscription: x.Inscription,
				RecordedBy: x.RecordedBy,
			}))
		)
		.into('Burial.SiteVisit')
		.then((rows: any) => {
			return rows;
		});

	const deletedSiteVisits = SiteVisits.filter(
		(x: any) => x.deleted == true
	).map((x: any) => ({ BurialID: burialId, ID: x.SiteVisitID }));
	for (const item of deletedSiteVisits) {
		await db('Burial.SiteVisit')
			.where('Burial.SiteVisit.SiteVisitID', item.ID)
			.del();
	}

	const editSiteVisits = SiteVisits.filter(
		(x: any) => x.edited == true && x.deleted == undefined
	).map((x: any) => ({
		BurialID: burialId,
		VisitYear: x.VisitYear,
		Condition: x.Condition,
		MarkerDescription: x.MarkerDescription,
		Inscription: x.Inscription,
		RecordedBy: x.RecordedBy,
		ID: x.SiteVisitID,
	}));
	for (const item of editSiteVisits) {
		await db('Burial.SiteVisit')
			.update({
				BurialID: burialId,
				VisitYear: item.VisitYear,
				Condition: item.Condition,
				MarkerDescription: item.MarkerDescription,
				Inscription: item.Inscription,
				RecordedBy: item.RecordedBy,
			})
			.where('Burial.SiteVisit.SiteVisitID', item.ID);
	}

	//SOURCES
	await db
		.insert(
			Sources.filter((x: any) => x.new == true).map((x: any) => ({
				BurialID: burialId,
				Source: x.Source,
			}))
		)
		.into('Burial.Source')
		.then((rows: any) => {
			return rows;
		});

	const deletedSources = Sources.filter((x: any) => x.deleted == true).map(
		(x: any) => ({ BurialID: burialId, Source: x.Source, ID: x.SourceID })
	);
	for (const item of deletedSources) {
		await db('Burial.Source').where('Burial.Source.SourceID', item.ID).del();
	}

	const editSources = Sources.filter(
		(x: any) => x.edited == true && x.deleted == undefined
	).map((x: any) => ({ BurialID: burialId, Source: x.Source, ID: x.SourceID }));
	for (const item of editSources) {
		await db('Burial.Source')
			.update({ BurialID: burialId, Source: item.Source })
			.where('Burial.Source.SourceID', item.ID);
	}

	res.status(200).send({ message: 'success' });
});

//PDFS
burialsRouter.post(
	'/pdf/:burialId',
	[param('burialId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { burialId } = req.params;

		let burial = await burialService.getById(burialId);

		if (!burial) {
			res.status(404).send({ message: 'Data not found' });
			return;
		}
		// Compile template.pug, and render a set of data
		let data = renderFile('./templates/burials/burialView.pug', {
			data: burial,
		});

		let pdf = await generatePDF(data);
		res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
	}
);

burialsRouter.post('/pdf', async (req: Request, res: Response) => {
	const {
		page = 0,
		limit = 0,
		textToMatch = '',
		sortBy = 'LastName',
		sort = 'asc',
		BirthYear = '',
		BirthMonth = '',
		BirthDay = '',
		DeathYear = '',
		DeathMonth = '',
		DeathDay = '',
		Gender = '',
		Cause = '',
		Manner = '',
		Cemetary = '',
		OriginCountry = '',
	} = req.body;

	const burials = await burialService.doSearch(Number(page), Number(limit), 0, {
		textToMatch,
		sortBy,
		sort,
		BirthYear,
		BirthMonth,
		BirthDay,
		DeathYear,
		DeathMonth,
		DeathDay,
		Gender,
		Cause,
		Manner,
		Cemetary,
		OriginCountry,
	});

	let data = renderFile('./templates/burials/burialGrid.pug', {
		data: burials.body,
	});

	let pdf = await generatePDF(data, 'a3');
	res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
	res.setHeader('Content-type', 'application/pdf');
	res.send(pdf);
});

burialsRouter.post('/export', async (req: Request, res: Response) => {
	const {
		page = 0,
		limit = 0,
		textToMatch = '',
		sortBy = 'LastName',
		sort = 'asc',
		BirthYear = '',
		BirthMonth = '',
		BirthDay = '',
		DeathYear = '',
		DeathMonth = '',
		DeathDay = '',
		Gender = '',
		Cause = '',
		Manner = '',
		Cemetary = '',
		OriginCountry = '',
	} = req.body;
	const burials = await burialService.doSearch(page, page, 0, {
		textToMatch,
		sortBy,
		sort,
		BirthYear,
		BirthMonth,
		BirthDay,
		DeathYear,
		DeathMonth,
		DeathDay,
		Gender,
		Cause,
		Manner,
		Cemetary,
		OriginCountry,
	});

	const json2csvParser = new Parser();

	const csv = json2csvParser.parse(burials.body);

	res.setHeader('Content-Type', 'text/csv');
	res.attachment('burials.csv').send(csv);
});
