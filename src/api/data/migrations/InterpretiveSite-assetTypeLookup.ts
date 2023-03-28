// -- BEGIN TABLE InterpretiveSite.AssetTypeLookup
// IF OBJECT_ID('InterpretiveSite.AssetTypeLookup', 'U') IS NOT NULL
// DROP TABLE InterpretiveSite.AssetTypeLookup;
// GO

// CREATE TABLE InterpretiveSite.AssetTypeLookup (
// 	TypeLUpID smallint NOT NULL IDENTITY(1,1),
// 	[Type] varchar(100) NOT NULL,
// 	Category varchar(30) NOT NULL,
// 	Status bit NOT NULL
// );
// GO

// ALTER TABLE InterpretiveSite.AssetTypeLookup ADD CONSTRAINT PK__AssetTyp__C2CE044178218299 PRIMARY KEY (TypeLUpID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('InterpretiveSite.AssetTypeLookup', (table) => {
		table.increments('TypeLUpID').primary();
		table.string('Type', 100).notNullable();
		table.string('Category', 30).notNullable();
		table.boolean('Status').notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.AssetTypeLookup');
};
