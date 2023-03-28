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
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.RouteLookup');
};
