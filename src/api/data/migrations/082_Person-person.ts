// -- BEGIN TABLE Person.Person
// IF OBJECT_ID('Person.Person', 'U') IS NOT NULL
// DROP TABLE Person.Person;
// GO

// CREATE TABLE Person.Person (
// 	PersonID int NOT NULL IDENTITY(1,1),
// 	Surname varchar(256) NULL,
// 	GivenName varchar(256) NULL,
// 	BirthYear int NULL,
// 	BirthAccuracy varchar(8) NULL,
// 	DeathYear int NULL,
// 	DeathAccuracy varchar(8) NULL,
// 	Notes text NULL DEFAULT (NULL)
// );
// GO

// ALTER TABLE Person.Person ADD CONSTRAINT PK__PersonTe__AA2FFB85B6E5CB31 PRIMARY KEY (PersonID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Person.Person', (table) => {
		table.increments('PersonID').primary();
		table.string('Surname', 256).nullable();
		table.string('GivenName', 256).nullable();
		table.integer('BirthYear').nullable();
		table.string('BirthAccuracy', 8).nullable();
		table.integer('DeathYear').nullable();
		table.string('DeathAccuracy', 8).nullable();
		table.text('Notes').nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Person.Person');
};
