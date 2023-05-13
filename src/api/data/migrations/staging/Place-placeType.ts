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

	await knex('Place.PlaceTypeLookup').delete().whereRaw('1=1');
	await knex('Place.PlaceTypeLookup').insert([
		{
			PlaceType: 'Mine',
			Id: 1,
		},
		{
			PlaceType: 'Industrial',
			Id: 2,
		},
		{
			PlaceType: 'Landscape Feature',
			Id: 3,
		},
		{
			PlaceType: 'First Nation ',
			Id: 4,
		},
		{
			PlaceType: 'Settlement',
			Id: 5,
		},
		{
			PlaceType: 'Transportation - rail',
			Id: 6,
		},
		{
			PlaceType: 'Transportation - road',
			Id: 7,
		},
		{
			PlaceType: 'Transportation - air ',
			Id: 8,
		},
		{
			PlaceType: 'Transportation - water',
			Id: 9,
		},
		{
			PlaceType: 'Agriculture',
			Id: 10,
		},
		{
			PlaceType: 'Communication',
			Id: 11,
		},
		{
			PlaceType: 'Governmental',
			Id: 12,
		},
		{
			PlaceType: 'Commercial',
			Id: 13,
		},
		{
			PlaceType: 'Gravesite',
			Id: 14,
		},
		{
			PlaceType: 'Water Feature',
			Id: 15,
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Place.PlaceType');
};
