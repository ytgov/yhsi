import express, { Request, Response } from "express";
import { DB_CONFIG } from '../config';
import knex from "knex";
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import { InterpretiveSiteService } from "../services";
import { renderFile } from "pug";
import { generatePDF } from "../utils/pdf-generator";
const { Parser, transforms: { unwind } } = require('json2csv');
export const inspectionRouter = express.Router();
const db = knex(DB_CONFIG);
const intSiteService = new InterpretiveSiteService();

// ACTIONS

inspectionRouter.get(
	'/',
	[
		query('sortBy').default('InspectedBy').isString(),
		query('sort').default('asc').isString(),
		query('page').default(0).isInt(), 
		query('limit').default(10).isInt({ gt: 0 }),
	],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { 
			InspectionDate = '', 
			Description = '', 
			InspectedBy = '', 
			sortBy, 
			sort
		 } =  req.query;
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		console.log(req.query);
		const data = await intSiteService.doInspectionSearch(page, limit, offset, { 
			InspectionDate, 
			Description, 
			InspectedBy, 
			sortBy, 
			sort
		});

		res.status(200).send(data);
	} 
);

inspectionRouter.get(
	'/:siteId',
	[param('siteId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { siteId } = req.params;
		const list = await intSiteService.getActionsBySiteId(parseInt(siteId));

		if(!list){
			res.status(404).send({message: "Data not found"});
			return;
		}

		res.status(200).send(list);
	}
);

inspectionRouter.post('/', async (req: Request, res: Response) => {
	const {
		item = {},
	} = req.body;

	const resObj = await intSiteService.addAction(item);
	if(!resObj){
		res.status(401).send({ message: "Conflict"});
		return;
	}

	res.send(resObj);
});

inspectionRouter.put('/:inspectID', async (req: Request, res: Response) => {
	const {
		item = {},
		// assets = [], actions = [], inspections = []
	} = req.body;
	const { inspectID } = req.params;
	const resObj = await intSiteService.modifyInspection(item,parseInt(inspectID));
	if(!resObj){
		res.status(404).send({ message: "Inspection not found"});
		return;
	}

	res.status(200).send(resObj[0]);
});


//PDF AND EXPORTS
// NO REQUEST FOR A SINGLE ACTION PRINT
// inspectionRouter.post(
// 	'/actions/pdf/:actionId', 
// 	[param('actionId').notEmpty()],
// 	ReturnValidationErrors,
// 	async (req: Request, res: Response) => {
// 		const { actionId } = req.params;

// 		const asset = await intSiteService.getActionById(parseInt(actionId));

// 		let data = renderFile('./templates/boats/boatView.pug', {
// 			data: asset
// 		});

// 		let pdf = await generatePDF(data);
// 		res.setHeader('Content-disposition', 'attachment; filename="action.html"');
// 		res.setHeader('Content-type', 'application/pdf');
// 		res.send(pdf);
// });

inspectionRouter.get(
	'/docs/:inspectID',
	[param('inspectID').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { inspectID } = req.params;

		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;

		const docs = await intSiteService.getDocumentsByOwnerID({InspectID: inspectID});

		res.status(200).send(docs);
	}
);

inspectionRouter.post('/pdf', async (req: Request, res: Response) => {
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
		let pdfData = renderFile('./templates/interpretive-sites/actionGrid.pug', {
			data: data.body
		});

		let pdf = await generatePDF(pdfData);
		res.setHeader('Content-disposition', 'attachment; filename="actions.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
	}
);

inspectionRouter.post('/export', async (req: Request, res: Response) => {

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



