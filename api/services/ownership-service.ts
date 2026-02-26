import db from '@/db/db-client';

import { Ownership } from '../models';

export class OwnershipService {
	async getFor(placeId: number) {
		return db('Ownership')
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
			return db.transaction(async (trx) => {
				await trx('Ownership').where({ placeId }).delete();

				if (Array.isArray(cleanOwnerships) && cleanOwnerships.length === 0) {
					return [];
				}

				return trx.insert(cleanOwnerships).into('Ownership');
			});
		});
	}
}
