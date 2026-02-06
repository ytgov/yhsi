import db from '@/db/db-client';

import { FunctionalUse } from '../models';

export class FunctionalUseService {
	async getFor(placeId: number) {
		return db('FunctionalUse')
			.where({ placeId })
			.select<
				FunctionalUse[]
			>(['id', 'placeId', 'functionalTypeId', 'functionalUseType', 'description']);
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
			return db.transaction(async (trx) => {
				await trx('FunctionalUse').where({ placeId }).delete();

				if (Array.isArray(cleanFunctionalUses) && cleanFunctionalUses.length === 0) {
					return [];
				}

				return trx.insert(cleanFunctionalUses).into('FunctionalUse');
			});
		});
	}
}
