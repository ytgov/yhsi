// -- BEGIN TABLE Place.Photo
// IF OBJECT_ID('Place.Photo', 'U') IS NOT NULL
// DROP TABLE Place.Photo;
// GO

// CREATE TABLE Place.Photo (
// 	PlaceID int NULL,
// 	Photo_RowID nvarchar(255) NOT NULL,
// 	Id int NOT NULL IDENTITY(1,1)
// );
// GO

// ALTER TABLE Place.Photo ADD CONSTRAINT PK__Photo__3214EC07A1A629AD PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Place.Photo', (table) => {
		table.integer('PlaceID').nullable();
		table.string('Photo_RowID', 255).notNullable();
		table.increments('Id').primary();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Place.Photo');
};
