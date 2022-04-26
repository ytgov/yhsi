import knex, { Knex } from 'knex';

import { DB_CONFIG } from '../config';
import { Name } from '../models/name';

export class NameService {
	private db: Knex;

	constructor() {
		this.db = knex(DB_CONFIG);
	}

	async getFor(placeId: number) {
		return this.db('name')
			.where({ placeId })
			.select<Name[]>(['id', 'placeId', 'description']);
	}

	async upsertFor(placeId: number, names: Name[]) {
		return new Promise((resolve) => {
			resolve(
				names.map((name) => ({
					placeId,
					description: name.description.trim(),
				}))
			);
		}).then((cleanNames) => {
			return this.db.transaction(async (trx) => {
				await trx('Name').where({ placeId }).delete();

				if (Array.isArray(cleanNames) && cleanNames.length === 0) {
					return [];
				}

				return trx.insert(cleanNames).into('Name');
			});
		});
	}
}
