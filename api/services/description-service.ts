import db from '@/db/db-client';

import { Description } from '../models';

export class DescriptionService {
	async getForPlace(placeId: number) {
		return db('Description')
			.where({ placeId })
			.select<Description[]>(['id', 'placeId', 'type', 'descriptionText', 'fR_DescriptionText']);
	}

	async upsertForPlace(placeId: number, descriptions: Description[]) {
		return new Promise((resolve) => {
			resolve(
				descriptions.map((description) => ({
					placeId,
					type: description.type,
					descriptionText: description.descriptionText?.trim(),
					fR_DescriptionText: description.fR_DescriptionText?.trim(),
				}))
			);
		}).then((cleanDescriptions) => {
			return db.transaction(async (trx) => {
				await trx('Description').where({ placeId }).delete();

				if (Array.isArray(cleanDescriptions) && cleanDescriptions.length === 0) {
					return [];
				}

				return trx.insert(cleanDescriptions).into('Description');
			});
		});
	}
}
