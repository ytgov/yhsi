// -- BEGIN TABLE dbo.Dates
// IF OBJECT_ID('dbo.Dates', 'U') IS NOT NULL
// DROP TABLE dbo.Dates;
// GO

// CREATE TABLE dbo.Dates (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	[Type] int NOT NULL,
// 	FromDate nvarchar(256) NULL,
// 	ToDate nvarchar(256) NULL,
// 	Details nvarchar(256) NULL
// );
// GO

// ALTER TABLE dbo.Dates ADD CONSTRAINT PK_Dates PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Dates', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.integer('Type').notNullable();
		table.string('FromDate', 256).nullable();
		table.string('ToDate', 256).nullable();
		table.string('Details', 256).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Dates');
};
