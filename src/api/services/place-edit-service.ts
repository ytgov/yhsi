import knex, { Knex } from 'knex';
import { camelCase, mapKeys } from 'lodash';

import { DB_CONFIG } from '../config';
import { mapKeysDeep } from '../utils/lodash-extensions';
import { Place, PlaceEdit, PlainObject } from '../models';

interface CountQuery {
	count: number;
}

function parseAndNormalizeJSONColumns(object: PlainObject) {
	Object.keys(object).forEach((key) => {
		if (key.endsWith('JSON')) {
			const cleanedKey = key.replace(/JSON$/, '');
			const objectAsJson = JSON.parse(object[key]);
			object[cleanedKey] = mapKeysDeep(objectAsJson, camelCase);
			delete object[key];
		}
	});
	return object;
}

export class PlaceEditService {
	private db: Knex;
	private _defaultScope: Knex.QueryBuilder;

	constructor() {
		this.db = knex(DB_CONFIG);
		this._defaultScope = this.db
			.select({
				id: 'PlaceEdit.Id',
				yHSIId: 'YHSIId',
				primaryName: 'PrimaryName',
				editorId: 'EditorUserId',
				editorEmail: 'Security.User.Email',
				editDate: 'EditDate',
			})
			.from('PlaceEdit')
			.leftOuterJoin(
				'Security.User',
				'Security.User.Id',
				'PlaceEdit.EditorUserId'
			);
	}

	get defaultScope(): Knex.QueryBuilder {
		return this._defaultScope.clone();
	}

	count(scope: Knex.QueryBuilder): Promise<number> {
		return this.db
			.count('PlaceEdit.Id', { as: 'count' })
			.from('PlaceEdit')
			.innerJoin(scope.as('t2'), 't2.Id', 'PlaceEdit.Id')
			.first<CountQuery>()
			.then((r) => r['count']);
	}

	computeOffset(page: number, itemsPerPage: number): number {
		return (page - 1) * itemsPerPage;
	}

	buildDetailedView(id: number) {
		return this.defaultScope
			.first({
				placeId: 'PlaceId',
				category: 'Category',
				contributingResources: 'ContributingResources',
				designations: 'Designations',
				historicalPatternsJSON: 'HistoricalPatternJSON',
				namesJSON: 'NameJSON',
				records: 'Records',
				showInRegister: 'ShowInRegister',
				siteCategories: 'SiteCategories',
			})
			.where({ 'PlaceEdit.Id': id })
			.then(parseAndNormalizeJSONColumns)
			.then((place) => {
				place.contributingResources = Place.decodeCommaDelimitedArray(
					place.contributingResources
				);
				place.designations = Place.decodeCommaDelimitedArray(
					place.designations
				);
				place.records = Place.decodeCommaDelimitedArray(place.records);
				place.siteCategories = Place.decodeCommaDelimitedArray(
					place.siteCategories
				);

				return place;
			});
	}

	async buildTableView(page: number, itemsPerPage: number) {
		const offset = this.computeOffset(page, itemsPerPage);
		const totalCount = await this.count(this.defaultScope);

		return this.defaultScope
			.limit(itemsPerPage)
			.offset(offset)
			.orderBy('EditDate', 'desc')
			.then((results) => {
				return {
					results,
					totalCount,
				};
			});
	}

	create(data: PlaceEdit) {
		return Promise.resolve(data)
			.then(PlaceEdit.encodeAndDenormalizeJSONColumns)
			.then(Place.encodeCommaDelimitedArrayColumns)
			.then(PlaceEdit.stripOutNonColumnAttributes)
			.then((normalizedData) => {
				delete normalizedData['id'];

				return this.db('PlaceEdit').insert(normalizedData);
			});
	}

	delete(id: number) {
		return this.db.where({ 'PlaceEdit.Id': id }).from('PlaceEdit').delete();
	}

	existsForPlace(id: number) {
		return this.db
			.first('Id')
			.from('PlaceEdit')
			.where({ PlaceId: id })
			.then((result) => {
				if (result) return true;

				return false;
			});
	}
}
