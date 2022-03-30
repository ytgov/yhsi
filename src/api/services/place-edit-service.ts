import knex, { Knex } from 'knex';

import { DB_CONFIG } from '../config';

interface CountQuery {
	count: number;
}

export class PlaceEditService {
	private db: Knex;
	private defaultScope: Knex.QueryInterface;

	constructor() {
		this.db = knex(DB_CONFIG);
		this.defaultScope = this.db
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

	count(scope: Knex.QueryInterface): Promise<number> {
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
			.then((results) => {
				return {
					results,
					totalCount,
				};
			});
	}
}
