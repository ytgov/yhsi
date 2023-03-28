// -- BEGIN TABLE dbo.PreviousOwnership
// IF OBJECT_ID('dbo.PreviousOwnership', 'U') IS NOT NULL
// DROP TABLE dbo.PreviousOwnership;
// GO

// CREATE TABLE dbo.PreviousOwnership (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	OwnershipNumber nvarchar(256) NULL,
// 	OwnershipName nvarchar(256) NULL,
// 	OwnershipDate nvarchar(200) NULL
// );
// GO

// ALTER TABLE dbo.PreviousOwnership ADD CONSTRAINT PK_PreviousOwnership PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.PreviousOwnership', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.string('OwnershipNumber', 256).nullable();
		table.string('OwnershipName', 256).nullable();
		table.string('OwnershipDate', 200).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.PreviousOwnership');
};
