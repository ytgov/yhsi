import db from '@/db/db-client';

import { PreviousOwnership } from '../models';

export class PreviousOwnershipService {
	async getFor(placeId: number) {
		return db('PreviousOwnership')
			.where({ placeId })
			.select<
				PreviousOwnership[]
			>(['id', 'placeId', 'ownershipNumber', 'ownershipName', 'ownershipDate']);
	}

	async upsertFor(placeId: number, previousOwnerships: PreviousOwnership[]) {
		return new Promise((resolve) => {
			resolve(
				previousOwnerships.map((previousOwnership) => ({
					placeId,
					ownershipNumber: previousOwnership.ownershipNumber?.trim(),
					ownershipName: previousOwnership.ownershipName?.trim(),
					ownershipDate: previousOwnership.ownershipDate?.trim(),
				}))
			);
		}).then((cleanPreviousOwnerships) => {
			return db.transaction(async (trx) => {
				await trx('PreviousOwnership').where({ placeId }).delete();

				if (Array.isArray(cleanPreviousOwnerships) && cleanPreviousOwnerships.length === 0) {
					return [];
				}

				return trx.insert(cleanPreviousOwnerships).into('PreviousOwnership');
			});
		});
	}
}
