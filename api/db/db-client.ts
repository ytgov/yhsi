import path from 'path';
import knex, { Knex } from 'knex';

import { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT, NODE_ENV } from '@/config';

export function buildKnexConfig(): Knex.Config {
	return {
		client: 'mssql',
		connection: {
			host: DB_HOST,
			user: DB_USER,
			password: DB_PASS,
			database: DB_NAME,
			port: parseInt(DB_PORT),
		},
		migrations: {
			directory: path.resolve(__dirname, './migrations'),
			extension: 'ts',
			stub: path.resolve(__dirname, './templates/sample-migration.ts'),
		},
		seeds: {
			directory: path.resolve(__dirname, `./seeds/${NODE_ENV}`),
			extension: 'ts',
			stub: path.resolve(__dirname, './templates/sample-seed.ts'),
		},
	};
}

const config = buildKnexConfig();
const db = knex(config);

// TODO: double check this is something we want in production.
db.on('query', (query) => {
	if (NODE_ENV === 'production') {
		console.log(`Executing: ${query.sql}`);
	} else if (NODE_ENV === 'test') {
		// don't log anything
	} else {
		console.log(`Executing (default): ${query.sql} ${JSON.stringify(query.bindings)}`);
	}
});

export default db;
