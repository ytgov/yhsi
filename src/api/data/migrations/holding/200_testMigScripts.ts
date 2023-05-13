import { Knex } from 'knex';

exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable(
		'migrationTests',
		function (t: Knex.CreateTableBuilder) {
			t.integer('id').primary();
			t.string('name', 100).notNullable().unique();
		}
	);
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('migrationTests');
	return knex.raw('DROP SCHEMA [mirgationTests]');
};
