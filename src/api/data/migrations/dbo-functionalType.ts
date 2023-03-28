// -- BEGIN TABLE dbo.FunctionalType
// IF OBJECT_ID('dbo.FunctionalType', 'U') IS NOT NULL
// DROP TABLE dbo.FunctionalType;
// GO

// CREATE TABLE dbo.FunctionalType (
// 	Id int NOT NULL IDENTITY(1,1),
// 	Description nvarchar(256) NULL
// );
// GO

// ALTER TABLE dbo.FunctionalType ADD CONSTRAINT PK_FunctionalType PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.FunctionalType', (table) => {
		table.increments('Id').primary();
		table.string('Description', 256).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.FunctionalType');
};
