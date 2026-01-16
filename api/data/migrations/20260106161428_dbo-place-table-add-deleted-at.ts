import { type Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.withSchema('dbo').alterTable('Place', (table) => {
		table.dateTime('deleted_at').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.withSchema('dbo').alterTable('Place', (table) => {
		table.dropColumn('deleted_at');
	});
}
