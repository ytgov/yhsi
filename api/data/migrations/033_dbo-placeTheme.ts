// -- BEGIN TABLE dbo.PlaceTheme
// IF OBJECT_ID('dbo.PlaceTheme', 'U') IS NOT NULL
// DROP TABLE dbo.PlaceTheme;
// GO

// CREATE TABLE dbo.PlaceTheme (
// 	Id int NOT NULL IDENTITY(1,1),
// 	Category nvarchar(100) NOT NULL,
// 	[Type] nvarchar(100) NOT NULL
// );
// GO

// ALTER TABLE dbo.PlaceTheme ADD CONSTRAINT PK_PlaceTheme PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.PlaceTheme', (table) => {
		table.increments('Id').primary();
		table.string('Category', 100).notNullable();
		table.string('Type', 100).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.PlaceTheme');
};
