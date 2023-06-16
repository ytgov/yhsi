// -- BEGIN TABLE Place.FNAssociation
// IF OBJECT_ID('Place.FNAssociation', 'U') IS NOT NULL
// DROP TABLE Place.FNAssociation;
// GO

// CREATE TABLE Place.FNAssociation (
// 	PlaceId int NOT NULL,
// 	FirstNationId int NOT NULL,
// 	FNAssociationType int NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Place.FNAssociation', (table) => {
		table.integer('PlaceId').notNullable();
		table.integer('FirstNationId').notNullable();
		table.integer('FNAssociationType').nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Place.FNAssociation');
};
