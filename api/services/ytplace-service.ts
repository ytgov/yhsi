import _ from 'lodash';

import db from 'db/db-client';
import { QueryStatement, SortStatement } from './';
import {
	AlternateName,
	FirstNationName,
	FnAssociation,
	PlacePhoto,
	PlaceType,
	PlaceTypeLookup,
	PlaceHistory,
	YtPlace,
	YTPLACE_FIELDS,
} from '../data';
import { GenericEnum } from './static-service';

export class YtPlaceService {
	async getAll(skip: number, take: number): Promise<Array<YtPlace>> {
		return db('Place.place')
			.select<YtPlace[]>(YTPLACE_FIELDS)
			.orderBy('id')
			.offset(skip)
			.limit(take);
	}

	async getById(id: number): Promise<YtPlace | undefined> {
		return db('Place.place')
			.select<YtPlace>(YTPLACE_FIELDS)
			.where({ id: id })
			.first()
			.catch(() => {
				return undefined;
			});
	}

	async getPlaceCount(): Promise<number> {
		const results = await db<number>('Place.place').count('*', {
			as: 'count',
		});

		if (!results) {
			throw new Error('Failed to get place count');
		}

		return results[0].count as number;
	}

	async addPlace(item: YtPlace): Promise<YtPlace | undefined> {
		return db('Place.place').insert(item).returning<YtPlace>(YTPLACE_FIELDS);
	}

	async updatePlace(id: number, item: YtPlace): Promise<YtPlace | undefined> {
		return db('Place.place').where({ id }).update(item);
	}

	async getPlaceTypesFor(id: number): Promise<PlaceType[]> {
		return db('Place.placetype')
			.where({ placeId: id })
			.select<PlaceType[]>(['placeId', 'placeTypeLookupId']);
	}

	async getPlaceTypeNames(): Promise<Array<PlaceTypeLookup>> {
		return db<PlaceTypeLookup>('Place.PlaceTypeLookup').select('id', 'placeType');
	}

	// Note "fnDesription" is a typo in the table column
	async getFirstNationNamesFor(id: number): Promise<FirstNationName[]> {
		return db('Place.FirstNationName')
			.where({ placeId: id })
			.select<FirstNationName[]>(['id', 'placeId', 'fnName', 'fnLanguage', 'fnDesription']);
	}

	async getAlternateNamesFor(id: number): Promise<AlternateName[]> {
		return db('Place.AlternateName')
			.where({ placeId: id })
			.select<AlternateName[]>(['id', 'placeId', 'alternateName']);
	}

	async getPlaceHistoriesFor(id: number): Promise<PlaceHistory[]> {
		return db('Place.PlaceHistory')
			.where({ placeId: id })
			.select<PlaceHistory[]>(['id', 'placeId', 'historyText', 'reference', 'restricted']);
	}

	async getPlacePhotosFor(id: number): Promise<PlacePhoto[]> {
		return db('Place.PlacePhoto')
			.where({ placeId: id })
			.select<PlacePhoto[]>(['id', 'placeId', 'photoRowId']);
	}

	async getFNAssociationsFor(id: number): Promise<FnAssociation[]> {
		return db('Place.FnAssociation')
			.where({ placeId: id })
			.select<FnAssociation[]>(['placeId', 'firstNationId', 'fnAssociationType']);
	}

	async addFNAssociation(fnAssoc: FnAssociation) {
		return db('Place.FnAssociation').insert(fnAssoc);
	}

	async removeFNAssociation(fnAssoc: FnAssociation) {
		return db('Place.FnAssociation').where(fnAssoc).delete();
	}

	async addFirstNationName(name: FnAssociation) {
		return db('Place.FirstNationName').insert(name);
	}

	async removeFirstNationName(nameId: number) {
		return db('Place.FirstNationName').where({ id: nameId }).delete();
	}

	async getAltNamesFor(id: number) {
		return db('Place.AlternateName')
			.where({ placeId: id })
			.select<AlternateName[]>(['id', 'placeId', 'alternateName']);
	}

	async addAlternateName(name: AlternateName) {
		return db('Place.AlternateName').insert(name);
	}

	async removeAlternateName(id: number) {
		return db('Place.AlternateName').where({ id }).delete();
	}

	async addPlaceType(placeType: PlaceType) {
		return db('Place.PlaceType').insert(placeType);
	}

	async removePlaceType(placeType: PlaceType) {
		return db('Place.PlaceType').where(placeType).delete();
	}

	getFNAssociationTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'Settlement Lands' },
			{ value: 2, text: 'Traditional Territory' },
		];
	}

	async doSearch(
		query: Array<QueryStatement>,
		sort: Array<SortStatement>,
		page: number,
		page_size: number,
		skip: number,
		take: number
	): Promise<any> {
		const selectStmt = db('Place.place').distinct().select(YTPLACE_FIELDS);
		//.leftOuterJoin("firstnationassociation", "Place.id", "firstnationassociation.placeId")
		//.leftOuterJoin("constructionPeriod", "Place.id", "constructionPeriod.placeId")
		//.leftOuterJoin("revisionLog", "Place.id", "revisionLog.placeId")
		//.leftOuterJoin("description", "Place.id", "description.placeId");

		if (query && query.length > 0) {
			query.forEach((stmt) => {
				switch (stmt.operator) {
					case 'eq': {
						const p = {};
						const m = `{"${stmt.field}": "${stmt.value}"}`;
						Object.assign(p, JSON.parse(m));
						selectStmt.orWhere(p);
						break;
					}
					case 'in': {
						const items = stmt.value.split(',');
						selectStmt.orWhereIn(stmt.field, items);
						break;
					}
					case 'notin': {
						const items = stmt.value.split(',');
						selectStmt.whereNotIn(stmt.field, items);
						break;
					}
					case 'gt': {
						selectStmt.orWhere(stmt.field, '>', stmt.value);
						break;
					}
					case 'gte': {
						selectStmt.orWhere(stmt.field, '>=', stmt.value);
						break;
					}
					case 'lt': {
						selectStmt.orWhere(stmt.field, '<', stmt.value);
						break;
					}
					case 'lte': {
						////console.log(`Testing ${stmt.field} for IN on ${stmt.value}`)
						selectStmt.orWhere(stmt.field, '<=', stmt.value);
						break;
					}
					case 'contains': {
						selectStmt.orWhereRaw(`LOWER(${stmt.field}) like '%${stmt.value.toLowerCase()}%'`);
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
			selectStmt.orderBy('Place.id');
		}

		const fullData = await selectStmt;
		const uniqIds = _.uniq(fullData.map((i: any) => i.id));
		const count = uniqIds.length;
		const page_count = Math.ceil(count / page_size);

		const data = await selectStmt.offset(skip).limit(take);
		const results = {
			data,
			meta: { page, page_size, item_count: count, page_count },
		};

		return results;
	}
}
