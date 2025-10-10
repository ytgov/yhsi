import knex, { Knex } from 'knex';

import { Theme } from '../models';

export class ThemeService {
	private db: Knex;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
	}

	async getFor(placeId: number) {
		return this.db('Theme')
			.where({ placeId })
			.select<Theme[]>(['id', 'placeId', 'placeThemeId']);
	}

	async upsertFor(placeId: number, themes: Theme[]) {
		return new Promise((resolve) => {
			resolve(
				themes.map((theme) => ({
					placeId,
					placeThemeId: theme.placeThemeId,
				}))
			);
		}).then((cleanThemes) => {
			return this.db.transaction(async (trx) => {
				await trx('Theme').where({ placeId }).delete();

				if (Array.isArray(cleanThemes) && cleanThemes.length === 0) {
					return [];
				}

				return trx.insert(cleanThemes).into('Theme');
			});
		});
	}
}
