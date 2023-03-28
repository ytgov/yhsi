// -- BEGIN TABLE Burial.ReligionLookup
// IF OBJECT_ID('Burial.ReligionLookup', 'U') IS NOT NULL
// DROP TABLE Burial.ReligionLookup;
// GO

// CREATE TABLE Burial.ReligionLookup (
// 	ReligionLUpID smallint NOT NULL IDENTITY(1,1),
// 	Religion varchar(60) NOT NULL
// );
// GO

// ALTER TABLE Burial.ReligionLookup ADD CONSTRAINT PK__Religion__5BEEB01CAA6FD6A9 PRIMARY KEY (ReligionLUpID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.ReligionLookup', (table) => {
		table.increments('ReligionLUpID').primary();
		table.string('Religion', 60).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.ReligionLookup');
};
