import _ from 'lodash';

import db from '@/db/db-client';

import { QueryStatement, SortStatement } from './';
import { Photo, PHOTO_FIELDS, SavedFilter } from '../data';

export class PhotoService {
	async getAll(skip: number, take: number): Promise<Array<Photo>> {
		return db('photo').select<Photo[]>(PHOTO_FIELDS).orderBy('rowId').offset(skip).limit(take);
	}

	async getById(id: string): Promise<Photo | undefined> {
		return db('photo')
			.select<Photo>(PHOTO_FIELDS)
			.where({ rowId: id })
			.first()
			.catch((err: any) => {
				console.log('BOMBED', err);
				return undefined;
			});
	}

	// actually getAllForSite
	async getAllForPlace(id: number): Promise<Photo[]> {
		return db('photo')
			.select<Photo[]>(PHOTO_FIELDS)
			.where({ placeId: id })
			.catch((err) => {
				console.error(err);
				return new Array<Photo>();
			});
	}

	// actually getAllWithoutSite
	async getAllWithoutPlace(): Promise<Photo[]> {
		return db('photo')
			.select<Photo[]>(PHOTO_FIELDS)
			.where({ placeId: null })
			.catch((err) => {
				console.error(err);
				return new Array<Photo>();
			});
	}

	// actually getForSite
	async getForPlace(id: number): Promise<Photo[]> {
		return db('photo')
			.select<Photo[]>(PHOTO_FIELDS)
			.where({ placeId: id })
			.catch((err) => {
				console.error(err);
				return new Array<Photo>();
			});
	}

	async getAllForRegisterPlace(_id: number): Promise<Photo[]> {
		return db('place')
			.select<Photo[]>(PHOTO_FIELDS)
			.leftJoin('dbo.photo as PH', function () {
				this.on('PH.placeId', '=', 'place.id');
			})
			.where({ showInRegister: true })
			.catch((err) => {
				console.error(err);
				return new Array<Photo>();
			});
	}

	async getFileById(id: string): Promise<Photo | undefined> {
		return db('photo')
			.select<Photo>('file')
			.where({ rowId: id })
			.first()
			.catch((err) => {
				console.error(err);
				return undefined;
			});
	}

	async getThumbFileById(id: string): Promise<Photo | undefined> {
		return db('photo')
			.select<Photo>('thumbFile')
			.where({ rowId: id })
			.first()
			.catch((err) => {
				console.error(err);
				return undefined;
			});
	}

	async getPhotoCount(): Promise<number> {
		const results = await db<number>('photo').count('*', {
			as: 'count',
		});

		if (!results) {
			throw new Error('Failed to get Photo Count');
		}

		return results[0].count as number;
	}

	async addPhoto(item: Photo): Promise<Photo | undefined> {
		return db('photo').insert(item).returning<Photo>(PHOTO_FIELDS);
	}

	async updatePhoto(id: string, item: Photo): Promise<Photo | undefined> {
		return db('photo').where({ rowId: id }).update(item).returning<Photo>(PHOTO_FIELDS);
	}

	async doSearch(
		query: Array<QueryStatement>,
		sort: Array<SortStatement>,
		page: number,
		page_size: number,
		skip: number,
		take: number
	): Promise<any> {
		const selectStmt = db('photo');
		const countStmt = db('photo');

		if (query && query.length > 0) {
			query.forEach((stmt) => {
				switch (stmt.operator) {
					case 'eq': {
						const p = {};
						const m = `{"${stmt.field}": "${stmt.value}"}`;
						Object.assign(p, JSON.parse(m));
						selectStmt.where(p);
						countStmt.where(p);
						break;
					}
					case 'in': {
						const items = stmt.value.split(',');
						countStmt.whereIn(stmt.field, items);
						selectStmt.whereIn(stmt.field, items);
						break;
					}
					case 'notin': {
						const items = stmt.value.split(',');
						countStmt.whereNotIn(stmt.field, items);
						selectStmt.whereNotIn(stmt.field, items);
						break;
					}
					case 'gt': {
						selectStmt.where(stmt.field, '>', stmt.value);
						countStmt.where(stmt.field, '>', stmt.value);
						break;
					}
					case 'gte': {
						selectStmt.where(stmt.field, '>=', stmt.value);
						countStmt.where(stmt.field, '>=', stmt.value);
						break;
					}
					case 'lt': {
						selectStmt.where(stmt.field, '<', stmt.value);
						countStmt.where(stmt.field, '<', stmt.value);
						break;
					}
					case 'lte': {
						//console.log(`Testing ${stmt.field} for IN on ${stmt.value}`);
						selectStmt.where(stmt.field, '<=', stmt.value);
						countStmt.where(stmt.field, '<=', stmt.value);
						break;
					}
					case 'contains': {
						selectStmt.whereRaw(`LOWER(${stmt.field}) like '%${stmt.value.toLowerCase()}%'`);
						countStmt.whereRaw(`LOWER(${stmt.field}) like '%${stmt.value.toLowerCase()}%'`);
						break;
					}
					case 'notcontains': {
						selectStmt.whereRaw(`LOWER(${stmt.field}) not like '%${stmt.value.toLowerCase()}%'`);
						countStmt.whereRaw(`LOWER(${stmt.field}) not like '%${stmt.value.toLowerCase()}%'`);
						break;
					}
					default: {
						//console.log(`IGNORING ${stmt.field} on ${stmt.value}`);
					}
				}
			});
		}

		if (sort && sort.length > 0) {
			sort.forEach((stmt) => {
				selectStmt.orderBy(stmt.field, stmt.direction);
			});
		} else {
			selectStmt.orderBy('photo.rowId');
		}

		const item_count = await countStmt.count('*', { as: 'counter' }).then((t: any) => t);

		let count = 0;

		if (item_count) {
			const t = item_count[0];
			const y = t.counter as string;
			count = parseInt(y);
		}

		const page_count = Math.ceil(count / page_size);
		const fields = _.clone(PHOTO_FIELDS);
		fields.push('thumbFile');
		const data = await selectStmt.select<Photo[]>(fields).offset(skip).limit(take);
		const results = {
			data,
			meta: { page, page_size, item_count: count, page_count },
		};

		return results;
	}

	async addSavedFilter(item: SavedFilter): Promise<SavedFilter | undefined> {
		return db('savedFilter')
			.insert(item)
			.returning<SavedFilter>(['id', 'userId', 'name', 'resultType', 'value']);
	}

	async deleteSavedFilter(id: number): Promise<any> {
		return db('savedFilter').where({ id }).delete();
	}

	async getSavedFilterByUser(id: string): Promise<any> {
		return db('savedFilter')
			.select<SavedFilter>(['id', 'userId', 'name', 'resultType', 'value'])
			.where({ userId: id })
			.where({ resultType: 'Photo' })
			.catch(() => {
				return undefined;
			});
	}

	async updateFile(id: string, loadFile: Buffer): Promise<Photo | undefined> {
		return db('photo').where({ rowId: id }).update({ File: loadFile });
	}

	async updateThumbFile(id: string, thumbnail: Buffer): Promise<Photo | undefined> {
		return db('photo')
			.where({ rowId: id })
			.update({ ThumbFile: thumbnail })
			.returning<Photo>(PHOTO_FIELDS);
	}

	async getPlaceAssociations(id: string): Promise<any> {
		return db('photo')
			.where('RowID', id)
			.join('dbo.place as PL', 'PL.id', '=', 'photo.placeId')
			.leftOuterJoin('community', 'community.id', 'PL.communityid')
			.select(['PL.id', 'PL.primaryName', 'PL.yHSIId', 'community.name as communityName'])
			.catch(() => {
				return undefined;
			});
	}

	async getYtPlaceAssociations(id: string): Promise<any> {
		return db('place.photo as PH')
			.where('PH.photo_RowId', id)
			.join('place.place as PL', 'PL.id', '=', 'PH.placeId')
			.select(['PL.id', 'PL.name'])
			.catch(() => {
				return undefined;
			});
	}

	async getBoatAssociations(id: string): Promise<any> {
		return db('boat.photo as PH')
			.where('PH.photo_RowId', id)
			.join('boat.boat as B', 'B.id', '=', 'PH.boatId')
			.select(['B.id', 'B.name', 'B.vesseltype'])
			.catch(() => {
				return undefined;
			});
	}

	async getAircrashAssociations(id: string): Promise<any> {
		return db('aircrash.photo as PH')
			.where('PH.photo_RowId', id)
			.join('aircrash.aircrash as A', 'A.yacsinumber', '=', 'PH.yacsinumber')
			.select(['A.yacsinumber', 'A.aircraftRegistration', 'A.aircraftType'])
			.catch(() => {
				return undefined;
			});
	}

	async getPeopleAssociations(id: string): Promise<any> {
		return db('person.photo as PH')
			.where('PH.photoId', id)
			.join('person.person as P', 'P.personId', '=', 'PH.personId')
			.select(['P.personId', 'P.birthYear', 'P.deathYear'])
			.select(db.raw("P.givenName + ' ' + P.surname as name"))
			.catch(() => {
				return undefined;
			});
	}

	async getBurialAssociations(id: string): Promise<any> {
		return db('burial.photo as PH')
			.where('PH.photo_RowId', id)
			.join('burial.burial as B', 'B.burialId', '=', 'PH.burialId')
			.select(['B.burialId', 'B.birthYear', 'B.deathYear'])
			.select(db.raw("B.firstName + ' ' + B.lastName as name"))
			.catch(() => {
				return undefined;
			});
	}

	async getIntSiteAssociations(id: string): Promise<any> {
		return db('interpretiveSite.photos as PH')
			.where('PH.photo_RowId', id)
			.join('interpretiveSite.sites as S', 'S.siteId', '=', 'PH.siteId')
			.select(['S.siteId', 'S.siteName', 'S.routeName', 'S.kmNum'])
			.catch(() => {
				return undefined;
			});
	}

	async deletePlaceAssociation(id: string): Promise<any> {
		return db('photo')
			.where({ RowID: id })
			.update({ placeId: null })
			.catch(() => {
				return undefined;
			});
	}

	async deleteYtPlaceAssociation(id: string, ytplaceId: string): Promise<any> {
		return db('place.photo').where({ photo_RowId: id }).where({ placeId: ytplaceId }).delete();
	}

	async deleteBoatAssociation(id: string, boatId: string): Promise<any> {
		return db('boat.photo').where({ photo_RowId: id }).where({ boatId: boatId }).delete();
	}

	async deleteAircrashAssociation(id: string, yacsinumber: string): Promise<any> {
		return db('aircrash.photo')
			.where({ photo_RowId: id })
			.where({ yacsinumber: yacsinumber })
			.delete();
	}

	async deletePeopleAssociation(id: string, personId: string): Promise<any> {
		return db('person.photo').where({ photoId: id }).where({ personId: personId }).delete();
	}

	async deleteBurialAssociation(id: string, burialId: string): Promise<any> {
		return db('burial.photo').where({ photo_RowId: id }).where({ burialId: burialId }).delete();
	}

	async deleteIntSiteAssociation(id: string, siteId: string): Promise<any> {
		return db('interpretiveSite.photos')
			.where({ photo_RowId: id })
			.where({ siteId: siteId })
			.delete();
	}

	async associatePhotoToPlace(photoRowId: string, placeId: string) {
		const currentPhoto = await db
			.select('RowId', 'PlaceId')
			.from('dbo.Photo')
			.where('PlaceId', placeId)
			.where('RowId', photoRowId);

		if (currentPhoto.length > 0) {
			throw new Error('Photo already associated to place');
		}

		return db('dbo.Photo').where('RowId', photoRowId).update({ PlaceId: placeId });
	}

	async associatePhotoToBoat(photoRowId: string, boatId: string) {
		const currentPhoto = await db
			.select('Photo_RowID')
			.from('boat.Photo')
			.where('BoatId', boatId)
			.where('Photo_RowID', photoRowId);

		if (currentPhoto.length > 0) {
			throw new Error('Photo already associated to boat');
		}

		return db
			.insert({ BoatId: boatId, Photo_RowID: photoRowId })
			.into('boat.photo')
			.returning('*')
			.then((rows) => {
				return rows;
			});
	}

	async associatePhotoToAircrash(photoRowId: string, yacsinumber: string) {
		const currentPhoto = await db
			.select('Photo_RowID')
			.from('AirCrash.Photo')
			.where('YACSINumber', yacsinumber)
			.where('Photo_RowID', photoRowId);

		if (currentPhoto.length > 0) {
			throw new Error('Photo already associated to aircrash');
		}

		return db
			.insert({ YACSINumber: yacsinumber, Photo_RowID: photoRowId })
			.into('AirCrash.Photo')
			.returning('*')
			.then((rows) => {
				return rows;
			});
	}

	async associatePhotoToYtPlace(photoRowId: string, ytplaceId: string) {
		const currentPhoto = await db
			.select('Photo_RowID')
			.from('place.photo')
			.where('placeId', ytplaceId)
			.where('Photo_RowID', photoRowId);

		if (currentPhoto.length > 0) {
			throw new Error('Photo already associated to ytplace');
		}

		return db
			.insert({ placeId: ytplaceId, Photo_RowID: photoRowId })
			.into('place.photo')
			.returning('*')
			.then((rows) => {
				return rows;
			});
	}

	async associatePhotoToBurial(photoRowId: string, burialId: string) {
		const currentPhoto = await db
			.select('Photo_RowID')
			.from('Burial.Photo')
			.where('BurialId', burialId)
			.where('Photo_RowID', photoRowId);

		if (currentPhoto.length > 0) {
			throw new Error('Photo already associated to burial');
		}

		return db
			.insert({ BurialId: burialId, Photo_RowID: photoRowId })
			.into('Burial.Photo')
			.returning('*')
			.then((rows) => {
				return rows;
			});
	}

	async associatePhotoToInterpretiveSite(photoRowId: string, interpretiveSiteId: string) {
		const currentPhoto = await db
			.select('Photo_RowID')
			.from('InterpretiveSite.Photos')
			.where('SiteId', interpretiveSiteId)
			.where('Photo_RowID', photoRowId);

		if (currentPhoto.length > 0) {
			throw new Error('Photo already associated to interpretive site');
		}

		return db
			.insert({ SiteId: interpretiveSiteId, Photo_RowID: photoRowId })
			.into('InterpretiveSite.Photos')
			.returning('*')
			.then((rows) => {
				return rows;
			});
	}

	async associatePhotoToPerson(photoRowId: string, personId: string) {
		const currentPhoto = await db
			.select('PhotoID')
			.from('Person.Photo')
			.where('PersonID', personId)
			.where('PhotoID', photoRowId);

		if (currentPhoto.length > 0) {
			throw new Error('Photo already associated to person');
		}

		return db
			.insert({ PersonID: personId, PhotoID: photoRowId })
			.into('Person.Photo')
			.returning('*')
			.then((rows) => {
				return rows;
			});
	}
}
