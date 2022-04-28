import knex, { Knex } from 'knex';
import { QueryStatement, SortStatement } from './';
import { Photo, PHOTO_FIELDS, SavedFilter } from '../data';
import _ from 'lodash';

export class PhotoService {
	private knex: Knex;

	constructor(config: Knex.Config<any>) {
		this.knex = knex(config);
		//this.knex = Knex(config);
	}

	async getAll(skip: number, take: number): Promise<Array<Photo>> {
		return this.knex('photo')
			.select<Photo[]>(PHOTO_FIELDS)
			.orderBy('rowId')
			.offset(skip)
			.limit(take);
	}

	async getById(id: string): Promise<Photo | undefined> {
		return this.knex('photo')
			.select<Photo>(PHOTO_FIELDS)
			.where({ rowId: id })
			.first()
			.catch((err: any) => {
				//console.log('BOMBED', err);
				return undefined;
			});
	}

	async getAllForPlace(id: number): Promise<Photo[]> {
		return this.knex('photo')
			.select<Photo[]>(PHOTO_FIELDS)
			.where({ placeId: id })
			.catch((err: any) => {
				//console.log('BOMBED', err);
				return new Array<Photo>();
			});
	}

	async getFileById(id: string): Promise<Photo | undefined> {
		return this.knex('photo')
			.select<Photo>('file')
			.where({ rowId: id })
			.first()
			.catch((err: any) => {
				//console.log('BOMBED', err);
				return undefined;
			});
	}

	async getThumbFileById(id: string): Promise<Photo | undefined> {
		return this.knex('photo')
			.select<Photo>('thumbFile')
			.where({ rowId: id })
			.first()
			.catch((err: any) => {
				//console.log('BOMBED', err);
				return undefined;
			});
	}

	async getPhotoCount(): Promise<number> {
		return new Promise(async (resolve, reject) => {
			let results = await this.knex<number>('photo').count('*', {
				as: 'count',
			});

			if (results) {
				let val = results[0].count as number;
				resolve(val);
			}

			resolve(0);
		});
	}

	async addPhoto(item: Photo): Promise<Photo | undefined> {
		return this.knex('photo').insert(item).returning<Photo>(PHOTO_FIELDS);
	}

	async updatePhoto(id: string, item: Photo): Promise<Photo | undefined> {
		return this.knex('photo')
			.where({ rowId: id })
			.update(item)
			.returning<Photo>(PHOTO_FIELDS);
	}

	async doSearch(
		query: Array<QueryStatement>,
		sort: Array<SortStatement>,
		page: number,
		page_size: number,
		skip: number,
		take: number
	): Promise<any> {
		return new Promise(async (resolve, reject) => {
			let selectStmt = this.knex('photo');
			let countStmt = this.knex('photo');

			////console.log(query);

			if (query && query.length > 0) {
				query.forEach((stmt) => {
					switch (stmt.operator) {
						case 'eq': {
							let p = {};
							let m = `{"${stmt.field}": "${stmt.value}"}`;
							Object.assign(p, JSON.parse(m));
							selectStmt.where(p);
							countStmt.where(p);
							break;
						}
						case 'in': {
							let items = stmt.value.split(',');
							countStmt.whereIn(stmt.field, items);
							selectStmt.whereIn(stmt.field, items);
							break;
						}
						case 'notin': {
							let items = stmt.value.split(',');
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
							selectStmt.whereRaw(
								`LOWER(${stmt.field}) like '%${stmt.value.toLowerCase()}%'`
							);
							countStmt.whereRaw(
								`LOWER(${stmt.field}) like '%${stmt.value.toLowerCase()}%'`
							);
							break;
						}
						case 'notcontains': {
							selectStmt.whereRaw(
								`LOWER(${stmt.field}) not like '%${stmt.value.toLowerCase()}%'`
							);
							countStmt.whereRaw(
								`LOWER(${stmt.field}) not like '%${stmt.value.toLowerCase()}%'`
							);
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

			let item_count = await countStmt
				.count('*', { as: 'counter' })
				.then((t: any) => t)
				.catch((err: any) => {
					//console.log('COUNT Query Error');
					//console.log(err);
					return reject(err.originalError.info.message);
				});

			let count = 0;

			if (item_count) {
				let t = item_count[0];
				let y = t.counter as string;
				count = parseInt(y);
			}

			let page_count = Math.ceil(count / page_size);
			let fields = _.clone(PHOTO_FIELDS);
			fields.push('thumbFile');
			let data = await selectStmt
				.select<Photo[]>(fields)
				.offset(skip)
				.limit(take);
			let results = {
				data,
				meta: { page, page_size, item_count: count, page_count },
			};

			resolve(results);
		});
	}

	async addSavedFilter(item: SavedFilter): Promise<SavedFilter | undefined> {
		return this.knex('savedFilter')
			.insert(item)
			.returning<SavedFilter>(['id', 'userId', 'name', 'resultType', 'value']);
	}

	async deleteSavedFilter(id: number): Promise<any> {
		return this.knex('savedFilter').where({ id }).delete();
	}

	async getSavedFilterByUser(id: string): Promise<any> {
		return this.knex('savedFilter')
			.select<SavedFilter>(['id', 'userId', 'name', 'resultType', 'value'])
			.where({ userId: id })
			.where({ resultType: 'Photo' })
			.catch((err: any) => {
				//console.log('BOMBED', err);
				return undefined;
			});
	}

	async updateFile(id: string, loadFile: Buffer): Promise<Photo | undefined> {
		return this.knex('photo').where({ rowId: id }).update({ File: loadFile });
	}

	async updateThumbFile(
		id: string,
		thumbnail: Buffer
	): Promise<Photo | undefined> {
		return this.knex('photo')
			.where({ rowId: id })
			.update({ ThumbFile: thumbnail })
			.returning<Photo>(PHOTO_FIELDS);
	}

	async getPlaceAssociations(id: string): Promise<any> {
		return this.knex('photo')
			.where('RowID', id)
			.join('dbo.place as PL', 'PL.id', '=', 'photo.placeId')
			.leftOuterJoin('community', 'community.id', 'PL.communityid')
			.select([
				'PL.id',
				'PL.primaryName',
				'PL.yHSIId',
				'community.name as communityName',
			])
			.catch((err: any) => {
				//console.log('BOMBED', err);
				return undefined;
			});
	}

	async getYtPlaceAssociations(id: string): Promise<any> {
		return this.knex('place.photo as PH')
			.where('PH.photo_RowId', id)
			.join('place.place as PL', 'PL.id', '=', 'PH.placeId')
			.select(['PL.id', 'PL.name'])
			.catch((err: any) => {
				//console.log('BOMBED', err);
				return undefined;
			});
	}

	async getBoatAssociations(id: string): Promise<any> {
		return this.knex('boat.photo as PH')
			.where('PH.photo_RowId', id)
			.join('boat.boat as B', 'B.id', '=', 'PH.boatId')
			.select(['B.id', 'B.name', 'B.vesseltype'])
			.catch((err: any) => {
				//console.log('BOMBED', err);
				return undefined;
			});
	}

	async getAircrashAssociations(id: string): Promise<any> {
		return this.knex('aircrash.photo as PH')
			.where('PH.photo_RowId', id)
			.join('aircrash.aircrash as A', 'A.yacsinumber', '=', 'PH.yacsinumber')
			.select(['A.yacsinumber', 'A.aircraftRegistration', 'A.aircraftType'])
			.catch((err: any) => {
				//console.log('BOMBED', err);
				return undefined;
			});
	}

	async getPeopleAssociations(id: string): Promise<any> {
		return this.knex('person.photo as PH')
			.where('PH.photoId', id)
			.join('person.person as P', 'P.personId', '=', 'PH.personId')
			.select(['P.personId', 'P.birthYear', 'P.deathYear'])
			.select(this.knex.raw("P.givenName + ' ' + P.surname as name"))
			.catch((err: any) => {
				console.log('BOMBED', err);
				return undefined;
			});
	}

	async getBurialAssociations(id: string): Promise<any> {
		return this.knex('burial.photo as PH')
			.where('PH.photo_RowId', id)
			.join('burial.burial as B', 'B.burialId', '=', 'PH.burialId')
			.select(['B.burialId', 'B.birthYear', 'B.deathYear'])
			.select(this.knex.raw("B.firstName + ' ' + B.lastName as name"))
			.catch((err: any) => {
				console.log('BOMBED', err);
				return undefined;
			});
	}

	async getIntSiteAssociations(id: string): Promise<any> {
		return this.knex('interpretiveSite.photos as PH')
			.where('PH.photo_RowId', id)
			.join('interpretiveSite.sites as S', 'S.siteId', '=', 'PH.siteId')
			.select(['S.siteId', 'S.siteName', 'S.routeName', 'S.kmNum'])
			.catch((err: any) => {
				console.log('BOMBED', err);
				return undefined;
			});
	}

	async deletePlaceAssociation(id: string): Promise<any> {
		return this.knex('photo')
			.where({ RowID: id })
			.update({ placeId: null })
			.catch((err: any) => {
				//console.log('BOMBED', err);
				return undefined;
			});
	}

	async deleteYtPlaceAssociation(id: string, ytplaceId: string): Promise<any> {
		return this.knex('place.photo')
			.where({ photo_RowId: id })
			.where({ placeId: ytplaceId })
			.delete();
	}

	async deleteBoatAssociation(id: string, boatId: string): Promise<any> {
		return this.knex('boat.photo')
			.where({ photo_RowId: id })
			.where({ boatId: boatId })
			.delete();
	}

	async deleteAircrashAssociation(
		id: string,
		yacsinumber: string
	): Promise<any> {
		return this.knex('aircrash.photo')
			.where({ photo_RowId: id })
			.where({ yacsinumber: yacsinumber })
			.delete();
	}

	async deletePeopleAssociation(id: string, personId: string): Promise<any> {
		return this.knex('person.photo')
			.where({ photoId: id })
			.where({ personId: personId })
			.delete();
	}

	async deleteBurialAssociation(id: string, burialId: string): Promise<any> {
		return this.knex('burial.photo')
			.where({ photo_RowId: id })
			.where({ burialId: burialId })
			.delete();
	}

	async deleteIntSiteAssociation(id: string, siteId: string): Promise<any> {
		return this.knex('interpretiveSite.photos')
			.where({ photo_RowId: id })
			.where({ siteId: siteId })
			.delete();
	}
}
