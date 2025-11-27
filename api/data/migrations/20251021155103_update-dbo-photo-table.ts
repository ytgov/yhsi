import { type Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	// Best guess based on existing code as I don't have a copy of the database
	await knex.schema.withSchema('dbo').alterTable('Photo', (table) => {
		table.integer('Id').nullable();
		table.string('NTSMapNumber', 20).nullable();
		table.dateTime('DateCreated').nullable();
		table.string('YHSIRecord', 20).nullable();
		table.string('BordenRecord', 20).nullable();
		table.string('PaleoRecord', 20).nullable();
		table.string('ArchivalRecord', 20).nullable();
		table.boolean('IsOtherRecord').notNullable();
		table.integer('OriginalMediaId').nullable();
		table.string('OriginalRecord', 256).nullable();
		table.integer('MediaStorage').notNullable();
		table.text('Comments').nullable();
		table.integer('Copyright').notNullable();
		table.string('CreditLine', 256).nullable();
		table.integer('OwnerId').notNullable();
		table.integer('PhotoProjectId').notNullable();
		table.integer('Program').notNullable();
		table.string('Creator', 256).nullable();
		table.string('CommunityName', 256).nullable();
		table.string('Location', 256).nullable();
		table.integer('UsageRights').nullable();
		table.boolean('IsComplete').notNullable();
		table.integer('ImageHeight').nullable();
		table.integer('ImageWidth').nullable();
		table.integer('Rating').nullable();
		table.string('Subjects', 500).nullable();
		table.string('LegacyBatchInfo', 150).nullable();
		table.boolean('IsSiteDefault').notNullable();
		table.dateTime('DatePhotoTaken').nullable();
		table.boolean('IsPrivate').notNullable();
		table.string('Summary', 500).nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.withSchema('dbo').alterTable('Photo', (table) => {
		table.dropColumn('Summary');
		table.dropColumn('IsPrivate');
		table.dropColumn('DatePhotoTaken');
		table.dropColumn('IsSiteDefault');
		table.dropColumn('LegacyBatchInfo');
		table.dropColumn('Subjects');
		table.dropColumn('Rating');
		table.dropColumn('ImageWidth');
		table.dropColumn('ImageHeight');
		table.dropColumn('IsComplete');
		table.dropColumn('UsageRights');
		table.dropColumn('Location');
		table.dropColumn('CommunityName');
		table.dropColumn('Creator');
		table.dropColumn('Program');
		table.dropColumn('PhotoProjectId');
		table.dropColumn('OwnerId');
		table.dropColumn('CreditLine');
		table.dropColumn('Copyright');
		table.dropColumn('Comments');
		table.dropColumn('MediaStorage');
		table.dropColumn('OriginalRecord');
		table.dropColumn('OriginalMediaId');
		table.dropColumn('IsOtherRecord');
		table.dropColumn('ArchivalRecord');
		table.dropColumn('PaleoRecord');
		table.dropColumn('BordenRecord');
		table.dropColumn('YHSIRecord');
		table.dropColumn('DateCreated');
		table.dropColumn('NTSMapNumber');
		table.dropColumn('Id');
	});
}
