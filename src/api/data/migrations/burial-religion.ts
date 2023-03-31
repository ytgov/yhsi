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

	await knex('Burial.ReligionLookup').delete().whereRaw('1=1');
	await knex('Burial.ReligionLookup').insert([
		{
			ReligionLUpID: 1,
			Religion: 'Agnostic',
		},
		{
			ReligionLUpID: 2,
			Religion: 'Buddhist',
		},
		{
			ReligionLUpID: 3,
			Religion: 'Catholic',
		},
		{
			ReligionLUpID: 4,
			Religion: 'Christian Science',
		},
		{
			ReligionLUpID: 5,
			Religion: 'Greek Catholic',
		},
		{
			ReligionLUpID: 6,
			Religion: 'Greek Orthodox',
		},
		{
			ReligionLUpID: 7,
			Religion: 'Jewish',
		},
		{
			ReligionLUpID: 8,
			Religion: 'Pagan',
		},
		{
			ReligionLUpID: 9,
			Religion: 'Protestant',
		},
		{
			ReligionLUpID: 10,
			Religion: 'Sikh',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.ReligionLookup');
};
