// -- BEGIN TABLE dbo.SavedFilter
// IF OBJECT_ID('dbo.SavedFilter', 'U') IS NOT NULL
// DROP TABLE dbo.SavedFilter;
// GO

// CREATE TABLE dbo.SavedFilter (
// 	Id int NOT NULL IDENTITY(1,1),
// 	UserId int NOT NULL,
// 	Name nvarchar(100) NOT NULL,
// 	ResultType nvarchar(50) NOT NULL,
// 	[Value] nvarchar(2000) NULL
// );
// GO

// ALTER TABLE dbo.SavedFilter ADD CONSTRAINT PK_SavedFilter PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.SavedFilter', (table) => {
		table.increments('Id').primary();
		table.integer('UserId').notNullable();
		table.string('Name', 100).notNullable();
		table.string('ResultType', 50).notNullable();
		table.string('Value', 2000).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.SavedFilter');
};
