// -- BEGIN TABLE Person.History
// IF OBJECT_ID('Person.History', 'U') IS NOT NULL
// DROP TABLE Person.History;
// GO

// CREATE TABLE Person.History (
// 	PersonHistID int NOT NULL IDENTITY(1,1),
// 	PersonID int NULL,
// 	SeqID int NOT NULL,
// 	HistoryText nvarchar(max) NULL,
// 	Reference varchar(1024) NULL,
// 	Restricted int NULL
// );
// GO

// ALTER TABLE Person.History ADD CONSTRAINT PK__HistoryN__BFE776F33EAFABEF PRIMARY KEY (PersonHistID);
// GO

import { Knex } from 'knex';

exports.up = async function (knex: Knex) {
	await knex.raw(
		/* sql */ "IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Person') BEGIN EXEC('CREATE SCHEMA [Person]') END"
	);

	await knex.schema.createTable('Person.History', (table) => {
		table.increments('PersonHistID').primary();
		table.integer('PersonID').nullable();
		table.integer('SeqID').notNullable();
		table.string('HistoryText', 4000).nullable();
		table.string('Reference', 1024).nullable();
		table.integer('Restricted').nullable();
	});
};
exports.down = async function (knex: Knex) {
	await knex.schema.dropTable('Person.History');
};
