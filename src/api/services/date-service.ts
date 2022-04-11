import knex, { Knex } from 'knex';

import { Date } from '../models/date';

export class DateService {
	private db: Knex;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
	}

	async getFor(placeId: number) {
		return this.db('dates')
			.where({ placeId })
			.select<Date[]>([
				'id',
				'placeId',
				'type',
				'fromDate',
				'toDate',
				'details',
			]);
	}
}
