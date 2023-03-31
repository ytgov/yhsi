// -- BEGIN TABLE Boat.Type
// IF OBJECT_ID('Boat.[Type]', 'U') IS NOT NULL
// DROP TABLE Boat.[Type];
// GO

// CREATE TABLE Boat.[Type] (
// 	Id int NOT NULL IDENTITY(1,1),
// 	[Type] varchar(64) NOT NULL
// );
// GO

// ALTER TABLE Boat.[Type] ADD CONSTRAINT PK__Type__3214EC0776BB85DB PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Boat.[Type]', (table) => {
		table.increments('Id').primary();
		table.string('Type', 64).notNullable();
	});

	await knex('Boat.[Type]').delete().whereRaw('1=1');
	await knex('Boat.[Type]').insert([
		{
			Id: 1,
			Type: 'Barge',
		},
		{
			Id: 2,
			Type: 'Sternwheeler',
		},
		{
			Id: 3,
			Type: 'Launch',
		},
		{
			Id: 4,
			Type: 'Ferry',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Boat.[Type]');
};
