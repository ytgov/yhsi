// -- BEGIN TABLE dbo.PhotoOwner
// IF OBJECT_ID('dbo.PhotoOwner', 'U') IS NOT NULL
// DROP TABLE dbo.PhotoOwner;
// GO

// CREATE TABLE dbo.PhotoOwner (
// 	Id int NOT NULL IDENTITY(1,1),
// 	Name nvarchar(256) NULL,
// 	Email nvarchar(256) NULL,
// 	Address nvarchar(256) NULL,
// 	Telephone nvarchar(256) NULL,
// 	ContactPerson nvarchar(256) NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.PhotoOwner', (table) => {
		table.increments('Id').primary();
		table.string('Name', 256).nullable();
		table.string('Email', 256).nullable();
		table.string('Address', 256).nullable();
		table.string('Telephone', 256).nullable();
		table.string('ContactPerson', 256).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.PhotoOwner');
};
