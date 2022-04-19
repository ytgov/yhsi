import express, { Request, Response } from 'express';
import { body, query, param } from 'express-validator';
import moment from 'moment';

import { ReturnValidationErrors } from '../middleware';
import { PlaceEditService } from '../services';
import { authorize, UserRoles } from '../middleware/authorization';

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

placeEditsRouter.post(
	'/',
	authorize([
		UserRoles.SITE_EDITOR,
		UserRoles.SITE_ADMIN,
		UserRoles.ADMINISTRATOR,
	]),
	[
		body('placeId').notEmpty().toInt().isInt({ gt: 0 }),
		body('associations').isArray().optional({ nullable: true }),
		body('bordenNumber').isString().optional({ nullable: true }),
		body('buildingSize').isString().optional({ nullable: true }),
		body('category').isInt(),
		body('communityId').isInt(),
		body('conditionComment').isString().optional({ nullable: true }),
		body('constructionPeriods').isArray().optional({ nullable: true }),
		body('contributingResources').isArray().optional({ nullable: true }),
		body('coordinateDetermination').isInt(),
		body('currentUseComment').isString().optional(),
		body('dates').isArray().optional({ nullable: true }),
		body('designations').isArray().optional({ nullable: true }),
		body('doorCondition').isInt(),
		body('firstNationAssociations').isArray().optional({ nullable: true }),
		body('floorCondition').isInt(),
		body('functionalUses').isArray().optional({ nullable: true }),
		body('hectareArea').isString().optional({ nullable: true }),
		body('historicalPatterns').isArray().optional({ nullable: true }),
		body('latitude').isString().optional({ nullable: true }),
		body('locationComment').isString().optional({ nullable: true }),
		body('locationContext').isString().optional({ nullable: true }),
		body('longitude').isString().optional({ nullable: true }),
		body('names').isArray().optional({ nullable: true }),
		body('nTSMapSheet').isString().optional({ nullable: true }),
		body('otherCommunity').isString().optional({ nullable: true }),
		body('otherLocality').isString().optional({ nullable: true }),
		body('physicalAddress').isString().optional({ nullable: true }),
		body('physicalCountry').isString().optional({ nullable: true }),
		body('physicalPostalCode').isString().optional({ nullable: true }),
		body('physicalProvince').isString().optional({ nullable: true }),
		body('previousAddress').isString().optional({ nullable: true }),
		body('primaryName').isString(),
		body('records').isArray().optional({ nullable: true }),
		body('resourceType').isString().optional({ nullable: true }),
		body('roofCondition').isInt(),
		body('showInRegister').isBoolean(),
		body('siteCategories').isArray().optional({ nullable: true }),
		body('siteStatus').isInt(),
		body('themes').isArray().optional({ nullable: true }),
		body('wallCondition').isInt(),
		body('yHSPastUse').isString().optional({ nullable: true }),
		body('yHSThemes').isString().optional({ nullable: true }),
	],
	ReturnValidationErrors,
	(req: Request, res: Response) => {
		const data = req.body;
		const currentUser = req.user;

		return placeEditService
			.create({
				...data,
				editorUserId: currentUser.id,
				editDate: moment().format('YYYY-MM-DD'),
			})
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

placeEditsRouter.get(
	'/:id',
	param('id').notEmpty().toInt().isInt({ gt: 0 }),
	ReturnValidationErrors,
	(req: Request, res: Response) => {
		const { id } = req.params as ParsedParams;

		return placeEditService
			.buildDetailedView(id)
			.then((result) => {
				if (result === undefined) {
					return res.status(404).json({
						messages: [
							{
								variant: 'error',
								text: `Could not find PlaceEdit with id=${id}`,
							},
						],
					});
				}

				return res.json({
					data: result,
				});
			})
			.catch((error) => {
				return res.status(error.code || 422).json({
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
