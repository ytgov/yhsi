import db from '@/db/db-client';

import { ConstructionPeriod } from '../models/construction-period';

export class ConstructionPeriodService {
	async getFor(placeId: number) {
		return db('ConstructionPeriod')
			.where({ placeId })
			.select<ConstructionPeriod[]>(['id', 'placeId', 'type']);
	}

	async upsertFor(placeId: number, constructionPeriods: ConstructionPeriod[]) {
		return new Promise((resolve) => {
			resolve(
				constructionPeriods.map((constructionPeriod) => ({
					placeId,
					type: constructionPeriod.type,
				}))
			);
		}).then((cleanConstructionPeriods) => {
			return db.transaction(async (trx) => {
				await trx('ConstructionPeriod').where({ placeId }).delete();

				if (Array.isArray(cleanConstructionPeriods) && cleanConstructionPeriods.length === 0) {
					return [];
				}

				return trx.insert(cleanConstructionPeriods).into('ConstructionPeriod');
			});
		});
	}
}
