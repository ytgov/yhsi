import { renderFile } from 'pug';
import { difference } from 'lodash';
import express, { Request, Response } from 'express';
import { param, query } from 'express-validator';
const {
	Parser,
	transforms: { unwind },
} = require('json2csv');
import * as multer from 'multer';

import db from '@/db/db-client';

import { ReturnValidationErrors } from '../middleware';
import { InterpretiveSiteService } from '../services';
import { generatePDF } from '../utils/pdf-generator';
import { authorize } from '../middleware/authorization';
import { UserRoles } from '../models';

export const intSitesRouter = express.Router();

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
		try {
			const { SiteName = '', RouteName = '', KMNum = '', MapSheet = '', sortBy, sort } = req.query;
			const page = parseInt(req.query.page as string);
			const limit = parseInt(req.query.limit as string);
			const offset = (page - 1) * limit || 0;

			const data = await intSiteService.doSiteSearch(page, limit, offset, {
				SiteName,
				RouteName,
				KMNum,
				MapSheet,
				sortBy,
				sort,
			});

			res.status(200).send(data);
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: 'Error fetching Interpretive Sites' });
		}
	}
);

intSitesRouter.get(
	'/:siteId',
	[param('siteId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { siteId } = req.params;
		const boat = await intSiteService.getSiteById(parseInt(siteId));

		if (!boat) {
			res.status(404).send({ message: 'Data not found' });
			return;
		}

		res.status(200).send(boat);
	}
);

intSitesRouter.post('/', async (req: Request, res: Response) => {
	const { item = {}, actions = [], assets = [], inspections = [] } = req.body;

	const resObj = await intSiteService.addSite(item, assets, actions, inspections);
	if (!resObj) {
		res.status(401).send({ message: 'Conflict' });
		return;
	}

	res.send(resObj);
});

intSitesRouter.post('/inspection', async (req: Request, res: Response) => {
	const { item = {} } = req.body;

	const resObj = await intSiteService.addInspection(item);
	if (!resObj) {
		res.status(401).send({ message: 'Conflict' });
		return;
	}

	res.send(resObj);
});

intSitesRouter.put('/:siteId', async (req: Request, res: Response) => {
	const { item = {}, maintainers = [] } = req.body;
	const { siteId } = req.params;
	const resObj = await intSiteService.modifySite(parseInt(siteId), item, maintainers);
	if (!resObj) {
		res.sendStatus(404).send({ message: 'Site not found' });
		return;
	}

	res.sendStatus(200).send(resObj);
});

//PDF AND EXPORTS
intSitesRouter.post(
	'/pdf/:siteID',
	[param('siteID').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { siteID } = req.params;

		const item = await intSiteService.getSiteById(parseInt(siteID));

		const data = renderFile('./templates/interpretive-sites/interpretiveSitesView.pug', {
			data: item,
		});

		const pdf = await generatePDF(data);
		res.setHeader('Content-disposition', 'attachment; filename="interpretiveSite.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
	}
);

intSitesRouter.post('/pdf', async (req: Request, res: Response) => {
	const {
		SiteName = '',
		RouteName = '',
		KMNum = '',
		MapSheet = '',
		sortBy = 'SiteName',
		sort = 'asc',
		page = 0,
		limit = 0,
	} = req.body;

	const data = await intSiteService.doSiteSearch(page, limit, 0, {
		SiteName,
		RouteName,
		KMNum,
		MapSheet,
		sortBy,
		sort,
	});

	const pdfData = renderFile('./templates/interpretive-sites/interpretiveSitesGrid.pug', {
		data: data.body,
	});

	const pdf = await generatePDF(pdfData);
	res.setHeader('Content-disposition', 'attachment; filename="sites.html"');
	res.setHeader('Content-type', 'application/pdf');
	res.send(pdf);
});

intSitesRouter.post('/export', async (req: Request, res: Response) => {
	const {
		SiteName = '',
		RouteName = '',
		KMNum = '',
		MapSheet = '',
		sortBy = 'SiteName',
		sort = 'asc',
		page = 0,
		limit = 0,
	} = req.body;

	const data = await intSiteService.doSiteSearch(page, limit, 0, {
		SiteName,
		RouteName,
		KMNum,
		MapSheet,
		sortBy,
		sort,
	});
	const json2csvParser = new Parser();

	const csv = json2csvParser.parse(data.body);
	res.setHeader('Content-Type', 'text/csv');
	res.attachment('sites.csv').send(csv);
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
			AssetID = '',
			DocDesc,
			UploadedBy,
			FileType = '',
			UploadDate = new Date(),
		} = req.body;

		// const OriginalFileName = req.file.originalname;
		const resObj = (
			await db
				.insert({
					...(ActionID && { ActionID }),
					...(InspectID && { InspectID }),
					...(SiteID && { SiteID }),
					...(AssetID && { AssetID }),
					DocDesc,
					UploadedBy,
					FileType,
					UploadDate,
					Document,
				})
				.into('InterpretiveSite.Documents')
				.returning('*')
		)[0];

		delete resObj.Documment;
		res.status(200).send(resObj);
	}
);

intSitesRouter.post(
	'/file/:docID',
	[param('docID').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { docID } = req.params;
		const doc: any = await intSiteService.getDocumentsByID(parseInt(docID));

		res.setHeader('Content-disposition', `attachment; filename="${doc.DocDesc}.${doc.FileType}"`);
		res.setHeader('Content-type', 'application/json');
		res.send(doc);
	}
);

intSitesRouter.post(
	'/:id/photos/link',
	authorize([UserRoles.SITE_ADMIN, UserRoles.SITE_EDITOR, UserRoles.ADMINISTRATOR]),
	async (request: Request, response: Response) => {
		try {
			const { id } = request.params;
			const { linkPhotos } = request.body;

			const currentPhotos = await db
				.select('Photo_RowID')
				.from('InterpretiveSite.Photos')
				.where('SiteId', id);

			const filteredLinkPhotos = difference(
				linkPhotos,
				currentPhotos.map((x: any) => {
					return x.Photo_RowID;
				})
			);

			for (const photo of filteredLinkPhotos) {
				await db
					.insert({ SiteId: id, Photo_RowID: photo.rowId })
					.into('InterpretiveSite.Photos')
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
