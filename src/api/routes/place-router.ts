import express, { Request, Response, NextFunction } from 'express';
import {
	body,
	check,
	param,
	query,
	validationResult,
	matchedData,
} from 'express-validator';
import { pick } from 'lodash';

import { DB_CONFIG } from '../config';
import { buildDatabaseSort, PlaceService } from '../services';
import { Place, WebLink, RevisionLog, Contact, Description } from '../data';
import { ReturnValidationErrors } from '../middleware';
import { authorize, UserRoles } from '../middleware/authorization';
import { User } from 'models';
import PlacesController from '../controllers/places-controller';

const placeService = new PlaceService(DB_CONFIG);
const PAGE_SIZE = 10;

export const placeRouter = express.Router();

placeRouter.get(
	'/',
	[query('page').default(1).isInt({ gt: 0 })],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		let page = parseInt(req.query.page as string);
		let skip = (page - 1) * PAGE_SIZE;
		let take = PAGE_SIZE;

		let list = await placeService
			.getAll(skip, take)
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return undefined;
			});

		let item_count = await placeService
			.getPlaceCount()
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return 0;
			});

		let page_count = Math.ceil(item_count / PAGE_SIZE);

		if (list) {
			return res.json({
				data: list,
				meta: { page, page_size: PAGE_SIZE, item_count, page_count },
			});
		}

		return res.status(500).send('Error');
	}
);

placeRouter.post(
	'/search',
	[body('page').isInt().default(1)],
	async (req: Request, res: Response, next: NextFunction) => {
		let { query, sortBy, sortDesc, page, itemsPerPage } = req.body;
		let currentUser = req.user as User;
		const sort = buildDatabaseSort(sortBy, sortDesc);

		let skip = (page - 1) * itemsPerPage;
		let take = itemsPerPage;

		return placeService
			.doSearch(query, sort, page, itemsPerPage, skip, take, currentUser)
			.then((results) => {
				return res.json(results);
			})
			.catch((error) => {
				return res.status(422).json({
					messages: [{ variant: 'error', text: error.message }],
				});
			});
	}
);

placeRouter.post(
	'/generate-id',
	[body('nTSMapSheet').isString().bail().notEmpty().trim()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		let { nTSMapSheet } = req.body;

		let newId = await placeService.generateIdFor(nTSMapSheet);

		res.json({ data: { yHSIId: newId, nTSMapSheet } });
	}
);

placeRouter.get(
	'/:id',
	[check('id').notEmpty()],
	ReturnValidationErrors,
	PlacesController.getPlace
);

placeRouter.post(
	'/',
	[
		body('primaryName').isString().bail().notEmpty().trim(),
		body('yHSIId').isString().bail().notEmpty().trim(),
		body('jurisdiction').isInt().bail().notEmpty(),
		body('statuteId').isInt().bail().notEmpty(),
		body('statute2Id').isInt().bail().notEmpty(),
		body('ownerConsent').isInt().bail().notEmpty(),
		body('category').isInt().bail().notEmpty(),
		body('isPubliclyAccessible').isBoolean().bail().notEmpty(),
		body('communityId').isInt().bail().notEmpty(),
		body('siteStatus').isInt().bail().notEmpty(),
		body('floorCondition').isInt().bail().notEmpty(),
		body('wallCondition').isInt().bail().notEmpty(),
		body('doorCondition').isInt().bail().notEmpty(),
		body('roofCondition').isInt().bail().notEmpty(),
		body('coordinateDetermination').isInt().bail().notEmpty(),
		body('showInRegister').isBoolean().bail().notEmpty(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		let result = await placeService
			.addPlace(req.body as Place)
			.then((item) => item)
			.catch((err) => {
				return res.json({ errors: [err.originalError.info.message] });
			});

		return res.json({ data: result });
	}
);

placeRouter.put(
	'/:id/management',
	[param('id').isInt().notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		let { id } = req.params;
		let { links, contacts, revisionLogs } = req.body;
		let updater = req.body;

		delete updater.links;
		delete updater.contacts;
		delete updater.revisionLogs;

		await placeService.updatePlace(parseInt(id), updater);

		let oldLinks = await placeService.getWebLinksFor(parseInt(id));

		for (let on of oldLinks) {
			let match = links.filter(
				(n: WebLink) => n.type == on.type && n.address == on.address
			);

			if (match.length == 0) {
				await placeService.removeWebLink(on.id);
			}
		}

		for (let on of links) {
			let match = oldLinks.filter(
				(n: WebLink) => n.type == on.type && n.address == on.address
			);

			if (match.length == 0) {
				delete on.id;
				delete on.typeText;
				await placeService.addWebLink(on);
			}
		}

		let oldLogs = await placeService.getRevisionLogFor(parseInt(id));

		for (let on of oldLogs) {
			let match = revisionLogs.filter(
				(n: RevisionLog) =>
					n.revisionLogType == on.revisionLogType &&
					n.revisionDate == on.revisionDate &&
					n.revisedBy == on.revisedBy &&
					n.details == on.details
			);

			if (match.length == 0) {
				await placeService.removeRevisionLog(on.id);
			}
		}

		for (let on of revisionLogs) {
			let match = oldLogs.filter(
				(n: RevisionLog) =>
					n.revisionLogType == on.revisionLogType &&
					n.revisionDate == on.revisionDate &&
					n.revisedBy == on.revisedBy &&
					n.details == on.details
			);

			if (match.length == 0) {
				delete on.revisionLogTypeText;
				delete on.id;
				await placeService.addRevisionLog(on);
			}
		}

		let oldContacts = await placeService.getContactsFor(parseInt(id));

		for (let on of oldContacts) {
			let match = contacts.filter(
				(n: Contact) =>
					n.contactType == on.contactType &&
					n.firstName == on.firstName &&
					n.lastName == on.lastName &&
					n.phoneNumber == on.phoneNumber &&
					n.email == on.email &&
					n.mailingAddress == on.mailingAddress &&
					n.description == on.description
			);

			if (match.length == 0) {
				await placeService.removeContact(on.id);
			}
		}

		for (let on of contacts) {
			let match = oldContacts.filter(
				(n: Contact) =>
					n.contactType == on.contactType &&
					n.firstName == on.firstName &&
					n.lastName == on.lastName &&
					n.phoneNumber == on.phoneNumber &&
					n.email == on.email &&
					n.mailingAddress == on.mailingAddress &&
					n.description == on.description
			);

			if (match.length == 0) {
				delete on.id;
				delete on.contactTypeText;
				await placeService.addContact(on);
			}
		}

		return res.json({
			messages: [{ variant: 'success', text: 'Site updated' }],
		});
	}
);

placeRouter.put(
	'/:id/description',
	[param('id').isInt().notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		let { id } = req.params;
		let { descriptions } = req.body;

		let oldDescs = await placeService.getDescriptionsFor(parseInt(id));

		for (let on of oldDescs) {
			let match = descriptions.filter(
				(n: Description) =>
					n.type == on.type && n.descriptionText == on.descriptionText
			);

			if (match.length == 0) {
				await placeService.removeDescription(on.id);
			}
		}

		for (let on of descriptions) {
			let match = oldDescs.filter(
				(n: Description) =>
					n.type == on.type && n.descriptionText == on.descriptionText
			);

			if (match.length == 0) {
				delete on.typeText;
				delete on.id;
				await placeService.addDescription(on);
			}
		}

		return res.json({
			messages: [{ variant: 'success', text: 'Site updated' }],
		});
	}
);

placeRouter.patch(
	'/:id',
	authorize([UserRoles.SITE_ADMIN, UserRoles.ADMINISTRATOR]),
	[
		param('id').isInt({ gt: 0 }),
		body('associations').isArray().optional({ nullable: true }),
		body('block').isString().optional({ nullable: true }),
		body('bordenNumber').isString().optional({ nullable: true }),
		body('buildingSize').isString().optional({ nullable: true }),
		body('category').isInt().optional(),
		body('communityId').isInt().optional(),
		body('conditionComment').isString().optional({ nullable: true }),
		body('constructionPeriods').isArray().optional({ nullable: true }),
		body('contributingResources').isArray().optional({ nullable: true }),
		body('coordinateDetermination').isInt().optional(),
		body('currentUseComment').isString().optional({ nullable: true }),
		body('dates').isArray().optional({ nullable: true }),
		body('designations').isArray().optional({ nullable: true }),
		body('doorCondition').isInt().optional(),
		body('firstNationAssociations').isArray().optional({ nullable: true }),
		body('floorCondition').isInt().optional(),
		body('functionalUses').isArray().optional({ nullable: true }),
		body('groupYHSI').isString().optional({ nullable: true }),
		body('hectareArea').isString().optional({ nullable: true }),
		body('historicalPatterns').isArray().optional({ nullable: true }),
		body('lAGroup').isString().optional({ nullable: true }),
		body('latitude').isString().optional({ nullable: true }),
		body('locationComment').isString().optional({ nullable: true }),
		body('locationContext').isString().optional({ nullable: true }),
		body('longitude').isString().optional({ nullable: true }),
		body('lot').isString().optional({ nullable: true }),
		body('names').isArray().optional({ nullable: true }),
		body('nTSMapSheet').isString().optional({ nullable: true }),
		body('otherCommunity').isString().optional({ nullable: true }),
		body('otherLocality').isString().optional({ nullable: true }),
		body('ownerships').isArray().optional({ nullable: true }),
		body('physicalAddress').isString().optional({ nullable: true }),
		body('physicalCountry').isString().optional({ nullable: true }),
		body('physicalPostalCode').isString().optional({ nullable: true }),
		body('physicalProvince').isString().optional({ nullable: true }),
		body('planNumber').isString().optional({ nullable: true }),
		body('previousAddress').isString().optional({ nullable: true }),
		body('previousOwnerships').isArray().optional({ nullable: true }),
		body('primaryName').isString().optional(),
		body('records').isArray().optional({ nullable: true }),
		body('resourceType').isString().optional({ nullable: true }),
		body('roofCondition').isInt().optional(),
		body('showInRegister').isBoolean().optional(),
		body('siteCategories').isArray().optional({ nullable: true }),
		body('siteDistrictNumber').isString().optional({ nullable: true }),
		body('siteStatus').isInt().optional(),
		body('themes').isArray().optional({ nullable: true }),
		body('townSiteMapNumber').isString().optional({ nullable: true }),
		body('wallCondition').isInt().optional(),
		body('yHSPastUse').isString().optional({ nullable: true }),
		body('yHSThemes').isString().optional({ nullable: true }),
		body('zoning').isString().optional({ nullable: true }),
	],
	ReturnValidationErrors,
	(req: Request, res: Response) => {
		const id = parseInt(req.params.id);

		const attributes = matchedData(req, {
			locations: ['body'],
		});

		return placeService
			.update(id, attributes)
			.then((data) => {
				return res.json({
					data,
					messages: [{ variant: 'success', text: 'Site updated' }],
				});
			})
			.catch((error) => {
				return res.status(422).json({
					messages: [{ variant: 'error', text: error.message }],
				});
			});
	}
);
