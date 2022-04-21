import express, { Request, Response } from "express";
import { DB_CONFIG } from '../config';
import knex from "knex";
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import { InterpretiveSiteService } from "../services";
import { renderFile } from "pug";
import { generatePDF } from "../utils/pdf-generator";
const { Parser, transforms: { unwind } } = require('json2csv');
export const intSitesRouter = express.Router();
const db = knex(DB_CONFIG);
const intSiteService = new InterpretiveSiteService();

intSitesRouter.get(
	'/',
	[
		query('textToMatch').default('').isString(),
		query('sortBy').default('SiteName').isString(),
		query('sort').default('asc').isString(),
		query('page').default(0).isInt(), 
		query('limit').default(10).isInt({ gt: 0 }),
	],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { textToMatch = '', RouteName = '', KMNum = '', MapSheet = '', sortBy, sort } =  req.query;
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		
		const data = await intSiteService.doSiteSearch(page, limit, offset, { 
			textToMatch, RouteName, KMNum, MapSheet,  sortBy, sort
		});

		res.status(200).send(data);
	}
);

intSitesRouter.get(
	'/:siteId',
	[param('siteId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { siteId } = req.params;
		const boat = await intSiteService.getSiteById(parseInt(siteId));

		if(!boat){
			res.status(404).send({message: "Data not found"});
			return;
		}

		res.status(200).send(boat);
	}
);

intSitesRouter.post('/', async (req: Request, res: Response) => {
	const {
		item = {},
		actions = [],
		assets = [],
		inspections = [],
	} = req.body;

	const resObj = await intSiteService.addSite(item, assets, actions, inspections);
	if(!resObj){
		res.status(401).send({ message: "Conflict"});
		return;
	}
	
	res.send(resObj);
});

intSitesRouter.put('/:boatId', async (req: Request, res: Response) => {
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
		.insert(pastNamesNewArray.map((name: any) => ({ BoatId: boatId, ...name })))
		.into('boat.pastnames')
		.then((rows: any) => {
			return rows;
		});

	res.status(200).send({ message: 'success' });
});


//PDF AND EXPORTS
intSitesRouter.post(
	'/pdf/:boatId', 
	[param('boatId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { boatId } = req.params;

		const boat = await intSiteService.getSiteById(parseInt(boatId));

		let data = renderFile('./templates/boats/boatView.pug', {
			data: boat
		});

		let pdf = await generatePDF(data);
		res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
});

intSitesRouter.post('/pdf', async (req: Request, res: Response) => {
        const { textToMatch = '', RouteName = '', KMNum = '', MapSheet = '', sortBy = 'Name', 
            sort = 'asc',
            page = 0, limit = 0 } =  req.body;
        
        const data = await intSiteService.doSiteSearch(page, limit, 0, { 
            textToMatch, RouteName, KMNum, MapSheet,  sortBy, sort
        });
		let pdfData = renderFile('./templates/boats/boatGrid.pug', {
			data: data.body
		});

		let pdf = await generatePDF(pdfData);
		res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
	}
);

intSitesRouter.post('/export', async (req: Request, res: Response) => {

    const { textToMatch = '', RouteName = '', KMNum = '', MapSheet = '', sortBy = 'Name', 
        sort = 'asc',
        page = 0, limit = 0 } =  req.body;
    
    const data = await intSiteService.doSiteSearch(page, limit, 0, { 
        textToMatch, RouteName, KMNum, MapSheet,  sortBy, sort
    });
	const json2csvParser = new Parser();

	const csv = json2csvParser.parse(data.body);
    res.setHeader("Content-Type", "text/csv");
	res.attachment('boats.csv').send(csv)

});