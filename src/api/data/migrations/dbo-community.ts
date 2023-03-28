// -- BEGIN TABLE dbo.Community
// IF OBJECT_ID('dbo.Community', 'U') IS NOT NULL
// DROP TABLE dbo.Community;
// GO

// CREATE TABLE dbo.Community (
// 	Id int NOT NULL IDENTITY(1,1),
// 	Name nvarchar(256) NOT NULL
// );
// GO

// ALTER TABLE dbo.Community ADD CONSTRAINT PK_Comunity PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Community', (table) => {
		table.increments('Id').primary();
		table.string('Name', 256).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	knex.schema.dropTable('dbo.Community');
};
