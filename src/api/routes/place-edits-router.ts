import express, { Request, Response } from 'express';
import { query } from 'express-validator';

import { ReturnValidationErrors } from '../middleware';
import { PlaceEditService } from '../services';

export const placeEditsRouter = express.Router();
const placeEditService = new PlaceEditService();

interface ParsedPaginatedQs {
	page: number;
	itemsPerPage: number;
	[key: string]: any;
}

placeEditsRouter.get(
	'/',
	query('page').default(1).toInt().isInt({ gt: 0 }),
	query('itemsPerPage').default(20).toInt().isInt({ gt: 0 }),
	ReturnValidationErrors,
	(req: Request, res: Response) => {
		const { page, itemsPerPage } = req.query as ParsedPaginatedQs;

		return placeEditService
			.buildTableView(page, itemsPerPage)
			.then(({ results, totalCount }) => {
				return res.json({
					data: results,
					meta: {
						page,
						itemsPerPage,
						totalCount,
					},
				});
			})
			.catch((error) => {
				return res.status(422).json({
					messages: [{ variant: 'error', text: error.message }],
				});
			});
	}
);
