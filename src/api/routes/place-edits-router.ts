import express, { Request, Response } from 'express';
import { query, param } from 'express-validator';

import { ReturnValidationErrors } from '../middleware';
import { PlaceEditService } from '../services';

export const placeEditsRouter = express.Router();
const placeEditService = new PlaceEditService();

interface ParsedPaginatedQs {
	page: number;
	itemsPerPage: number;
	[key: string]: any;
}

interface ParsedParams {
	id: number;
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

placeEditsRouter.get(
	'/:id',
	param('id').notEmpty().toInt().isInt({ gt: 0 }),
	ReturnValidationErrors,
	(req: Request, res: Response) => {
		const { id } = req.params as ParsedParams;

		return placeEditService
			.buildDetailedView(id)
			.then((result) => {
				return res.json({
					data: result,
				});
			})
			.catch((error) => {
				return res.status(422).json({
					messages: [{ variant: 'error', text: error.message }],
				});
			});
	}
);

placeEditsRouter.delete(
	'/:id',
	param('id').notEmpty().toInt().isInt({ gt: 0 }),
	ReturnValidationErrors,
	(req: Request, res: Response) => {
		const { id } = req.params as ParsedParams;

		return placeEditService
			.delete(id)
			.then((result) => {
				return res.json({
					data: result,
					messages: [{ variant: 'success', text: 'Delete successful.' }],
				});
			})
			.catch((error) => {
				return res.status(422).json({
					messages: [{ variant: 'error', text: error.message }],
				});
			});
	}
);
