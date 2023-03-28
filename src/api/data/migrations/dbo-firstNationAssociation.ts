// -- BEGIN TABLE dbo.FirstNationAssociation
// IF OBJECT_ID('dbo.FirstNationAssociation', 'U') IS NOT NULL
// DROP TABLE dbo.FirstNationAssociation;
// GO

// CREATE TABLE dbo.FirstNationAssociation (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	FirstNationId int NOT NULL,
// 	FirstNationAssociationType int NOT NULL,
// 	Comments nvarchar(max) NULL
// );
// GO

// ALTER TABLE dbo.FirstNationAssociation ADD CONSTRAINT PK_FirstNationAssociation PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.FirstNationAssociation', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.integer('FirstNationId').notNullable();
		table.integer('FirstNationAssociationType').notNullable();
		table.text('Comments').nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.FirstNationAssociation');
};
