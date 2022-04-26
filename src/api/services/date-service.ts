import knex, { Knex } from 'knex';

import { Date } from '../models/date';

export class DateService {
	private db: Knex;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
	}

	async getFor(placeId: number) {
		return this.db('Dates')
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

	async upsertFor(placeId: number, dates: Date[]) {
		return new Promise((resolve) => {
			resolve(
				dates.map((date) => ({
					placeId,
					type: date.type,
					fromDate: date.fromDate,
					toDate: date.toDate,
					details: date.details?.trim(),
				}))
			);
		}).then((cleanDates) => {
			return this.db.transaction(async (trx) => {
				await trx('Dates').where({ placeId }).delete();

				if (Array.isArray(cleanDates) && cleanDates.length === 0) {
					return [];
				}

				return trx.insert(cleanDates).into('Dates');
			});
		});
	}
}
