// -- BEGIN TABLE Burial.CauseLookup
// IF OBJECT_ID('Burial.CauseLookup', 'U') IS NOT NULL
// DROP TABLE Burial.CauseLookup;
// GO

// CREATE TABLE Burial.CauseLookup (
// 	CauseLUpID smallint NOT NULL IDENTITY(1,1),
// 	Cause varchar(30) NOT NULL
// );
// GO

// ALTER TABLE Burial.CauseLookup ADD CONSTRAINT PK__CauseLoo__871D0D286D921B4B PRIMARY KEY (CauseLUpID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.CauseLookup', (table) => {
		table.increments('CauseLUpID').primary();
		table.string('Cause', 30).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.raw(`DROP TABLE Burial.CauseLookup;`);
};
