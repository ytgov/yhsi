// -- BEGIN TABLE dbo.WebLink
// IF OBJECT_ID('dbo.WebLink', 'U') IS NOT NULL
// DROP TABLE dbo.WebLink;
// GO

// CREATE TABLE dbo.WebLink (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	[Type] int NOT NULL,
// 	Address nvarchar(256) NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.WebLink', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.integer('Type').notNullable();
		table.string('Address', 256).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.WebLink');
};
