// -- BEGIN TABLE dbo.PhotoSubject
// IF OBJECT_ID('dbo.PhotoSubject', 'U') IS NOT NULL
// DROP TABLE dbo.PhotoSubject;
// GO

// CREATE TABLE dbo.PhotoSubject (
// 	Id int NOT NULL IDENTITY(1,1),
// 	Name nvarchar(256) NOT NULL
// );
// GO

// ALTER TABLE dbo.PhotoSubject ADD CONSTRAINT PK_PhotoSubject PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.PhotoSubject', (table) => {
		table.increments('Id').primary();
		table.string('Name', 256).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.PhotoSubject');
};
