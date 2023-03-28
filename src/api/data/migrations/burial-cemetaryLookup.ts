// -- BEGIN TABLE Burial.CemetaryLookup
// IF OBJECT_ID('Burial.CemetaryLookup', 'U') IS NOT NULL
// DROP TABLE Burial.CemetaryLookup;
// GO

// CREATE TABLE Burial.CemetaryLookup (
// 	CemetaryLUpID smallint NOT NULL IDENTITY(1,1),
// 	Cemetary varchar(50) NOT NULL,
// 	Community varchar(50) NULL,
// 	Address varchar(200) NULL,
// 	Notes varchar(255) NULL,
// 	Latitude float(8) NULL,
// 	Longitude float(8) NULL
// );
// GO

// ALTER TABLE Burial.CemetaryLookup ADD CONSTRAINT PK__Cemetary__64608C64A0FED3EE PRIMARY KEY (CemetaryLUpID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.CemetaryLookup', (table) => {
		table.increments('CemetaryLUpID').primary();
		table.string('Cemetary', 50).notNullable();
		table.string('Community', 50).nullable();
		table.string('Address', 200).nullable();
		table.string('Notes', 255).nullable();
		table.float('Latitude').nullable();
		table.float('Longitude').nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.CemetaryLookup');
};
