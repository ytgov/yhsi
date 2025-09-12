// -- BEGIN TABLE YHIS.MapSheetLookup
// IF OBJECT_ID('YHIS.MapSheetLookup', 'U') IS NOT NULL
// DROP TABLE YHIS.MapSheetLookup;
// GO

// CREATE TABLE YHIS.MapSheetLookup (
// 	Id int NOT NULL,
// 	Map50k nvarchar(8) NOT NULL,
// 	Map250k nvarchar(8) NOT NULL
// );
// GO

// ALTER TABLE YHIS.MapSheetLookup ADD CONSTRAINT PK__MapSheet__3214EC0768988A65 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';

exports.up = async function (knex: Knex) {
	await knex.raw(
		/* sql */ "IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'YHIS') BEGIN EXEC('CREATE SCHEMA [YHIS]') END"
	);

	await knex.schema.createTable('YHIS.MapSheetLookup', (table) => {
		table.integer('Id').notNullable();
		table.string('Map50k', 8).notNullable();
		table.string('Map250k', 8).notNullable();
	});
};

exports.down = async function (knex: Knex) {
	await knex.schema.dropTable('YHIS.MapSheetLookup');
};
