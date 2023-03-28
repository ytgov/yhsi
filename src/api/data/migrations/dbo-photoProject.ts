// -- BEGIN TABLE dbo.PhotoProject
// IF OBJECT_ID('dbo.PhotoProject', 'U') IS NOT NULL
// DROP TABLE dbo.PhotoProject;
// GO

// CREATE TABLE dbo.PhotoProject (
// 	Id int NOT NULL IDENTITY(1,1),
// 	Name nvarchar(256) NULL,
// 	Permit nvarchar(256) NULL,
// 	[Year] nvarchar(256) NULL,
// 	[Section] int NOT NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.PhotoProject', (table) => {
		table.increments('Id').primary();
		table.string('Name', 256).nullable();
		table.string('Permit', 256).nullable();
		table.string('Year', 256).nullable();
		table.integer('Section').notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.PhotoProject');
};
