import knex, { Knex } from 'knex';

import { DB_CONFIG } from '../config';

interface CountQuery {
	count: number;
}

interface GenericResult {
	[key: string]: any;
}

function parseJSONColumns(object: GenericResult) {
	Object.keys(object).forEach((key) => {
		if (key.endsWith('JSON')) {
			const cleanedKey = key.replace(/JSON$/, '');
			object[cleanedKey] = JSON.parse(object[key]);
			delete object[key];
		}
	});
	return object;
}

export class PlaceEditService {
	private db: Knex;
	private _defaultScope: Knex.QueryBuilder;

	constructor() {
		this.db = knex({
			...DB_CONFIG,
			postProcessResponse: (result, queryContext) => {
				if (Array.isArray(result)) {
					return result;
				} else {
					return parseJSONColumns(result);
				}
			},
		});
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
			.select({
				placeId: 'PlaceId',
				category: 'Category',
				contributingResources: 'ContributingResources',
				designations: 'Designations',
				namesJSON: 'NameJSON',
				records: 'Records',
				showInRegister: 'ShowInRegister',
			})
			.where({ 'PlaceEdit.Id': id })
			.first();
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
}
