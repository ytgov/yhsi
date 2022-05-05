import express, { Request, Response } from "express";
import { DB_CONFIG } from '../config';
import knex from "knex";
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import { InterpretiveSiteService } from "../services";
import { renderFile } from "pug";
import { generatePDF } from "../utils/pdf-generator";
const { Parser, transforms: { unwind } } = require('json2csv');
export const actionRouter = express.Router();
const db = knex(DB_CONFIG);
const intSiteService = new InterpretiveSiteService();

// ACTIONS

actionRouter.get(
	'/',
	[
		query('sortBy').default('ActionDesc').isString(),
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

actionRouter.get(
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

actionRouter.post('/', async (req: Request, res: Response) => {
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

actionRouter.put('/:actionId', async (req: Request, res: Response) => {
	const {
		item = {},
		// assets = [], actions = [], inspections = []
	} = req.body;
	const { actionId } = req.params;
	const resObj = await intSiteService.modifyAction(parseInt(actionId), item);
	if(!resObj){
		res.status(404).send({ message: "Action not found"});
		return;
	}

	res.status(200).send(resObj);
});


//PDF AND EXPORTS
// NO REQUEST FOR A SINGLE ACTION PRINT
// actionRouter.post(
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

actionRouter.post('/pdf', async (req: Request, res: Response) => {
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

actionRouter.post('/export', async (req: Request, res: Response) => {

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



