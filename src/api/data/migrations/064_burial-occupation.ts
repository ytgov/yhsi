// -- BEGIN TABLE Burial.Occupation
// IF OBJECT_ID('Burial.Occupation', 'U') IS NOT NULL
// DROP TABLE Burial.Occupation;
// GO

// CREATE TABLE Burial.Occupation (
// 	ID smallint NOT NULL IDENTITY(1,1),
// 	BurialID smallint NOT NULL,
// 	OccupationID smallint NOT NULL
// );
// GO

// ALTER TABLE Burial.Occupation ADD CONSTRAINT PK__Occupati__3214EC27263EF355 PRIMARY KEY (ID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.Occupation', (table) => {
		table.increments('ID').primary();
		table.integer('BurialID').notNullable();
		table.integer('OccupationID').notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.Occupation');
};
