// -- BEGIN TABLE Burial.CemetaryLookup
// IF OBJECT_ID('Burial.CemetaryLookup', 'U') IS NOT NULL
// DROP TABLE Burial.CemetaryLookup;
// GO

// CREATE TABLE Burial.CemetaryLookup (
// 	CemetaryLUpID smallint NOT NULL IDENTITY(1,1),
// 	Cemetary varchar(50) NOT NULL,
// 	Community varchar(50) NULL,
// 	Address varchar(200) NULL,
// 	Notes varchar(255) NULL,
// 	Latitude float(8) NULL,
// 	Longitude float(8) NULL
// );
// GO

// ALTER TABLE Burial.CemetaryLookup ADD CONSTRAINT PK__Cemetary__64608C64A0FED3EE PRIMARY KEY (CemetaryLUpID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.CemetaryLookup', (table) => {
		table.increments('CemetaryLUpID').primary();
		table.string('Cemetary', 50).notNullable();
		table.string('Community', 50).nullable();
		table.string('Address', 200).nullable();
		table.string('Notes', 255).nullable();
		table.float('Latitude').nullable();
		table.float('Longitude').nullable();
	});

	await knex('Burial.CemetaryLookup').delete().whereRaw('1=1');
	await knex('Burial.CemetaryLookup').insert([
		{
			Cemetary: '3rd Avenue',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: '8th Ave. YOOP',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Hillside',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Jewish',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Masonic',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Moosehide',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'New Catholic',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'New Public',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'New YOOP',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Old Catholic',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'RCMP',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Unknown',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Other',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Mayo',
			Community: 'Mayo',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Circle City',
			Community: 'Circle City, Alaska',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Old Crow',
			Community: 'Old Crow',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Bennett test',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Carcross',
			Community: 'Carcross',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Grand Forks',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Grey Mountain',
			Community: 'Whitehorse',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Whitehorse Catholic',
			Community: 'Whitehorse',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Fort Selkirk Indian',
			Community: 'Fort Selkirk',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Forty Mile',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Rampart',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Fort Yukon',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Gold Run',
			Community: '',
			Address: '',
			Notes: 'No. 20 Gold Run Creek',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Lansing',
			Community: '',
			Address: '',
			Notes: 'On Stewart River',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Police Barracks ',
			Community: 'Dawson',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Stewart City',
			Community: '',
			Address: '',
			Notes: 'cemetery now washed into Yukon River',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Twelve Mile',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Pelly Crossing',
			Community: 'Pelly Crossing',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Fraser Falls',
			Community: '',
			Address: '',
			Notes: 'on Stewart River',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Pioneer',
			Community: 'Whitehorse',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Inuvik',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
		{
			Cemetary: 'Lindeman',
			Community: '',
			Address: '',
			Notes: '',
			Latitude: 0,
			Longitude: 0,
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.CemetaryLookup');
};
