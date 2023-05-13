// -- BEGIN TABLE dbo.HSUser
// IF OBJECT_ID('dbo.HSUser', 'U') IS NOT NULL
// DROP TABLE dbo.HSUser;
// GO

// CREATE TABLE dbo.HSUser (
// 	Id int NOT NULL IDENTITY(1,1),
// 	UserId int NOT NULL,
// 	ExpirationDate datetime NULL
// );
// GO

// ALTER TABLE dbo.HSUser ADD CONSTRAINT PK_HSUser PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.HSUser', (table) => {
		table.increments('Id').primary();
		table.integer('UserId').notNullable();
		table.dateTime('ExpirationDate').nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.HSUser');
};
