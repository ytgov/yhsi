import knex, { Knex } from 'knex';

import { Description } from '../models';

export class DescriptionService {
	private db: Knex;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
	}

	async getForPlace(placeId: number) {
		return this.db('Description')
			.where({ placeId })
			.select<Description[]>(['id', 'placeId', 'type', 'descriptionText']);
	}

	async upsertForPlace(placeId: number, descriptions: Description[]) {
		return new Promise((resolve) => {
			resolve(
				descriptions.map((description) => ({
					placeId,
					type: description.type,
					descriptionText: description.descriptionText?.trim(),
				}))
			);
		}).then((cleanDescriptions) => {
			return this.db.transaction(async (trx) => {
				await trx('Description').where({ placeId }).delete();

				if (
					Array.isArray(cleanDescriptions) &&
					cleanDescriptions.length === 0
				) {
					return [];
				}

				return trx.insert(cleanDescriptions).into('Description');
			});
		});
	}
}
