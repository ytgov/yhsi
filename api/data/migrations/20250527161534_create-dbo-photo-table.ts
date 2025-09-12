import { type Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	const tableExists = await knex.schema.hasTable('dbo.Photo');

	if (!tableExists) {
		// Best guess based on existing code as I don't have a copy of the database
		await knex.schema.withSchema('dbo').createTable('Photo', (table) => {
			table.increments('RowId').primary();
			table.integer('CommunityId').nullable();
			table.integer('PlaceId').nullable();
			table.binary('File').nullable();
			table.binary('ThumbFile').nullable();
			table.string('FeatureName').nullable();
			table.string('OriginalFileName').nullable();
			table.string('Address').nullable();
			table.string('Caption').nullable();

			table.foreign('CommunityId').references('Community.Id');
			table.foreign('PlaceId').references('Place.Id');
		});
	}
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.withSchema('dbo').dropTableIfExists('Photo');
}
