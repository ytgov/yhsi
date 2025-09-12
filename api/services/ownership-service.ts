import knex, { Knex } from 'knex';

import { Ownership } from '../models';

export class OwnershipService {
	private db: Knex;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
	}

	async getFor(placeId: number) {
		return this.db('Ownership')
			.where({ placeId })
			.select<Ownership[]>(['id', 'placeId', 'ownershipType', 'comments']);
	}

	async upsertFor(placeId: number, ownerships: Ownership[]) {
		return new Promise((resolve) => {
			resolve(
				ownerships.map((ownership) => ({
					placeId,
					ownershipType: ownership.ownershipType,
					comments: ownership.comments?.trim(),
				}))
			);
		}).then((cleanOwnerships) => {
			return this.db.transaction(async (trx) => {
				await trx('Ownership').where({ placeId }).delete();

				if (Array.isArray(cleanOwnerships) && cleanOwnerships.length === 0) {
					return [];
				}

				return trx.insert(cleanOwnerships).into('Ownership');
			});
		});
	}
}
