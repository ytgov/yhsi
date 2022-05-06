import express, { Request, Response } from "express";
import { DB_CONFIG } from '../config';
import knex from "knex";
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import { InterpretiveSiteService } from "../services";
import { renderFile } from "pug";
import { generatePDF } from "../utils/pdf-generator";
const { Parser, transforms: { unwind } } = require('json2csv');
import * as multer from 'multer';
export const intSitesRouter = express.Router();
const db = knex(DB_CONFIG);
const intSiteService = new InterpretiveSiteService();

const upload = multer.default();

//SITES

intSitesRouter.get(
	'/',
	[
		query('SiteName').default('').isString(),
		query('sortBy').default('SiteName').isString(),
		query('sort').default('asc').isString(),
		query('page').default(0).isInt(), 
		query('limit').default(10).isInt({ gt: 0 }),
	],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { SiteName = '', RouteName = '', KMNum = '', MapSheet = '', sortBy, sort } =  req.query;
		console.log(req.query);
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		
		const data = await intSiteService.doSiteSearch(page, limit, offset, { 
			SiteName, RouteName, KMNum, MapSheet,  sortBy, sort
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

intSitesRouter.put('/:siteId', async (req: Request, res: Response) => {
	const {
		item = {},
		assets = [], actions = [], inspections = []
	} = req.body;
	const { siteId } = req.params;
	const resObj = await intSiteService.modifySite(parseInt(siteId), item, assets, actions, inspections);
	if(!resObj){
		res.status(404).send({ message: "Site not found"});
		return;
	}

	res.status(200).send(resObj);
});


//PDF AND EXPORTS
intSitesRouter.post(
	'/pdf/:siteID', 
	[param('siteID').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { siteID } = req.params;

		const item = await intSiteService.getSiteById(parseInt(siteID));

		let data = renderFile('./templates/interpretive-sites/interpretiveSitesView.pug', {
			data: item
		});

		let pdf = await generatePDF(data);
		res.setHeader('Content-disposition', 'attachment; filename="interpretiveSite.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
});

intSitesRouter.post('/pdf', async (req: Request, res: Response) => {
        const { SiteName = '', RouteName = '', KMNum = '', MapSheet = '', sortBy = 'SiteName', 
            sort = 'asc',
            page = 0, limit = 0 } =  req.body;
        
        const data = await intSiteService.doSiteSearch(page, limit, 0, { 
            SiteName, RouteName, KMNum, MapSheet,  sortBy, sort
        });
		let pdfData = renderFile('./templates/interpretive-sites/interpretiveSitesGrid.pug', {
			data: data.body
		});

		let pdf = await generatePDF(pdfData);
		res.setHeader('Content-disposition', 'attachment; filename="sites.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
	}
);

intSitesRouter.post('/export', async (req: Request, res: Response) => {

    const { SiteName = '', RouteName = '', KMNum = '', MapSheet = '', sortBy = 'SiteName', 
        sort = 'asc',
        page = 0, limit = 0 } =  req.body;
    
    const data = await intSiteService.doSiteSearch(page, limit, 0, { 
        SiteName, RouteName, KMNum, MapSheet,  sortBy, sort
    });
	const json2csvParser = new Parser();

	const csv = json2csvParser.parse(data.body);
    res.setHeader("Content-Type", "text/csv");
	res.attachment('sites.csv').send(csv)

});

intSitesRouter.post(
	'/file/upload',
	[upload.single('file')],
	async (req: Request, res: Response) => {

		const { 
			Document = req.file.buffer,
			ActionID = '',
			InspectID = '',
			SiteID = '',
			DocDesc,
			UploadedBy,
			UploadDate = new Date(),
		} = req.body;

		// const OriginalFileName = req.file.originalname;

		await db
			.insert({
				...ActionID && { ActionID },
				...InspectID && { InspectID },
				...SiteID && { SiteID },
				DocDesc,
				UploadedBy,
				UploadDate,
				Document
			})
			.into('InterpretiveSite.Documents')
			.returning('*')
			
		res.status(200).send({ message: 'Upload Success' });
	}
);

