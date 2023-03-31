// -- BEGIN TABLE Burial.RelationLookup
// IF OBJECT_ID('Burial.RelationLookup', 'U') IS NOT NULL
// DROP TABLE Burial.RelationLookup;
// GO

// CREATE TABLE Burial.RelationLookup (
// 	RelationLUpID smallint NOT NULL IDENTITY(1,1),
// 	Relationship varchar(30) NOT NULL
// );
// GO

// ALTER TABLE Burial.RelationLookup ADD CONSTRAINT PK__Relation__DD5F033522B8629B PRIMARY KEY (RelationLUpID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.RelationLookup', (table) => {
		table.increments('RelationLUpID').primary();
		table.string('Relationship', 30).notNullable();
	});

	await knex('Burial.RelationLookup').delete().whereRaw('1=1');
	await knex('Burial.RelationLookup').insert([
		{
			RelationLUpID: 1,
			Relationship: 'Aunt',
		},
		{
			RelationLUpID: 2,
			Relationship: 'Brother',
		},
		{
			RelationLUpID: 3,
			Relationship: 'Brother-in-law',
		},
		{
			RelationLUpID: 4,
			Relationship: 'Brothers',
		},
		{
			RelationLUpID: 5,
			Relationship: 'Brothers-in-law',
		},
		{
			RelationLUpID: 6,
			Relationship: 'Child',
		},
		{
			RelationLUpID: 7,
			Relationship: 'Children',
		},
		{
			RelationLUpID: 8,
			Relationship: 'Cousin',
		},
		{
			RelationLUpID: 9,
			Relationship: 'Cousins',
		},
		{
			RelationLUpID: 10,
			Relationship: 'Daughter',
		},
		{
			RelationLUpID: 11,
			Relationship: 'Daughter-in-law',
		},
		{
			RelationLUpID: 12,
			Relationship: 'Daughters',
		},
		{
			RelationLUpID: 13,
			Relationship: 'Ex-wife',
		},
		{
			RelationLUpID: 14,
			Relationship: 'Ex-husband',
		},
		{
			RelationLUpID: 15,
			Relationship: 'Family',
		},
		{
			RelationLUpID: 16,
			Relationship: 'Father',
		},
		{
			RelationLUpID: 17,
			Relationship: 'Father-in-law',
		},
		{
			RelationLUpID: 18,
			Relationship: 'Fiance',
		},
		{
			RelationLUpID: 19,
			Relationship: 'Friend',
		},
		{
			RelationLUpID: 20,
			Relationship: 'Friends',
		},
		{
			RelationLUpID: 21,
			Relationship: 'Grandchild',
		},
		{
			RelationLUpID: 22,
			Relationship: 'Grandchildren',
		},
		{
			RelationLUpID: 23,
			Relationship: 'Granddaughter',
		},
		{
			RelationLUpID: 24,
			Relationship: 'granddaughters',
		},
		{
			RelationLUpID: 25,
			Relationship: 'Grandmother',
		},
		{
			RelationLUpID: 26,
			Relationship: 'Grandson',
		},
		{
			RelationLUpID: 27,
			Relationship: 'Grandsons',
		},
		{
			RelationLUpID: 28,
			Relationship: 'Great grandchild',
		},
		{
			RelationLUpID: 29,
			Relationship: 'Great grandchildren',
		},
		{
			RelationLUpID: 30,
			Relationship: 'Great Uncle',
		},
		{
			RelationLUpID: 31,
			Relationship: 'Great-Great grandson',
		},
		{
			RelationLUpID: 32,
			Relationship: 'Half Brother',
		},
		{
			RelationLUpID: 33,
			Relationship: 'Half Sister',
		},
		{
			RelationLUpID: 34,
			Relationship: 'Husband',
		},
		{
			RelationLUpID: 35,
			Relationship: 'Mother',
		},
		{
			RelationLUpID: 36,
			Relationship: 'Nephew',
		},
		{
			RelationLUpID: 37,
			Relationship: 'Nephews',
		},
		{
			RelationLUpID: 38,
			Relationship: 'Niece',
		},
		{
			RelationLUpID: 39,
			Relationship: 'Nieces',
		},
		{
			RelationLUpID: 40,
			Relationship: 'Parent',
		},
		{
			RelationLUpID: 41,
			Relationship: 'Parents',
		},
		{
			RelationLUpID: 42,
			Relationship: 'Relative',
		},
		{
			RelationLUpID: 43,
			Relationship: 'Relatives',
		},
		{
			RelationLUpID: 44,
			Relationship: 'Siblings',
		},
		{
			RelationLUpID: 45,
			Relationship: 'Sister',
		},
		{
			RelationLUpID: 46,
			Relationship: 'Sister-in-law',
		},
		{
			RelationLUpID: 47,
			Relationship: 'Sisters',
		},
		{
			RelationLUpID: 48,
			Relationship: 'Sisters-in-laws',
		},
		{
			RelationLUpID: 49,
			Relationship: 'Son',
		},
		{
			RelationLUpID: 50,
			Relationship: 'Son-in-law',
		},
		{
			RelationLUpID: 51,
			Relationship: 'Sons',
		},
		{
			RelationLUpID: 52,
			Relationship: 'Stepchild',
		},
		{
			RelationLUpID: 53,
			Relationship: 'Stepson',
		},
		{
			RelationLUpID: 54,
			Relationship: 'Stepdaughter',
		},
		{
			RelationLUpID: 55,
			Relationship: 'Stepfather',
		},
		{
			RelationLUpID: 56,
			Relationship: 'Stepmother',
		},
		{
			RelationLUpID: 57,
			Relationship: 'Uncle',
		},
		{
			RelationLUpID: 58,
			Relationship: 'Uncles',
		},
		{
			RelationLUpID: 59,
			Relationship: 'Widow',
		},
		{
			RelationLUpID: 60,
			Relationship: 'Widower',
		},
		{
			RelationLUpID: 61,
			Relationship: 'Wife',
		},
		{
			RelationLUpID: 62,
			Relationship: 'Other',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.RelationLookup');
};
