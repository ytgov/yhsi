// - BEGIN TABLE dbo.HistoricalPattern
// IF OBJECT_ID('dbo.HistoricalPattern', 'U') IS NOT NULL
// DROP TABLE dbo.HistoricalPattern;
// GO

// CREATE TABLE dbo.HistoricalPattern (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	Comments nvarchar(max) NULL,
// 	HistoricalPatternType int NOT NULL
// );
// GO

// ALTER TABLE dbo.HistoricalPattern ADD CONSTRAINT PK_HistoricalPattern PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.HistoricalPattern', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.text('Comments').nullable();
		table.integer('HistoricalPatternType').notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.HistoricalPattern');
};
