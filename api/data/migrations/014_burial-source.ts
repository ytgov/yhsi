// -- BEGIN TABLE Burial.Source
// IF OBJECT_ID('Burial.Source', 'U') IS NOT NULL
// DROP TABLE Burial.Source;
// GO

// CREATE TABLE Burial.Source (
// 	SourceID smallint NOT NULL IDENTITY(1,1),
// 	BurialID smallint NOT NULL,
// 	Source varchar(200) NOT NULL
// );
// GO

// ALTER TABLE Burial.Source ADD CONSTRAINT PK__Source__16E019F95120B963 PRIMARY KEY (SourceID);
// GO
import { Knex } from 'knex';
exports.up = async function (knex: Knex) {
	await knex.raw(
		/* sql */ "IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Burial') BEGIN EXEC('CREATE SCHEMA [Burial]') END"
	);

	await knex.schema.createTable('Burial.Source', (table) => {
		table.increments('SourceID').primary();
		table.integer('BurialID').notNullable();
		table.string('Source', 200).notNullable();
	});
};

exports.down = async function (knex: Knex) {
	await knex.schema.dropTable('Burial.Source');
};
