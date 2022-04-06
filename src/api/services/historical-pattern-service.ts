import knex, { Knex } from 'knex';

import { DB_CONFIG } from '../config';
import { HistoricalPattern } from '../models/historical-pattern';

export class HistoricalPatternService {
	private db: Knex;

	constructor() {
		this.db = knex(DB_CONFIG);
	}

	async upsertFor(placeId: number, historicalPatterns: HistoricalPattern[]) {
		return new Promise((resolve) => {
			resolve(
				historicalPatterns.map((historicalPattern) => ({
					placeId,
					historicalPatternType: historicalPattern.historicalPatternType,
					comments: historicalPattern.comments.trim(),
				}))
			);
		}).then((cleanHistoricalPatterns) => {
			return this.db.transaction(async (trx) => {
				await trx('HistoricalPattern').where({ placeId }).delete();

				if (
					Array.isArray(cleanHistoricalPatterns) &&
					cleanHistoricalPatterns.length === 0
				) {
					return [];
				}

				return trx.insert(cleanHistoricalPatterns).into('HistoricalPattern');
			});
		});
	}
}
