import db from '@/db/db-client';

import { HistoricalPattern } from '../models/historical-pattern';
import { HISTORICAL_PATTERN_TYPES } from '../models';

export class HistoricalPatternService {
	async getFor(placeId: number): Promise<HistoricalPattern[]> {
		const list = await db('historicalpattern')
			.where({ placeId })
			.select<HistoricalPattern[]>(['id', 'placeId', 'comments', 'historicalPatternType']);

		list.map((item) => {
			item.historicalPatternTypeName =
				Object.values(HISTORICAL_PATTERN_TYPES).find((i) => i.value == item.historicalPatternType)
					?.text ?? '';
		});
		return list;
	}

	async upsertFor(placeId: number, historicalPatterns: HistoricalPattern[]) {
		return new Promise((resolve) => {
			resolve(
				historicalPatterns.map((historicalPattern) => ({
					placeId,
					historicalPatternType: historicalPattern.historicalPatternType,
					comments: historicalPattern.comments?.trim(),
				}))
			);
		}).then((cleanHistoricalPatterns) => {
			return db.transaction(async (trx) => {
				await trx('HistoricalPattern').where({ placeId }).delete();

				if (Array.isArray(cleanHistoricalPatterns) && cleanHistoricalPatterns.length === 0) {
					return [];
				}

				return trx.insert(cleanHistoricalPatterns).into('HistoricalPattern');
			});
		});
	}
}
