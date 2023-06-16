// - BEGIN TABLE Person.Photo
// IF OBJECT_ID('Person.Photo', 'U') IS NOT NULL
// DROP TABLE Person.Photo;
// GO

// CREATE TABLE Person.Photo (
// 	PersonID int NOT NULL,
// 	PhotoID varchar(255) NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Person.Photo', (table) => {
		table.integer('PersonID').notNullable();
		table.string('PhotoID', 255).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Person.Photo');
};
