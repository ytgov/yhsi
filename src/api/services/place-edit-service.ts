import knex, { Knex } from 'knex';
import { camelCase, mapKeys } from 'lodash';

import { DB_CONFIG } from '../config';
import { mapKeysDeep, pascalCase } from '../utils/lodash-extensions';
import { Place, PlaceEdit } from '../models';

const JS_TO_JSON_COLUMN_TRANSLATIONS: { [key: string]: string } = Object.freeze(
	{
		names: 'NameJSON',
		historicalPatterns: 'HistoricalPatternJSON',
	}
);

interface CountQuery {
	count: number;
}

interface PlainObject {
	[key: string]: any;
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

function encodeAndDenormalizeJSONColumns(object: PlainObject) {
	Object.keys(object).forEach((key) => {
		if (JS_TO_JSON_COLUMN_TRANSLATIONS[key]) {
			const encodedKey = JS_TO_JSON_COLUMN_TRANSLATIONS[key];
			const encodedValue = mapKeysDeep(object[key], pascalCase);
			const jsonObjectAsString = JSON.stringify(encodedValue);
			object[encodedKey] = jsonObjectAsString;
			delete object[key];
		}
	});
	return object;
}

function encodeCommaDelimitedArrayColumns(object: PlainObject) {
	Place.COMMA_DELIMITED_ARRAY_COLUMNS.forEach((column) => {
		object[column] = Place.encodeCommaDelimitedArray(object[column]);
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
			.then(encodeAndDenormalizeJSONColumns)
			.then(encodeCommaDelimitedArrayColumns)
			.then((normalizedData) => {
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
