import knex, { Knex } from 'knex';

import { WebLink } from '../models';

export class WebLinkService {
	private db: Knex;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
	}

	async getForPlace(placeId: number) {
		return this.db('WebLink')
			.where({ placeId })
			.select<WebLink[]>(['id', 'placeId', 'type', 'address']);
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
			return this.db.transaction(async (trx) => {
				await trx('WebLink').where({ placeId }).delete();

				if (Array.isArray(cleanWebLinks) && cleanWebLinks.length === 0) {
					return [];
				}

				return trx.insert(cleanWebLinks).into('WebLink');
			});
		});
	}
}
