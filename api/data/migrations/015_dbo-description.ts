// -- BEGIN TABLE dbo.Description
// IF OBJECT_ID('dbo.Description', 'U') IS NOT NULL
// DROP TABLE dbo.Description;
// GO

// CREATE TABLE dbo.Description (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	DescriptionText nvarchar(max) NULL,
// 	[Type] int NOT NULL
// );
// GO

// ALTER TABLE dbo.Description ADD CONSTRAINT PK_Description PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Description', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.text('DescriptionText').nullable();
		table.integer('Type').notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Description');
};
