// -- BEGIN TABLE dbo.Contact
// IF OBJECT_ID('dbo.Contact', 'U') IS NOT NULL
// DROP TABLE dbo.Contact;
// GO

// CREATE TABLE dbo.Contact (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NOT NULL,
// 	FirstName nvarchar(256) NULL,
// 	LastName nvarchar(256) NULL,
// 	PhoneNumber nvarchar(256) NULL,
// 	Email nvarchar(256) NULL,
// 	MailingAddress nvarchar(256) NULL,
// 	Description nvarchar(256) NULL,
// 	ContactType int NOT NULL
// );
// GO

// ALTER TABLE dbo.Contact ADD CONSTRAINT PK_Contact PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Contact', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').notNullable();
		table.string('FirstName', 256).nullable();
		table.string('LastName', 256).nullable();
		table.string('PhoneNumber', 256).nullable();
		table.string('Email', 256).nullable();
		table.string('MailingAddress', 256).nullable();
		table.string('Description', 256).nullable();
		table.integer('ContactType').notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Contact');
};
