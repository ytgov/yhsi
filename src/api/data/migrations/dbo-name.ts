// -- BEGIN TABLE dbo.Name
// IF OBJECT_ID('dbo.Name', 'U') IS NOT NULL
// DROP TABLE dbo.Name;
// GO

// CREATE TABLE dbo.Name (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	Description nvarchar(256) NULL
// );
// GO

// ALTER TABLE dbo.Name ADD CONSTRAINT PK_Name PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Name', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.string('Description', 256).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Name');
};
