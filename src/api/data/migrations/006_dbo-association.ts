// -- BEGIN TABLE dbo.Association
// IF OBJECT_ID('dbo.Association', 'U') IS NOT NULL
// DROP TABLE dbo.Association;
// GO

// CREATE TABLE dbo.Association (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	[Type] int NOT NULL,
// 	Description nvarchar(256) NULL
// );
// GO

// ALTER TABLE dbo.Association ADD CONSTRAINT PK_Association PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Association', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.integer('Type').notNullable();
		table.string('Description', 256).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Association');
};
