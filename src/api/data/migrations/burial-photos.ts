// -- BEGIN TABLE Burial.Photo
// IF OBJECT_ID('Burial.Photo', 'U') IS NOT NULL
// DROP TABLE Burial.Photo;
// GO

// CREATE TABLE Burial.Photo (
// 	Id smallint NOT NULL IDENTITY(1,1),
// 	BurialID smallint NOT NULL,
// 	Photo_RowID nvarchar(255) NOT NULL
// );
// GO

// ALTER TABLE Burial.Photo ADD CONSTRAINT PK__Photo__3214EC0728CB35D1 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.Photo', (table) => {
		table.increments('Id').primary();
		table.integer('BurialID').notNullable();
		table.string('Photo_RowID', 255).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.Photo');
};
