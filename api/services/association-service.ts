import knex, { Knex } from 'knex';

import { Association } from '../models';

export class AssociationService {
	private db: Knex;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
	}

	async getFor(placeId: number) {
		return this.db('Association')
			.where({ placeId })
			.select<Association[]>(['id', 'placeId', 'type', 'description']);
	}

	async upsertFor(placeId: number, associations: Association[]) {
		return new Promise((resolve) => {
			resolve(
				associations.map((association) => ({
					placeId,
					type: association.type,
					description: association.description?.trim(),
				}))
			);
		}).then((cleanAssociations) => {
			return this.db.transaction(async (trx) => {
				await trx('Association').where({ placeId }).delete();

				if (
					Array.isArray(cleanAssociations) &&
					cleanAssociations.length === 0
				) {
					return [];
				}

				return trx.insert(cleanAssociations).into('Association');
			});
		});
	}
}
