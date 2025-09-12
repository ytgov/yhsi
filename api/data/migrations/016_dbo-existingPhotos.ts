// -- BEGIN TABLE dbo.Existing_Photos
// IF OBJECT_ID('dbo.Existing_Photos', 'U') IS NOT NULL
// DROP TABLE dbo.Existing_Photos;
// GO

// CREATE TABLE dbo.Existing_Photos (
// 	RowId uniqueidentifier NOT NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Existing_Photos', (table) => {
		table.uuid('RowId').notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Existing_Photos');
};
