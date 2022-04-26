import knex, { Knex } from 'knex';

import { FirstNationAssociation } from '../models';

export class FirstNationAssociationService {
	private db: Knex;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
	}

	async getFor(placeId: number) {
		return this.db('FirstNationAssociation')
			.where({ placeId })
			.select<FirstNationAssociation[]>([
				'id',
				'placeId',
				'firstNationId',
				'firstNationAssociationType',
				'comments',
			]);
	}

	async upsertFor(placeId: number, associations: FirstNationAssociation[]) {
		return new Promise((resolve) => {
			resolve(
				associations.map((association) => ({
					placeId,
					firstNationId: association.firstNationId,
					firstNationAssociationType: association.firstNationAssociationType,
					comments: association.comments?.trim(),
				}))
			);
		}).then((cleanFirstNationAssociations) => {
			return this.db.transaction(async (trx) => {
				await trx('FirstNationAssociation').where({ placeId }).delete();

				if (
					Array.isArray(cleanFirstNationAssociations) &&
					cleanFirstNationAssociations.length === 0
				) {
					return [];
				}

				return trx
					.insert(cleanFirstNationAssociations)
					.into('FirstNationAssociation');
			});
		});
	}
}
