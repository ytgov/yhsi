import db from '@/db/db-client';

import { FirstNationAssociation } from '../models';

export class FirstNationAssociationService {
	async getFor(placeId: number) {
		return db('FirstNationAssociation')
			.where({ placeId })
			.select<
				FirstNationAssociation[]
			>(['id', 'placeId', 'firstNationId', 'firstNationAssociationType', 'comments']);
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
			return db.transaction(async (trx) => {
				await trx('FirstNationAssociation').where({ placeId }).delete();

				if (
					Array.isArray(cleanFirstNationAssociations) &&
					cleanFirstNationAssociations.length === 0
				) {
					return [];
				}

				return trx.insert(cleanFirstNationAssociations).into('FirstNationAssociation');
			});
		});
	}
}
