// -- BEGIN TABLE Place.PlaceTypeLookup
// IF OBJECT_ID('Place.PlaceTypeLookup', 'U') IS NOT NULL
// DROP TABLE Place.PlaceTypeLookup;
// GO

// CREATE TABLE Place.PlaceTypeLookup (
// 	PlaceType varchar(140) NULL,
// 	Id int NOT NULL IDENTITY(1,1)
// );
// GO

// ALTER TABLE Place.PlaceTypeLookup ADD CONSTRAINT PK__PlaceTyp__3214EC0728DB345B PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Place.PlaceTypeLookup', (table) => {
		table.string('PlaceType', 140).nullable();
		table.increments('Id').primary();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Place.PlaceTypeLookup');
};
