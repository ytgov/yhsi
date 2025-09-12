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
	await knex.schema.createTable('Place.PlaceTypeLookup', (table) => {
		table.increments('Id').primary();
		table.string('PlaceType').nullable();
	});

	await knex('Place.PlaceTypeLookup').delete().whereRaw('1=1');
	await knex('Place.PlaceTypeLookup').insert([
		{
			PlaceType: 'Mine',
		},
		{
			PlaceType: 'Industrial',
		},
		{
			PlaceType: 'Landscape Feature',
		},
		{
			PlaceType: 'First Nation ',
		},
		{
			PlaceType: 'Settlement',
		},
		{
			PlaceType: 'Transportation - rail',
		},
		{
			PlaceType: 'Transportation - road',
		},
		{
			PlaceType: 'Transportation - air ',
		},
		{
			PlaceType: 'Transportation - water',
		},
		{
			PlaceType: 'Agriculture',
		},
		{
			PlaceType: 'Communication',
		},
		{
			PlaceType: 'Governmental',
		},
		{
			PlaceType: 'Commercial',
		},
		{
			PlaceType: 'Gravesite',
		},
		{
			PlaceType: 'Water Feature',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Place.PlaceTypeLookup');
};
