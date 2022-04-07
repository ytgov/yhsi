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
import {
	buildDatabaseSort,
	PlaceService,
	SortDirection,
	SortStatement,
	StaticService,
} from '../services';
import {
	HistoricalPattern,
	Name,
	Place,
	Dates,
	PLACE_FIELDS,
	ConstructionPeriod,
	Theme,
	FunctionalUse,
	Association,
	FirstNationAssociation,
	Ownership,
	PreviousOwnership,
	WebLink,
	RevisionLog,
	Contact,
	Description,
} from '../data';
import { ReturnValidationErrors } from '../middleware';
import { authorize, UserRoles } from '../middleware/authorization';

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
		const sort = buildDatabaseSort(sortBy, sortDesc);

		let skip = (page - 1) * itemsPerPage;
		let take = itemsPerPage;

		return placeService
			.doSearch(query, sort, page, itemsPerPage, skip, take)
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
	(req: Request, res: Response) => {
		const id = parseInt(req.params.id);

		return placeService
			.getById(id)
			.then(({ place, relationships }) => {
				return res.json({
					data: place,
					relationships,
				});
			})
			.catch((error) => {
				return res.status(422).json({
					messages: [{ variant: 'error', text: error.message }],
				});
			});
	}
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
	'/:id/summary',
	authorize([UserRoles.SITE_ADMIN, UserRoles.ADMINISTRATOR]),
	[
		param('id').isInt().notEmpty(),
		body('primaryName').isString().bail().notEmpty().trim(),
		body('showInRegister').isBoolean().notEmpty(),
	],
	ReturnValidationErrors,
	(req: Request, res: Response) => {
		const id = parseInt(req.params.id);
		const attributes = pick(req.body, [
			'category',
			'contributingResources',
			'designations',
			'historicalPatterns',
			'names',
			'primaryName',
			'records',
			'showInRegister',
			'siteCategories',
		]);
		return placeService
			.updatePlaceSummary(id, attributes)
			.then(() => {
				return res.json({
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

placeRouter.put(
	'/:id/location',
	[param('id').isInt().notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		let { id } = req.params;
		let updater = req.body;

		await placeService.updatePlace(parseInt(id), updater);
		return res.json({
			messages: [{ variant: 'success', text: 'Site updated' }],
		});
	}
);

placeRouter.put(
	'/:id/dates',
	[param('id').isInt().notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		let { id } = req.params;
		let { dates, constructionPeriods } = req.body;
		let updater = req.body;

		delete updater.dates;
		delete updater.constructionPeriods;

		await placeService.updatePlace(parseInt(id), updater);

		let oldDates = await placeService.getDatesFor(parseInt(id));
		dates = dates.map((n: Dates) =>
			Object.assign(n, { details: n.details.trim() })
		);

		for (let on of oldDates) {
			let match = dates.filter(
				(n: Dates) =>
					n.type == on.type &&
					n.details == on.details &&
					n.fromDate == on.fromDate &&
					n.toDate == on.toDate
			);

			if (match.length == 0) {
				await placeService.removeDate(on.id);
			}
		}

		for (let on of dates) {
			let match = oldDates.filter(
				(n: Dates) =>
					n.type == on.type &&
					n.details == on.details &&
					n.fromDate == on.fromDate &&
					n.toDate == on.toDate
			);

			if (match.length == 0) {
				delete on.id;
				delete on.from_menu;
				delete on.to_menu;
				delete on.typeText;
				await placeService.addDate(on);
			}
		}

		let oldConst = await placeService.getConstructionPeriodsFor(parseInt(id));

		for (let on of oldConst) {
			let match = constructionPeriods.filter(
				(n: ConstructionPeriod) => n.type == on.type
			);

			if (match.length == 0) {
				await placeService.removeConstructionPeriod(on.id);
			}
		}

		for (let on of constructionPeriods) {
			let match = oldConst.filter((n: ConstructionPeriod) => n.type == on.type);

			if (match.length == 0) {
				delete on.id;
				delete on.typeText;
				await placeService.addConstructionPeriod(on);
			}
		}
		return res.json({
			messages: [{ variant: 'success', text: 'Site updated' }],
		});
	}
);

placeRouter.put(
	'/:id/themes',
	[param('id').isInt().notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		let { id } = req.params;
		let { themes, functionalUses } = req.body;
		let updater = req.body;

		delete updater.themes;
		delete updater.functionalUses;

		await placeService.updatePlace(parseInt(id), updater);

		let oldThemes = await placeService.getThemesFor(parseInt(id));

		for (let on of oldThemes) {
			let match = themes.filter(
				(n: Theme) => n.placeThemeId == on.placeThemeId
			);

			if (match.length == 0) {
				await placeService.removeTheme(on.id);
			}
		}

		for (let on of themes) {
			let match = oldThemes.filter(
				(n: Theme) => n.placeThemeId == on.placeThemeId
			);

			if (match.length == 0) {
				delete on.typeName;
				await placeService.addTheme(on);
			}
		}

		let oldFunctions = await placeService.getFunctionUsesFor(parseInt(id));

		for (let on of oldFunctions) {
			let match = functionalUses.filter(
				(n: FunctionalUse) =>
					n.functionalTypeId == on.functionalTypeId &&
					n.functionalUseType == on.functionalUseType
			);

			if (match.length == 0) {
				await placeService.removeFunctionalUse(on.id);
			}
		}

		for (let on of functionalUses) {
			let match = oldFunctions.filter(
				(n: FunctionalUse) =>
					n.functionalTypeId == on.functionalTypeId &&
					n.functionalUseType == on.functionalUseType
			);

			if (match.length == 0) {
				delete on.typeName;
				await placeService.addFunctionalUse(on);
			}
		}

		return res.json({
			messages: [{ variant: 'success', text: 'Site updated' }],
		});
	}
);

placeRouter.put(
	'/:id/associations',
	[param('id').isInt().notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		let { id } = req.params;
		let { associations, firstNationAssociations } = req.body;

		let oldAssoc = await placeService.getAssociationsFor(parseInt(id));

		for (let on of oldAssoc) {
			let match = associations.filter(
				(n: Association) => n.type == on.type && n.description == on.description
			);

			if (match.length == 0) {
				await placeService.removeAssociation(on.id);
			}
		}

		for (let on of associations) {
			let match = oldAssoc.filter(
				(n: Association) => n.type == on.type && n.description == on.description
			);

			if (match.length == 0) {
				delete on.typeText;
				delete on.id;
				await placeService.addAssociation(on);
			}
		}

		let oldFunctions = await placeService.getFNAssociationsFor(parseInt(id));
		for (let on of oldFunctions) {
			let match = firstNationAssociations.filter(
				(n: FirstNationAssociation) =>
					n.firstNationAssociationType == on.firstNationAssociationType &&
					n.firstNationId == on.firstNationId &&
					n.comments == on.comments
			);

			if (match.length == 0) {
				await placeService.removeFNAssociation(on.id);
			}
		}

		for (let on of firstNationAssociations) {
			let match = oldFunctions.filter(
				(n: FirstNationAssociation) =>
					n.firstNationAssociationType == on.firstNationAssociationType &&
					n.firstNationId == on.firstNationId &&
					n.comments == on.comments
			);

			if (match.length == 0) {
				//console.log(on)
				delete on.id;
				delete on.typeText;
				await placeService.addFNAssociation(on);
			}
		}

		return res.json({
			messages: [{ variant: 'success', text: 'Site updated' }],
		});
	}
);

placeRouter.put(
	'/:id/legal',
	[param('id').isInt().notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		let { id } = req.params;
		let { ownerships, prevOwnerships } = req.body;
		let updater = req.body;

		delete updater.ownerships;
		delete updater.prevOwnerships;

		await placeService.updatePlace(parseInt(id), updater);

		let oldOwners = await placeService.getOwnershipsFor(parseInt(id));

		for (let on of oldOwners) {
			let match = ownerships.filter(
				(n: Ownership) =>
					n.ownershipType == on.ownershipType && n.comments == on.comments
			);

			if (match.length == 0) {
				await placeService.removeOwnership(on.id);
			}
		}

		for (let on of ownerships) {
			let match = oldOwners.filter(
				(n: Ownership) =>
					n.ownershipType == on.ownershipType && n.comments == on.comments
			);

			if (match.length == 0) {
				await placeService.addOwnership(on);
			}
		}

		let oldFunctions = await placeService.getPreviousOwnershipsFor(
			parseInt(id)
		);

		for (let on of oldFunctions) {
			let match = prevOwnerships.filter(
				(n: PreviousOwnership) =>
					n.ownershipDate == on.ownershipDate &&
					n.ownershipNumber == on.ownershipNumber &&
					n.ownershipName == on.ownershipName
			);

			if (match.length == 0) {
				await placeService.removePreviousOwnership(on.id);
			}
		}

		for (let on of prevOwnerships) {
			let match = oldFunctions.filter(
				(n: PreviousOwnership) =>
					n.ownershipDate == on.ownershipDate &&
					n.ownershipNumber == on.ownershipNumber &&
					n.ownershipName == on.ownershipName
			);

			if (match.length == 0) {
				delete on.typeName;
				await placeService.addPreviousOwnership(on);
			}
		}

		return res.json({
			messages: [{ variant: 'success', text: 'Site updated' }],
		});
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
		body('category').isInt(),
		body('contributingResources').isArray(),
		body('designations').isArray(),
		body('historicalPatterns').isArray(),
		body('names').isArray(),
		body('primaryName').isString(),
		body('records').isArray(),
		body('showInRegister').isBoolean(),
		body('siteCategories').isArray(),
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
