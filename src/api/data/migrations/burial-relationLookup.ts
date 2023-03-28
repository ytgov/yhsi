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
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.RelationLookup');
};
