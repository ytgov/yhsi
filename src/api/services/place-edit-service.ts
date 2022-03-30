import knex, { Knex } from 'knex';

import { DB_CONFIG } from '../config';

interface CountQuery {
	count: number;
}

export class PlaceEditService {
	private db: Knex;
	private _defaultScope: Knex.QueryBuilder;

	constructor() {
		this.db = knex(DB_CONFIG);
		this._defaultScope = this.db
			.select({
				id: 'PlaceEdit.Id',
				yhsiId: 'YHSIId',
				primaryName: 'PrimaryName',
				editorId: 'EditorUserId',
				editorEmail: 'Security.User.Email',
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
