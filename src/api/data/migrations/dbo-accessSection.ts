// -- BEGIN TABLE dbo.AccessSection
// IF OBJECT_ID('dbo.AccessSection', 'U') IS NOT NULL
// DROP TABLE dbo.AccessSection;
// GO

// CREATE TABLE dbo.AccessSection (
// 	SectionID int NOT NULL IDENTITY(1,1),
// 	SectionName varchar(60) NOT NULL,
// 	SectionIcon varchar(120) NULL
// );
// GO

// ALTER TABLE dbo.AccessSection ADD CONSTRAINT PK__AccessSe__80EF089292E659F6 PRIMARY KEY (SectionID);
// GO

// INSERT INTO dbo.AccessSection (SectionID, SectionName, SectionIcon) VALUES
// (1, 'Photos', 'camera'),
// (2, 'Airplane Crash', 'airplane-landing'),
// (3, 'Places', 'routes'),
// (4, 'Boats', 'ferry'),
// (5, 'People', 'human-male-female'),
// (6, 'Interpretive Signs', 'image'),
// (7, 'Burials', 'grave-stone'),
// (8, 'Map', 'buffer'),
// (9, 'Administration', 'cube');

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	knex.schema.createTable('dbo.AccessSection', (table) => {
		table.increments('SectionID').primary();
		table.string('SectionName', 60).notNullable();
		table.string('SectionIcon', 120).nullable();
	});

	await knex('dbo.AccessSection').delete().whereRaw('1=1');
	await knex('dbo.AccessSection').insert([
		{
			SectionID: 1,
			SectionName: 'Photos',
			SectionIcon: 'camera',
		},
		{
			SectionID: 2,
			SectionName: 'Airplane Crash',
			SectionIcon: 'airplane-landing',
		},
		{
			SectionID: 3,
			SectionName: 'Places',
			SectionIcon: 'routes',
		},
		{
			SectionID: 4,
			SectionName: 'Boats',
			SectionIcon: 'ferry',
		},
		{
			SectionID: 5,
			SectionName: 'People',
			SectionIcon: 'human-male-female',
		},
		{
			SectionID: 6,
			SectionName: 'Interpretive Signs',
			SectionIcon: 'image',
		},
		{
			SectionID: 7,
			SectionName: 'Burials',
			SectionIcon: 'grave-stone',
		},
		{
			SectionID: 8,
			SectionName: 'Map',
			SectionIcon: 'buffer',
		},
		{
			SectionID: 9,
			SectionName: 'Administration',
			SectionIcon: 'cube',
		},
	]);
};

exports.down = async function (knex: Knex, Promise: any) {
	knex.schema.dropTable('dbo.AccessSection');
};
