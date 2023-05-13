import { DB_CONFIG } from './config';
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

export const development = {
	...DB_CONFIG,
	migrations: {
		// tableName: 'knex_migrations',
		directory: './data/migrations',
	},
};

export const production = {
	...DB_CONFIG,
	migrations: {
		// tableName: 'knex_migrations',
		directory: './data/migrations',
	},
};
