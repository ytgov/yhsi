// -- BEGIN TABLE dbo.ConstructionPeriod
// IF OBJECT_ID('dbo.ConstructionPeriod', 'U') IS NOT NULL
// DROP TABLE dbo.ConstructionPeriod;
// GO

// CREATE TABLE dbo.ConstructionPeriod (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	[Type] int NOT NULL
// );
// GO

// ALTER TABLE dbo.ConstructionPeriod ADD CONSTRAINT PK_ConstructionPeriod PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.ConstructionPeriod', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.integer('Type').notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.ConstructionPeriod');
};
