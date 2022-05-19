import express, { Request, Response } from 'express';
import { DB_CONFIG } from '../config';
import knex from 'knex';
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import { InterpretiveSiteService } from '../services';
import { renderFile } from 'pug';
import { generatePDF } from '../utils/pdf-generator';
const {
	Parser,
	transforms: { unwind },
} = require('json2csv');
export const assetRouter = express.Router();
const db = knex(DB_CONFIG);
const intSiteService = new InterpretiveSiteService();

// ASSETS

assetRouter.get(
	'/',
	[
		query('sortBy').default('Description').isString(),
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
			sortBy = 'Description',
			sort,
		} = req.query;
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		console.log('endpoint reached');
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
			sort,
		});

		res.status(200).send(data);
	}
);

assetRouter.get(
	'/:siteId',
	[param('siteId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { siteId } = req.params;
		const list = await intSiteService.getAssetsBySiteId(parseInt(siteId));

		if (!list) {
			res.status(404).send({ message: 'Data not found' });
			return;
		}

		res.status(200).send(list);
	}
);

assetRouter.post('/', async (req: Request, res: Response) => {
	const { item = {} } = req.body;

	const { Maintainer, ...restObj } = item;

	const resObj = await intSiteService.addAsset(restObj, { Maintainer });
	if (!resObj) {
		res.status(401).send({ message: 'Conflict' });
		return;
	}

	res.send(resObj[0]);
});

assetRouter.put('/:assetId', async (req: Request, res: Response) => {
	const { item = {}, maintainers = [] } = req.body;
	const { assetId } = req.params;
	console.log(assetId);
	console.log('asset modif', req.body);
	const resObj = await intSiteService.modifyAsset(
		item,
		maintainers,
		parseInt(assetId)
	);
	if (!resObj) {
		res.status(404).send({ message: 'Asset not found' });
		return;
	}

	res.send(resObj[0]);
});

assetRouter.get(
	'/docs/:assetID',
	[param('assetID').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { assetID } = req.params;

		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;

		const docs = await intSiteService.getDocumentsByOwnerID({
			AssetID: assetID,
		});

		res.status(200).send(docs);
	}
);
assetRouter.delete(
	'/:assetID',
	[param('assetID').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { assetID } = req.params;
		console.log('before service call');
		const exists = await intSiteService.objExists(
			{ AssetID: parseInt(assetID) },
			'assets'
		);
		if (!exists) {
			res.sendStatus(404).send('The Asset doesnt exist');
			return;
		}
		console.log('exists');
		let resObj = await intSiteService.removeAsset(parseInt(assetID));
		res.sendStatus(200).send(resObj);
	}
);

assetRouter.delete(
	'/docs/:id',
	[param('id').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { id } = req.params;

		let resObj = await intSiteService.removeDocumentByID(parseInt(id));
		if (!resObj) {
			res.sendStatus(404).send('The Action doesnt exist');
			return;
		}
		res.sendStatus(200).send(resObj);
	}
);

//PDF AND EXPORTS
// NO REQUESTS FOR A SINGLE ASSET PRINT
// assetRouter.post(
// 	'/assets/pdf/:s',
// 	[param('assetId').notEmpty()],
// 	ReturnValidationErrors,
// 	async (req: Request, res: Response) => {
// 		const { assetId } = req.params;

// 		const asset = await intSiteService.getActionById(parseInt(assetId));

// 		let data = renderFile('./templates/boats/boatView.pug', {
// 			data: asset
// 		});

// 		let pdf = await generatePDF(data);
// 		res.setHeader('Content-disposition', 'attachment; filename="asset.html"');
// 		res.setHeader('Content-type', 'application/pdf');
// 		res.send(pdf);
// });

assetRouter.post('/pdf', async (req: Request, res: Response) => {
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
		sortBy = 'Description',
		sort,
		page = 0,
		limit = 0,
	} = req.body;

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
		sort,
	});
	let pdfData = renderFile('./templates/interpretive-sites/assetGrid.pug', {
		data: data.body,
	});

	let pdf = await generatePDF(pdfData);
	res.setHeader('Content-disposition', 'attachment; filename="assets.html"');
	res.setHeader('Content-type', 'application/pdf');
	res.send(pdf);
});

assetRouter.get(
	'/maintainers/:assetID',
	[param('assetID').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { assetID } = req.params;

		console.log(assetID);
		const list = await intSiteService.getMaintainersByID({
			AssetID: assetID,
		});

		console.log(list);
		res.status(200).send(list);
	}
);
assetRouter.post('/export', async (req: Request, res: Response) => {
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
		sortBy = 'Description',
		sort,
		page = 0,
		limit = 0,
	} = req.body;
	console.log(req.body);
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
		sort,
	});
	const json2csvParser = new Parser();

	const csv = json2csvParser.parse(data.body);
	res.setHeader('Content-Type', 'text/csv');
	res.attachment('assets.csv').send(csv);
});
