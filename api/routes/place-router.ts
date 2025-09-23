import express, { Request, Response } from 'express';
import { body, check, param, query, validationResult, matchedData } from 'express-validator';
import fs from 'fs';
import multer from 'multer';
import { create } from 'handlebars';
import handlebarsHelpers from '../utils/handlebars-helpers';
import { isNil, isString } from 'lodash';

import { API_PORT, DB_CONFIG } from '../config';
import { PhotoService, PlaceService } from '../services';
import { ReturnValidationErrors } from '../middleware';
import { authorize } from '../middleware/authorization';
import { Place, User, UserRoles, DESCRIPTION_TYPES, CONSTRUCTION_PERIOD_TYPES } from '../models';
import PlacesController from '../controllers/places-controller';
import { PlacePolicy } from '../policies';
import { generatePDF } from '../utils/pdf-generator';
import { createThumbnail } from '../utils/image';

const placeService = new PlaceService(DB_CONFIG);
const PAGE_SIZE = 10;

export const placeRouter = express.Router();

placeRouter.get(
	'/',
	authorize([
		UserRoles.SITE_ADMIN,
		UserRoles.SITE_EDITOR,
		UserRoles.SITE_VIEWER,
		UserRoles.SITE_VIEWER_LIMITED,
		UserRoles.ADMINISTRATOR,
	]),
	[query('page').default(1).isInt({ gt: 0 })],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const page = parseInt(req.query.page as string);
		const skip = (page - 1) * PAGE_SIZE;
		const take = PAGE_SIZE;

		const list = await placeService
			.getAll(skip, take)
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return undefined;
			});

		const item_count = await placeService
			.getPlaceCount()
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return 0;
			});

		const page_count = Math.ceil(item_count / PAGE_SIZE);

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
	authorize([
		UserRoles.SITE_ADMIN,
		UserRoles.SITE_EDITOR,
		UserRoles.SITE_VIEWER,
		UserRoles.SITE_VIEWER_LIMITED,
		UserRoles.ADMINISTRATOR,
	]),
	[body('page').isInt().default(1)],
	PlacesController.searchPlaces
);

placeRouter.post(
	'/generate-id',
	authorize([UserRoles.SITE_ADMIN, UserRoles.SITE_EDITOR, UserRoles.ADMINISTRATOR]),
	[body('nTSMapSheet').isString().bail().notEmpty().trim()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { nTSMapSheet } = req.body;

		const newId = await placeService.generateIdFor(nTSMapSheet);

		res.json({ data: { yHSIId: newId, nTSMapSheet } });
	}
);

placeRouter.get(
	'/:id',
	authorize([
		UserRoles.SITE_ADMIN,
		UserRoles.SITE_EDITOR,
		UserRoles.SITE_VIEWER,
		UserRoles.SITE_VIEWER_LIMITED,
		UserRoles.ADMINISTRATOR,
	]),
	[check('id').notEmpty()],
	ReturnValidationErrors,
	PlacesController.getPlace
);
placeRouter.get(
	'/:id/print/:format',
	authorize([
		UserRoles.SITE_ADMIN,
		UserRoles.SITE_EDITOR,
		UserRoles.SITE_VIEWER,
		UserRoles.SITE_VIEWER_LIMITED,
		UserRoles.ADMINISTRATOR,
	]),
	[check('id').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const id = parseInt(req.params.id);
		const { format } = req.params;
		const currentUser = req.user as User;

		const placeData = await placeService
			.getById(id, currentUser)
			.then(({ place, relationships }) => {
				const policy = new PlacePolicy(currentUser, place);
				if (policy.show()) {
					return {
						place,
						relationships,
						API_PORT,
					};
				}
			});

		if (isNil(placeData)) {
			res.status(500).send('Failed to load place');
			return;
		}

		const { place } = placeData;

		// Get sections from query string
		const { sections } = req.query;

		const selectedSections = isString(sections) ? sections.split(',') : [];

		const includeSummarySection = selectedSections.includes('Summary');
		const includeLocationSection = selectedSections.includes('Location');
		const includeDatesAndConditionSection = selectedSections.includes('Dates & Condition');
		const includeThemesAndFunctionSection = selectedSections.includes('Themes & Function');
		const includeAssociationsSection = selectedSections.includes('Associations');
		const includeLegalAndZoningSection = selectedSections.includes('Legal & Zoning');
		const includePhotosSection = selectedSections.includes('Photos');
		const includeManagementSection = selectedSections.includes('Management');
		const includeDescriptionSection = selectedSections.includes('Description');

		//(place as any).API_PORT = API_PORT;
		const PDF_TEMPLATE = fs.readFileSync(__dirname + '/../templates/places/placePrint.handlebars');
		const h = create();
		h.registerHelper('joinArray', handlebarsHelpers.joinArray);
		h.registerHelper('joinArrayPick', handlebarsHelpers.joinArrayPick);
		const template = h.compile(PDF_TEMPLATE.toString(), {});

		const {
			primaryName,
			names,
			historicalPatterns,
			yHSIId,
			jurisdiction,
			statuteId,
			statute2Id,
			recognitionDate,
			ownerConsent,
			category,
			isPubliclyAccessible,
			nTSMapSheet,
			bordenNumber,
			geocode,
			hectareArea,
			latitude,
			longitude,
			locationComment,
			resourceType,
			buildingSize,
			conditionComment,
			currentUseComment,
			yHSPastUse,
			cIHBNumber,
			groupYHSI,
			yGBuildingNumber,
			yGReserveNumber,
			fHBRONumber,
			zoning,
			townSiteMapNumber,
			siteDistrictNumber,
			planNumber,
			block,
			lot,
			slideNegativeIndex,
			otherCommunity,
			otherLocality,
			previousAddress,
			yHSThemes,
			rollNumber,
			locationContext,
			communityId,
			lAGroup,
			siteStatus,
			floorCondition,
			wallCondition,
			doorCondition,
			roofCondition,
			coordinateDetermination,
			physicalAddress,
			physicalProvince,
			physicalCountry,
			physicalPostalCode,
			mailingAddress,
			mailingProvince,
			mailingCountry,
			mailingPostalCode,
			showInRegister,
			siteCategories,
			designations,
			contributingResources,
			records,
			communityName,
			coordinateDeterminationName,
			hasPendingChanges,
			associations,
			constructionPeriods,
			contacts,
			dates,
			themes,
		} = place;

		const constructionPeriodsHandlebarData: { type: string }[] = [];
		if (!isNil(constructionPeriods)) {
			constructionPeriods.forEach((constructionPeriod) => {
				const c = CONSTRUCTION_PERIOD_TYPES.find(
					(constructionPeriodType) => constructionPeriodType.value == constructionPeriod.type
				);

				if (isNil(c)) return;

				constructionPeriodsHandlebarData.push({
					type: c.text,
				});
			});
		}

		// Generating data for description
		const descriptions: {
			value: string;
			text: string;
		}[] = [];

		if (!isNil(place.descriptions)) {
			place.descriptions.forEach((description) => {
				const d = DESCRIPTION_TYPES.find(
					(descriptionType) => descriptionType.value == description.type
				);

				if (isNil(d)) return;

				descriptions.push({
					value: d.text,
					text: description.descriptionText,
				});
			});
		}

		// Main object to passed to placePrint.handlebars
		const handlebarsData = {
			includeSummarySection,
			includeLocationSection,
			includeDatesAndConditionSection,
			includeThemesAndFunctionSection,
			includeAssociationsSection,
			includeLegalAndZoningSection,
			includePhotosSection,
			includeManagementSection,
			includeDescriptionSection,
			primaryName,
			names,
			historicalPatterns,
			yHSIId,
			jurisdiction,
			statuteId,
			statute2Id,
			recognitionDate,
			ownerConsent,
			category,
			isPubliclyAccessible,
			nTSMapSheet,
			bordenNumber,
			geocode,
			hectareArea,
			latitude,
			longitude,
			locationComment,
			resourceType,
			buildingSize,
			conditionComment,
			currentUseComment,
			yHSPastUse,
			cIHBNumber,
			groupYHSI,
			yGBuildingNumber,
			yGReserveNumber,
			fHBRONumber,
			zoning,
			townSiteMapNumber,
			siteDistrictNumber,
			planNumber,
			block,
			lot,
			slideNegativeIndex,
			otherCommunity,
			otherLocality,
			previousAddress,
			yHSThemes,
			rollNumber,
			locationContext,
			communityId,
			lAGroup,
			siteStatus,
			floorCondition,
			wallCondition,
			doorCondition,
			roofCondition,
			coordinateDetermination,
			physicalAddress,
			physicalProvince,
			physicalCountry,
			physicalPostalCode,
			mailingAddress,
			mailingProvince,
			mailingCountry,
			mailingPostalCode,
			showInRegister,
			siteCategories,
			designations,
			contributingResources,
			records,
			communityName,
			coordinateDeterminationName,
			hasPendingChanges,
			associations,
			constructionPeriods: constructionPeriodsHandlebarData,
			contacts,
			dates,
			themes,
			descriptions,
		};

		console.log(handlebarsData);

		const data = template(handlebarsData);

		if (format == 'html') {
			res.send(data);
		} else {
			const pdf = await generatePDF(data, 'letter', false);
			const primaryName = place.primaryName;
			res.setHeader('Content-disposition', `filename="SitePrint-${primaryName}.pdf"`);
			res.setHeader('Content-type', 'application/pdf');
			res.send(pdf);
		}
	}
);

placeRouter.post(
	'/',
	authorize([UserRoles.SITE_ADMIN, UserRoles.SITE_EDITOR, UserRoles.ADMINISTRATOR]),
	[
		body('primaryName').isString().bail().notEmpty().trim(),
		//body('yHSIId').isString().bail().notEmpty().trim(),
		body('jurisdiction').isInt().bail().notEmpty(),
		body('statuteId').isInt().bail().notEmpty(),
		body('statute2Id').isInt().bail().notEmpty(),
		body('ownerConsent').isInt().bail().notEmpty(),
		body('category').isInt().bail().notEmpty(),
		body('communityId').isInt().bail().notEmpty(),
		body('siteStatus').isInt().bail().notEmpty(),
		body('floorCondition').isInt().bail().notEmpty(),
		body('wallCondition').isInt().bail().notEmpty(),
		body('doorCondition').isInt().bail().notEmpty(),
		body('roofCondition').isInt().bail().notEmpty(),
		body('coordinateDetermination').isInt().bail().notEmpty(),
		body('isPubliclyAccessible').isBoolean().bail().notEmpty(),
		body('showInRegister').isBoolean().bail().notEmpty(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		const currentUser = req.user as User;

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		req.body.yHSIId = await placeService.generateIdFor(req.body.nTSMapSheet);

		const result = await placeService
			.addPlace(req.body as Place, currentUser)
			.then((item) => item)
			.catch((err) => {
				console.log('addPlace ERROR', err);
				return res.json({ errors: err });
			});

		return res.json({ data: result });
	}
);

placeRouter.post(
	'/:id/photo',
	authorize([UserRoles.SITE_ADMIN, UserRoles.SITE_EDITOR, UserRoles.ADMINISTRATOR]),
	multer().single('file'),
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			const ThumbFile = await createThumbnail(req.file.buffer);
			const body = {
				File: req.file.buffer,
				ThumbFile,
				...req.body,
				placeId: id,
				dateCreated: new Date(),
			};

			const photoService = new PhotoService(DB_CONFIG);
			photoService.addPhoto(body);

			return res.json({ data: 'success' });
		} catch (err) {
			return res.json({ data: 'failuer', error: err });
		}
	}
);

placeRouter.get(
	'/:id/primary-photo',
	authorize([
		UserRoles.SITE_ADMIN,
		UserRoles.SITE_EDITOR,
		UserRoles.SITE_VIEWER,
		UserRoles.SITE_VIEWER_LIMITED,
		UserRoles.ADMINISTRATOR,
	]),
	multer().single('file'),
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const photoService = new PhotoService(DB_CONFIG);
			const placePhotos = await photoService.getForPlace(parseInt(id));

			const defaultPhoto = placePhotos.find((photo) => photo.isSiteDefault);
			if (defaultPhoto) return res.json({ data: defaultPhoto });

			const otherPhotos = placePhotos.filter((photo) => !photo.isPrivate);
			if (otherPhotos) return res.json({ data: otherPhotos[0] });

			return res.json({ data: null });
		} catch (err) {
			return res.json({ data: 'failuer', error: err });
		}
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
		body('cIHBNumber').isString().optional({ nullable: true }),
		body('communityId').isInt().optional(),
		body('conditionComment').isString().optional({ nullable: true }),
		body('constructionPeriods').isArray().optional({ nullable: true }),
		body('contacts').isArray().optional({ nullable: true }),
		body('contributingResources').isArray().optional({ nullable: true }),
		body('coordinateDetermination').isInt().optional(),
		body('currentUseComment').isString().optional({ nullable: true }),
		body('dates').isArray().optional({ nullable: true }),
		body('descriptions').isArray().optional({ nullable: true }),
		body('designations').isArray().optional({ nullable: true }),
		body('doorCondition').isInt().optional(),
		body('fHBRONumber').isString().optional({ nullable: true }),
		body('firstNationAssociations').isArray().optional({ nullable: true }),
		body('floorCondition').isInt().optional(),
		body('functionalUses').isArray().optional({ nullable: true }),
		body('groupYHSI').isString().optional({ nullable: true }),
		body('hectareArea').isString().optional({ nullable: true }),
		body('historicalPatterns').isArray().optional({ nullable: true }),
		body('isPubliclyAccessible').isBoolean().optional(),
		body('jurisdiction').isInt().optional(),
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
		body('ownerConsent').isInt().optional(),
		body('ownerships').isArray().optional({ nullable: true }),
		body('physicalAddress').isString().optional({ nullable: true }),
		body('physicalCountry').isString().optional({ nullable: true }),
		body('physicalPostalCode').isString().optional({ nullable: true }),
		body('physicalProvince').isString().optional({ nullable: true }),
		body('planNumber').isString().optional({ nullable: true }),
		body('previousAddress').isString().optional({ nullable: true }),
		body('previousOwnerships').isArray().optional({ nullable: true }),
		body('primaryName').isString().optional(),
		body('recognitionDate').isDate().optional({ nullable: true }),
		body('records').isArray().optional({ nullable: true }),
		body('resourceType').isString().optional({ nullable: true }),
		body('revisionLogs').isArray().optional({ nullable: true }),
		body('roofCondition').isInt().optional(),
		body('showInRegister').isBoolean().optional(),
		body('siteCategories').isArray().optional({ nullable: true }),
		body('siteDistrictNumber').isString().optional({ nullable: true }),
		body('siteStatus').isInt().optional(),
		body('statute2Id').isInt().optional(),
		body('statuteId').isInt().optional(),
		body('themes').isArray().optional({ nullable: true }),
		body('townSiteMapNumber').isString().optional({ nullable: true }),
		body('wallCondition').isInt().optional(),
		body('webLinks').isArray().optional({ nullable: true }),
		body('yGBuildingNumber').isString().optional({ nullable: true }),
		body('yGReserveNumber').isString().optional({ nullable: true }),
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
