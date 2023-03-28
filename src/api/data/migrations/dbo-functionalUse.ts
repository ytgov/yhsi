// -- BEGIN TABLE dbo.FunctionalUse
// IF OBJECT_ID('dbo.FunctionalUse', 'U') IS NOT NULL
// DROP TABLE dbo.FunctionalUse;
// GO

// CREATE TABLE dbo.FunctionalUse (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	FunctionalTypeId int NOT NULL,
// 	FunctionalUseType int NOT NULL,
// 	Description nvarchar(256) NULL
// );
// GO

// ALTER TABLE dbo.FunctionalUse ADD CONSTRAINT PK_FunctionalUse PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.FunctionalUse', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.integer('FunctionalTypeId').notNullable();
		table.integer('FunctionalUseType').notNullable();
		table.string('Description', 256).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.FunctionalUse');
};
