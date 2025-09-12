import { Knex } from 'knex';

export function saveToTable(
	knex: Knex,
	schema: string,
	table: string,
	mappedData: any
) {
	const { bindings, sql } = knex
		.withSchema(schema)
		.insert(mappedData)
		.into(table)
		.toSQL();

	const newQuery = `SET IDENTITY_INSERT ${schema}.${table} ON; ${sql}; SET IDENTITY_INSERT ${schema}.${table} OFF;`;

	return knex.raw(newQuery, bindings);
}
