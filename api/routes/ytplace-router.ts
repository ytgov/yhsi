import { difference } from 'lodash';
import express, { Request, Response } from 'express';
import { body, check, param, query, validationResult } from 'express-validator';

import { authorize } from '@/middleware/authorization';
import { UserRoles } from '@/models';
import db from '@/db/db-client';

import { YtPlaceService, SortDirection, SortStatement, StaticService } from '../services';
import { AlternateName, PlaceType, FnAssociation, FirstNationName } from '../data';
import { ReturnValidationErrors } from '../middleware';

const ytPlaceService = new YtPlaceService();
const staticService = new StaticService();
const PAGE_SIZE = 10;

export const ytPlaceRouter = express.Router();

ytPlaceRouter.get(
	'/',
	[query('page').default(1).isInt({ gt: 0 })],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const page = parseInt(req.query.page as string);
		const skip = (page - 1) * PAGE_SIZE;
		const take = PAGE_SIZE;

		const list = await ytPlaceService
			.getAll(skip, take)
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return undefined;
			});

		const item_count = await ytPlaceService
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

ytPlaceRouter.post(
	'/search',
	[body('page').isInt().default(1)],
	async (req: Request, res: Response) => {
		const { query, sortBy, sortDesc, page, itemsPerPage } = req.body;
		const sort = new Array<SortStatement>();

		sortBy.forEach((s: string, i: number) => {
			sort.push({
				field: s,
				direction: sortDesc[i] ? SortDirection.ASCENDING : SortDirection.DESCENDING,
			});
		});

		const skip = (page - 1) * itemsPerPage;
		const take = itemsPerPage;
		const results = await ytPlaceService.doSearch(query, sort, page, itemsPerPage, skip, take);

		for (const place of results.data) {
			place.placeTypes = await ytPlaceService.getPlaceTypesFor(place.id);
			place.placeTypes = combine(
				place.placeTypes,
				await ytPlaceService.getPlaceTypeNames(),
				'id',
				'placeTypeLookupId',
				'placeType',
				'placeType'
			);
			place.firstNationNames = await ytPlaceService.getFirstNationNamesFor(place.id);
			place.alternateNames = await ytPlaceService.getAlternateNamesFor(place.id);
		}

		res.json(results);
	}
);

ytPlaceRouter.get(
	'/:id',
	[check('id').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const id = parseInt(req.params.id);
		const fnList = await staticService.getFirstNations();

		await ytPlaceService
			.getById(id)
			.then(async (place) => {
				if (place) {
					let placeTypes = await ytPlaceService.getPlaceTypesFor(place.id);
					placeTypes = combine(
						placeTypes,
						await ytPlaceService.getPlaceTypeNames(),
						'id',
						'placeTypeLookupId',
						'placeType',
						'placeType'
					);
					const fnNames = await ytPlaceService.getFirstNationNamesFor(place.id);
					const altNames = await ytPlaceService.getAlternateNamesFor(place.id);
					const histories = await ytPlaceService.getPlaceHistoriesFor(place.id);

					let fnAssociations = await ytPlaceService.getFNAssociationsFor(place.id);
					fnAssociations = combine(
						fnAssociations,
						fnList,
						'firstNationId',
						'id',
						'description',
						'firstNationDescription'
					);
					fnAssociations = combine(
						fnAssociations,
						await ytPlaceService.getFNAssociationTypes(),
						'value',
						'fnAssociationType',
						'text',
						'fnAssocationDesc'
					);

					const relationships = {
						placeTypes: { data: placeTypes },
						fnNames: { data: fnNames },
						altNames: { data: altNames },
						histories: { data: histories },
						fnAssociations: { data: fnAssociations },
					};

					return res.send({
						data: place,
						relationships,
					});
				} else {
					return res.status(404).send('Place not found');
				}
			})
			.catch((err) => {
				console.error(err);
				return res.status(404).send('Place not found');
			});
	}
);

ytPlaceRouter.post(
	'/',
	[body('place.name').isString().bail().notEmpty().trim()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		const {
			place = {},
			altNames = [],
			fnNames = [],
			fnAssociations = [],
			placeTypes = [],
		} = req.body;

		if (!errors.isEmpty()) {
			console.log('Validation error');
			console.log(errors.array());
			return res.status(400).json({ errors: errors.array() });
		}

		// YtPlaceService returning a YtPlace object was causing errors so using the same structure as boat-router
		delete place.id;
		const response = await db
			.insert(place)
			.into('place.place')
			.returning('*')
			.then(async (rows) => {
				const newPlace = rows[0];

				if (altNames.length) {
					const newAltNames = altNames.map((x: any) => ({
						...x,
						placeId: newPlace.Id,
					}));
					for (const on of newAltNames) {
						delete on.id;
						await ytPlaceService.addAlternateName(on);
					}
				}

				if (fnNames.length) {
					const newFnNames = fnNames.map((x: any) => ({
						...x,
						placeId: newPlace.Id,
					}));
					for (const on of newFnNames) {
						delete on.id;
						await ytPlaceService.addFirstNationName(on);
					}
				}

				if (fnAssociations.length) {
					const newFnAssocations = fnAssociations.map((x: any) => ({
						...x,
						placeId: newPlace.Id,
					}));
					for (const on of newFnAssocations) {
						await ytPlaceService.addFNAssociation(on);
					}
				}

				if (placeTypes.length) {
					const newPlaceTypes = placeTypes.map((x: any) => ({
						placeTypeLookupId: x,
						placeId: newPlace.Id,
					}));
					for (const on of newPlaceTypes) {
						await ytPlaceService.addPlaceType(on);
					}
				}

				return { id: newPlace.Id };
			})
			.catch((err) => {
				console.error('Database Error', err);
				return res.status(400).json({ errors: err });
			});

		return res.json({
			messages: [{ variant: 'success', text: 'Place added' }],
			data: response,
		});
	}
);

ytPlaceRouter.put(
	'/:id',
	[param('id').isInt().notEmpty(), body('name').isString().bail().notEmpty().trim()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { id } = req.params;
		const { placeTypes, fnNames, fnAssociations } = req.body;
		let { altNames } = req.body;

		const updater = req.body;
		delete updater.photos;
		delete updater.placeTypes;
		delete updater.fnNames;
		delete updater.altNames;
		delete updater.histories;
		delete updater.fnAssociations;

		await ytPlaceService.updatePlace(parseInt(id), updater);

		// Update alternate names
		const oldNames = await ytPlaceService.getAltNamesFor(parseInt(id));
		altNames = altNames.map((n: AlternateName) =>
			Object.assign(n, { alternateName: n.alternateName.trim() })
		);

		for (const on of oldNames) {
			const match = altNames.filter((n: AlternateName) => n.alternateName == on.alternateName);
			if (match.length == 0) {
				await ytPlaceService.removeAlternateName(on.id);
			}
		}
		for (const on of altNames) {
			const match = oldNames.filter((n: AlternateName) => n.alternateName == on.alternateName);
			if (match.length == 0) {
				delete on.id;
				await ytPlaceService.addAlternateName(on);
			}
		}

		// Update place types - note that placeTypes is just an array of placeTypeLookupIds
		const oldPlaceTypes = await ytPlaceService.getPlaceTypesFor(parseInt(id));

		for (const on of oldPlaceTypes) {
			const match = placeTypes.filter((n: number) => n == on.placeTypeLookupId);
			if (match.length == 0) {
				const placeTypeInsert = new PlaceType();
				placeTypeInsert.placeId = parseInt(id);
				placeTypeInsert.placeTypeLookupId = on.placeTypeLookupId;
				await ytPlaceService.removePlaceType(placeTypeInsert);
			}
		}
		for (const on of placeTypes) {
			const match = oldPlaceTypes.filter((n: PlaceType) => n.placeTypeLookupId == on);
			if (match.length == 0) {
				const placeTypeInsert = new PlaceType();
				placeTypeInsert.placeId = parseInt(id);
				placeTypeInsert.placeTypeLookupId = on;
				await ytPlaceService.addPlaceType(placeTypeInsert);
			}
		}

		// FnAssociations
		const oldFnAssocations = await ytPlaceService.getFNAssociationsFor(parseInt(id));
		for (const on of oldFnAssocations) {
			const match = fnAssociations.filter(
				(n: FnAssociation) =>
					n.fnAssociationType == on.fnAssociationType && n.firstNationId == on.firstNationId
			);
			if (match.length == 0) {
				const FnAssociationInsert = new FnAssociation();
				FnAssociationInsert.placeId = parseInt(id);
				FnAssociationInsert.fnAssociationType = on.fnAssociationType;
				FnAssociationInsert.firstNationId = on.firstNationId;
				await ytPlaceService.removeFNAssociation(FnAssociationInsert);
			}
		}
		for (const on of fnAssociations) {
			const match = oldFnAssocations.filter(
				(n: FnAssociation) =>
					n.fnAssociationType == on.fnAssociationType && n.firstNationId == on.firstNationId
			);
			if (match.length == 0) {
				on.placeId = parseInt(id);
				delete on.fnAssocationDesc;
				delete on.firstNationDescription;
				await ytPlaceService.addFNAssociation(on);
			}
		}

		// FnNames
		const oldFnNames = await ytPlaceService.getFirstNationNamesFor(parseInt(id));
		for (const on of oldFnNames) {
			const match = fnNames.filter(
				(n: FirstNationName) =>
					n.fnName == on.fnName &&
					n.fnDesription == on.fnDesription &&
					n.fnLanguage == on.fnLanguage
			);
			if (match.length == 0) {
				await ytPlaceService.removeFirstNationName(on.id);
			}
		}
		for (const on of fnNames) {
			const match = oldFnNames.filter(
				(n: FirstNationName) =>
					n.fnName == on.fnName &&
					n.fnDesription == on.fnDesription &&
					n.fnLanguage == on.fnLanguage
			);
			if (match.length == 0) {
				on.placeId = parseInt(id);
				delete on.id;
				await ytPlaceService.addFirstNationName(on);
			}
		}

		return res.json({
			messages: [{ variant: 'success', text: 'Place updated' }],
		});
	}
);

ytPlaceRouter.post(
	'/:placeId/photos/link',
	authorize([UserRoles.SITE_ADMIN, UserRoles.SITE_EDITOR, UserRoles.ADMINISTRATOR]),
	async (request: Request, response: Response) => {
		try {
			const { placeId } = request.params;
			const { linkPhotos } = request.body;

			const currentPhotos = await db
				.select('Photo_RowID')
				.from('Place.Photo')
				.where('PlaceId', placeId);

			const filteredLinkPhotos = difference(
				linkPhotos,
				currentPhotos.map((x: any) => {
					return x.Photo_RowID;
				})
			);

			for (const photo of filteredLinkPhotos) {
				await db
					.insert({ PlaceId: placeId, Photo_RowID: photo.rowId })
					.into('Place.Photo')
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

function combine(
	list1: Array<any>,
	list2: Array<any>,
	linker: any,
	linker2: any,
	value: any,
	typeText: any = 'typeText'
): any[] {
	list1.forEach((item) => {
		const match = list2.filter((i) => i[linker] == item[linker2]);

		if (match && match[0]) {
			const add = { [typeText]: match[0][value] };
			item = Object.assign(item, add);
		} else item = Object.assign(item, { [typeText]: null });
	});

	return list1;
}
