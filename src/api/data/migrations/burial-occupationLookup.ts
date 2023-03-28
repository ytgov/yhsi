// -- BEGIN TABLE Burial.OccupationLookup
// IF OBJECT_ID('Burial.OccupationLookup', 'U') IS NOT NULL
// DROP TABLE Burial.OccupationLookup;
// GO

// CREATE TABLE Burial.OccupationLookup (
// 	OccupationLupID smallint NOT NULL IDENTITY(1,1),
// 	Occupation varchar(40) NOT NULL
// );
// GO

// ALTER TABLE Burial.OccupationLookup ADD CONSTRAINT PK__Occupati__B3EF5113113C600C PRIMARY KEY (OccupationLupID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.OccupationLookup', (table) => {
		table.increments('OccupationLupID').primary();
		table.string('Occupation', 40).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.OccupationLookup');
};
