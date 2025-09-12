// -- BEGIN TABLE dbo.RevisionLog
// IF OBJECT_ID('dbo.RevisionLog', 'U') IS NOT NULL
// DROP TABLE dbo.RevisionLog;
// GO

// CREATE TABLE dbo.RevisionLog (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	RevisionLogType int NOT NULL,
// 	RevisionDate nvarchar(50) NULL,
// 	RevisedBy nvarchar(256) NULL,
// 	Details nvarchar(256) NULL
// );
// GO

// ALTER TABLE dbo.RevisionLog ADD CONSTRAINT PK_RevisionLog PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.RevisionLog', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.integer('RevisionLogType').notNullable();
		table.string('RevisionDate', 50).nullable();
		table.string('RevisedBy', 256).nullable();
		table.string('Details', 256).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.RevisionLog');
};
