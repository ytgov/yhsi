// -- BEGIN TABLE InterpretiveSite.RouteLookup
// IF OBJECT_ID('InterpretiveSite.RouteLookup', 'U') IS NOT NULL
// DROP TABLE InterpretiveSite.RouteLookup;
// GO

// CREATE TABLE InterpretiveSite.RouteLookup (
// 	RouteLUpID smallint NOT NULL IDENTITY(1,1),
// 	RouteName varchar(50) NOT NULL
// );
// GO

// ALTER TABLE InterpretiveSite.RouteLookup ADD CONSTRAINT PK__RouteLoo__D002A518884A5943 PRIMARY KEY (RouteLUpID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('InterpretiveSite.RouteLookup', (table) => {
		table.increments('RouteLUpID').primary();
		table.string('RouteName', 50).notNullable();
	});

	await knex('InterpretiveSite.RouteLookup').delete().whereRaw('1=1');
	await knex('InterpretiveSite.RouteLookup').insert([
		{
			RouteLUpID: 1,
			RouteName: 'Alaska Highway',
		},
		{
			RouteLUpID: 2,
			RouteName: 'Robert Campbell Highway',
		},
		{
			RouteLUpID: 3,
			RouteName: 'Dempster Highway',
		},
		{
			RouteLUpID: 4,
			RouteName: 'Klondike Highway',
		},
		{
			RouteLUpID: 5,
			RouteName: 'Dawson City',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.RouteLookup');
};
