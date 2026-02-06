import db from '@/db/db-client';

import { Name } from '../models/name';

export class NameService {
	async getFor(placeId: number) {
		return db('name').where({ placeId }).select<Name[]>(['id', 'placeId', 'description']);
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
			return db.transaction(async (trx) => {
				await trx('Name').where({ placeId }).delete();

				if (Array.isArray(cleanNames) && cleanNames.length === 0) {
					return [];
				}

				return trx.insert(cleanNames).into('Name');
			});
		});
	}
}
