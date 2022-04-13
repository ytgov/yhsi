import knex, { Knex } from 'knex';

import { FunctionalUse } from '../models';

export class FunctionalUseService {
	private db: Knex;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
	}

	async getFor(placeId: number) {
		return this.db('FunctionalUse')
			.where({ placeId })
			.select<FunctionalUse[]>([
				'id',
				'placeId',
				'functionalTypeId',
				'functionalUseType',
				'description',
			]);
	}

	async upsertFor(placeId: number, functionalUses: FunctionalUse[]) {
		return new Promise((resolve) => {
			resolve(
				functionalUses.map((functionalUse) => ({
					placeId,
					functionalTypeId: functionalUse.functionalTypeId,
					functionalUseType: functionalUse.functionalUseType,
					description: functionalUse.description?.trim(),
				}))
			);
		}).then((cleanFunctionalUses) => {
			return this.db.transaction(async (trx) => {
				await trx('FunctionalUse').where({ placeId }).delete();

				if (
					Array.isArray(cleanFunctionalUses) &&
					cleanFunctionalUses.length === 0
				) {
					return [];
				}

				return trx.insert(cleanFunctionalUses).into('FunctionalUse');
			});
		});
	}
}
