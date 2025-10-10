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
			Relationship: 'Aunt',
		},
		{
			Relationship: 'Brother',
		},
		{
			Relationship: 'Brother-in-law',
		},
		{
			Relationship: 'Brothers',
		},
		{
			Relationship: 'Brothers-in-law',
		},
		{
			Relationship: 'Child',
		},
		{
			Relationship: 'Children',
		},
		{
			Relationship: 'Cousin',
		},
		{
			Relationship: 'Cousins',
		},
		{
			Relationship: 'Daughter',
		},
		{
			Relationship: 'Daughter-in-law',
		},
		{
			Relationship: 'Daughters',
		},
		{
			Relationship: 'Ex-wife',
		},
		{
			Relationship: 'Ex-husband',
		},
		{
			Relationship: 'Family',
		},
		{
			Relationship: 'Father',
		},
		{
			Relationship: 'Father-in-law',
		},
		{
			Relationship: 'Fiance',
		},
		{
			Relationship: 'Friend',
		},
		{
			Relationship: 'Friends',
		},
		{
			Relationship: 'Grandchild',
		},
		{
			Relationship: 'Grandchildren',
		},
		{
			Relationship: 'Granddaughter',
		},
		{
			Relationship: 'granddaughters',
		},
		{
			Relationship: 'Grandmother',
		},
		{
			Relationship: 'Grandson',
		},
		{
			Relationship: 'Grandsons',
		},
		{
			Relationship: 'Great grandchild',
		},
		{
			Relationship: 'Great grandchildren',
		},
		{
			Relationship: 'Great Uncle',
		},
		{
			Relationship: 'Great-Great grandson',
		},
		{
			Relationship: 'Half Brother',
		},
		{
			Relationship: 'Half Sister',
		},
		{
			Relationship: 'Husband',
		},
		{
			Relationship: 'Mother',
		},
		{
			Relationship: 'Nephew',
		},
		{
			Relationship: 'Nephews',
		},
		{
			Relationship: 'Niece',
		},
		{
			Relationship: 'Nieces',
		},
		{
			Relationship: 'Parent',
		},
		{
			Relationship: 'Parents',
		},
		{
			Relationship: 'Relative',
		},
		{
			Relationship: 'Relatives',
		},
		{
			Relationship: 'Siblings',
		},
		{
			Relationship: 'Sister',
		},
		{
			Relationship: 'Sister-in-law',
		},
		{
			Relationship: 'Sisters',
		},
		{
			Relationship: 'Sisters-in-laws',
		},
		{
			Relationship: 'Son',
		},
		{
			Relationship: 'Son-in-law',
		},
		{
			Relationship: 'Sons',
		},
		{
			Relationship: 'Stepchild',
		},
		{
			Relationship: 'Stepson',
		},
		{
			Relationship: 'Stepdaughter',
		},
		{
			Relationship: 'Stepfather',
		},
		{
			Relationship: 'Stepmother',
		},
		{
			Relationship: 'Uncle',
		},
		{
			Relationship: 'Uncles',
		},
		{
			Relationship: 'Widow',
		},
		{
			Relationship: 'Widower',
		},
		{
			Relationship: 'Wife',
		},
		{
			Relationship: 'Other',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.RelationLookup');
};
