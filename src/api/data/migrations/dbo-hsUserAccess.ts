// -- BEGIN TABLE dbo.HSUserAccess
// IF OBJECT_ID('dbo.HSUserAccess', 'U') IS NOT NULL
// DROP TABLE dbo.HSUserAccess;
// GO

// CREATE TABLE dbo.HSUserAccess (
// 	Id int NOT NULL IDENTITY(1,1),
// 	UserId int NOT NULL,
// 	AccessType int NOT NULL,
// 	AccessText nvarchar(150) NOT NULL
// );
// GO

// ALTER TABLE dbo.HSUserAccess ADD CONSTRAINT PK_UserAccess PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.HSUserAccess', (table) => {
		table.increments('Id').primary();
		table.integer('UserId').notNullable();
		table.integer('AccessType').notNullable();
		table.string('AccessText', 150).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.HSUserAccess');
};
