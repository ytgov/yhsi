// -- BEGIN TABLE dbo.Theme
// IF OBJECT_ID('dbo.Theme', 'U') IS NOT NULL
// DROP TABLE dbo.Theme;
// GO

// CREATE TABLE dbo.Theme (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	PlaceThemeId int NOT NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Theme', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.integer('PlaceThemeId').notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Theme');
};
