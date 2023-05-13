// - BEGIN TABLE Boat.Photo
// IF OBJECT_ID('Boat.Photo', 'U') IS NOT NULL
// DROP TABLE Boat.Photo;
// GO

// CREATE TABLE Boat.Photo (
// 	BoatId int NOT NULL,
// 	Photo_RowID varchar(255) NULL,
// 	Id int NOT NULL IDENTITY(1,1)
// );
// GO

// ALTER TABLE Boat.Photo ADD CONSTRAINT PK__Photo__3214EC076ADE23BB PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Boat.Photo', (table) => {
		table.integer('BoatId').notNullable();
		table.string('Photo_RowID', 255).nullable();
		table.increments('Id').primary();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Boat.Photo');
};
