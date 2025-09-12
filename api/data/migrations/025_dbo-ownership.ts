// -- BEGIN TABLE dbo.Ownership
// IF OBJECT_ID('dbo.Ownership', 'U') IS NOT NULL
// DROP TABLE dbo.Ownership;
// GO

// CREATE TABLE dbo.Ownership (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	OwnershipType int NOT NULL,
// 	Comments nvarchar(256) NULL
// );
// GO

// ALTER TABLE dbo.Ownership ADD CONSTRAINT PK_Ownership PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Ownership', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.integer('OwnershipType').notNullable();
		table.string('Comments', 256).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Ownership');
};
