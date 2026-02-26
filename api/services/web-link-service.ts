import db from '@/db/db-client';

import { WebLink } from '../models';

export class WebLinkService {
	async getForPlace(placeId: number) {
		return db('WebLink').where({ placeId }).select<WebLink[]>(['id', 'placeId', 'type', 'address']);
	}

	async upsertForPlace(placeId: number, webLinks: WebLink[]) {
		return new Promise((resolve) => {
			resolve(
				webLinks.map((webLink) => ({
					placeId,
					type: webLink.type,
					address: webLink.address?.trim(),
				}))
			);
		}).then((cleanWebLinks) => {
			return db.transaction(async (trx) => {
				await trx('WebLink').where({ placeId }).delete();

				if (Array.isArray(cleanWebLinks) && cleanWebLinks.length === 0) {
					return [];
				}

				return trx.insert(cleanWebLinks).into('WebLink');
			});
		});
	}
}
