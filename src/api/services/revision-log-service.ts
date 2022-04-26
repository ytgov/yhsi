import knex, { Knex } from 'knex';

import { RevisionLog } from '../models';

export class RevisionLogService {
	private db: Knex;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
	}

	async getFor(placeId: number) {
		return this.db('RevisionLog')
			.where({ placeId })
			.select<RevisionLog[]>([
				'id',
				'placeId',
				'revisionLogType',
				'revisionDate',
				'revisedBy',
				'details',
			])
			.orderBy('revisionDate');
	}

	async upsertFor(placeId: number, revisionLogs: RevisionLog[]) {
		return new Promise((resolve) => {
			resolve(
				revisionLogs.map((revisionLog) => ({
					placeId,
					revisionLogType: revisionLog.revisionLogType,
					revisionDate: revisionLog.revisionDate?.trim(),
					revisedBy: revisionLog.revisedBy?.trim(),
					details: revisionLog.details?.trim(),
				}))
			);
		}).then((cleanRevisionLogs) => {
			return this.db.transaction(async (trx) => {
				await trx('RevisionLog').where({ placeId }).delete();

				if (
					Array.isArray(cleanRevisionLogs) &&
					cleanRevisionLogs.length === 0
				) {
					return [];
				}

				return trx.insert(cleanRevisionLogs).into('RevisionLog');
			});
		});
	}
}
