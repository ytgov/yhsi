// -- BEGIN TABLE dbo.OriginalMedia
// IF OBJECT_ID('dbo.OriginalMedia', 'U') IS NOT NULL
// DROP TABLE dbo.OriginalMedia;
// GO

// CREATE TABLE dbo.OriginalMedia (
// 	Id int NOT NULL IDENTITY(1,1),
// 	[Type] nvarchar(256) NOT NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.OriginalMedia', (table) => {
		table.increments('Id').primary();
		table.string('Type', 256).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.OriginalMedia');
};
