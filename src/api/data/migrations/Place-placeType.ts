// -- BEGIN TABLE Place.PlaceType
// IF OBJECT_ID('Place.PlaceType', 'U') IS NOT NULL
// DROP TABLE Place.PlaceType;
// GO

// CREATE TABLE Place.PlaceType (
// 	PlaceId int NOT NULL,
// 	PlaceTypeLookupId int NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Place.PlaceType', (table) => {
		table.integer('PlaceId').notNullable();
		table.integer('PlaceTypeLookupId').nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Place.PlaceType');
};
