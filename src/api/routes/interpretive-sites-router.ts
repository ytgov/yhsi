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
        const { SiteName = '', RouteName = '', KMNum = '', MapSheet = '', sortBy = 'SiteName', 
            sort = 'asc',
            page = 0, limit = 0 } =  req.body;
        
        const data = await intSiteService.doSiteSearch(page, limit, 0, { 
            SiteName, RouteName, KMNum, MapSheet,  sortBy, sort
        });
		let pdfData = renderFile('./templates/boats/boatGrid.pug', {
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



// ASSETS

intSitesRouter.get(
	'/assets',
	[
		query('textToMatch').default('').isString(),
		query('sortBy').default('SiteName').isString(),
		query('sort').default('asc').isString(),
		query('page').default(0).isInt(), 
		query('limit').default(10).isInt({ gt: 0 }),
	],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { 
			Category = '', 
			Type = '', 
			Size = '', 
			Description = '',
			SignText = '',
			InstallDate = '',
			DecommissionDate = '',
			DecommissionNotes = '',
			Status = '',
			sortBy, 
			sort
		 } =  req.query;
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		
		const data = await intSiteService.doAssetSearch(page, limit, offset, { 
			Category, 
			Type, 
			Size, 
			Description,
			SignText,
			InstallDate,
			DecommissionDate,
			DecommissionNotes,
			Status,
			sortBy, 
			sort
		});

		res.status(200).send(data);
	}
);

intSitesRouter.get(
	'/assets/:siteId',
	[param('siteId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { siteId } = req.params;
		const boat = await intSiteService.getAssetById(parseInt(siteId));

		if(!boat){
			res.status(404).send({message: "Data not found"});
			return;
		}

		res.status(200).send(boat);
	}
);

intSitesRouter.post('/assets', async (req: Request, res: Response) => {
	const {
		item = {},
		actions = [],
		assets = [],
		inspections = [],
	} = req.body;

	const resObj = await intSiteService.addAsset(item);
	if(!resObj){
		res.status(401).send({ message: "Conflict"});
		return;
	}

	res.send(resObj);
});

intSitesRouter.put('/assets/:siteId', async (req: Request, res: Response) => {
	const {
		item = {},
		assets = [], actions = [], inspections = []
	} = req.body;
	const { siteId } = req.params;
	const resObj = await intSiteService.modifyAsset(parseInt(siteId), item);
	if(!resObj){
		res.status(404).send({ message: "Site not found"});
		return;
	}

	res.status(200).send(resObj);
});


//PDF AND EXPORTS
intSitesRouter.post(
	'/assets/pdf/:assetId', 
	[param('assetId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { assetId } = req.params;

		const asset = await intSiteService.getActionById(parseInt(assetId));

		let data = renderFile('./templates/boats/boatView.pug', {
			data: asset
		});

		let pdf = await generatePDF(data);
		res.setHeader('Content-disposition', 'attachment; filename="asset.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
});

intSitesRouter.post('/assets/pdf', async (req: Request, res: Response) => {
        const { 
			Category = '', 
			Type = '', 
			Size = '', 
			Description = '',
			SignText = '',
			InstallDate = '',
			DecommissionDate = '',
			DecommissionNotes = '',
			Status = '',
			sortBy, 
			sort,
            page = 0, limit = 0 } =  req.body;
        
        const data = await intSiteService.doAssetSearch(page, limit, 0, { 
            Category, 
			Type, 
			Size, 
			Description,
			SignText,
			InstallDate,
			DecommissionDate,
			DecommissionNotes,
			Status,
			sortBy, 
			sort
        });
		let pdfData = renderFile('./templates/boats/boatGrid.pug', {
			data: data.body
		});

		let pdf = await generatePDF(pdfData);
		res.setHeader('Content-disposition', 'attachment; filename="assets.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
	}
);

intSitesRouter.post('/assets/export', async (req: Request, res: Response) => {

    const { 
		Category = '', 
		Type = '', 
		Size = '', 
		Description = '',
		SignText = '',
		InstallDate = '',
		DecommissionDate = '',
		DecommissionNotes = '',
		Status = '',
		sortBy, 
		sort,
        page = 0, limit = 0 } =  req.body;
    
    const data = await intSiteService.doAssetSearch(page, limit, 0, { 
        Category, 
		Type, 
		Size, 
		Description,
		SignText,
		InstallDate,
		DecommissionDate,
		DecommissionNotes,
		Status,
		sortBy, 
		sort
    });
	const json2csvParser = new Parser();

	const csv = json2csvParser.parse(data.body);
    res.setHeader("Content-Type", "text/csv");
	res.attachment('assets.csv').send(csv)

});


// ACTIONS

intSitesRouter.get(
	'/actions',
	[
		query('textToMatch').default('').isString(),
		query('sortBy').default('SiteName').isString(),
		query('sort').default('asc').isString(),
		query('page').default(0).isInt(), 
		query('limit').default(10).isInt({ gt: 0 }),
	],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { 
			ActionDesc = '', 
			ToBeCompleteDate = '', 
			ActionCompleteDate = '', 
			CompletionDesc = '',
			Priority = '',
			CreatedBy = '',
			CreatedDate = '',
			CompletedBy = '',
			sortBy, 
			sort
		 } =  req.query;
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		
		const data = await intSiteService.doActionSearch(page, limit, offset, { 
			ActionDesc, 
			ToBeCompleteDate, 
			ActionCompleteDate, 
			CompletionDesc,
			Priority,
			CreatedBy,
			CreatedDate,
			CompletedBy,
			sortBy, 
			sort
		});

		res.status(200).send(data);
	}
);

intSitesRouter.get(
	'/actions/:actionId',
	[param('actionId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { actionId } = req.params;
		const action = await intSiteService.getActionById(parseInt(actionId));

		if(!action){
			res.status(404).send({message: "Data not found"});
			return;
		}

		res.status(200).send(action);
	}
);

intSitesRouter.post('/actions', async (req: Request, res: Response) => {
	const {
		item = {},
		// actions = [],
		// assets = [],
		// inspections = [],
	} = req.body;

	const resObj = await intSiteService.addAction(item);
	if(!resObj){
		res.status(401).send({ message: "Conflict"});
		return;
	}

	res.send(resObj);
});

intSitesRouter.put('/actions/:siteId', async (req: Request, res: Response) => {
	const {
		item = {},
		// assets = [], actions = [], inspections = []
	} = req.body;
	const { siteId } = req.params;
	const resObj = await intSiteService.modifyAction(parseInt(siteId), item);
	if(!resObj){
		res.status(404).send({ message: "Action not found"});
		return;
	}

	res.status(200).send(resObj);
});


//PDF AND EXPORTS
intSitesRouter.post(
	'/actions/pdf/:actionId', 
	[param('actionId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { actionId } = req.params;

		const asset = await intSiteService.getActionById(parseInt(actionId));

		let data = renderFile('./templates/boats/boatView.pug', {
			data: asset
		});

		let pdf = await generatePDF(data);
		res.setHeader('Content-disposition', 'attachment; filename="action.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
});

intSitesRouter.post('/actions/pdf', async (req: Request, res: Response) => {
        const { 
			ActionDesc = '', 
			ToBeCompleteDate = '', 
			ActionCompleteDate = '', 
			CompletionDesc = '',
			Priority = '',
			CreatedBy = '',
			CreatedDate = '',
			CompletedBy = '',
			sortBy, 
			sort,
            page = 0, limit = 0 } =  req.body;
        
        const data = await intSiteService.doActionSearch(page, limit, 0, { 
            ActionDesc, 
			ToBeCompleteDate, 
			ActionCompleteDate, 
			CompletionDesc,
			Priority,
			CreatedBy,
			CreatedDate,
			CompletedBy,
			sortBy, 
			sort
        });
		let pdfData = renderFile('./templates/boats/boatGrid.pug', {
			data: data.body
		});

		let pdf = await generatePDF(pdfData);
		res.setHeader('Content-disposition', 'attachment; filename="actions.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
	}
);

intSitesRouter.post('/actions/export', async (req: Request, res: Response) => {

    const { 
		ActionDesc = '', 
		ToBeCompleteDate = '', 
		ActionCompleteDate = '', 
		CompletionDesc = '',
		Priority = '',
		CreatedBy = '',
		CreatedDate = '',
		CompletedBy = '',
		sortBy, 
		sort,
        page = 0, limit = 0 } =  req.body;
    
    const data = await intSiteService.doActionSearch(page, limit, 0, { 
        ActionDesc, 
		ToBeCompleteDate, 
		ActionCompleteDate, 
		CompletionDesc,
		Priority,
		CreatedBy,
		CreatedDate,
		CompletedBy,
		sortBy, 
		sort
    });
	const json2csvParser = new Parser();

	const csv = json2csvParser.parse(data.body);
    res.setHeader("Content-Type", "text/csv");
	res.attachment('actions.csv').send(csv)
});



