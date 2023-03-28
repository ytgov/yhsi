// -- BEGIN TABLE Boat.BoatOwner
// IF OBJECT_ID('Boat.BoatOwner', 'U') IS NOT NULL
// DROP TABLE Boat.BoatOwner;
// GO

// CREATE TABLE Boat.BoatOwner (
// 	BoatID int NOT NULL,
// 	OwnerID int NOT NULL,
// 	CurrentOwner bit NOT NULL
// );
// GO

// ALTER TABLE Boat.BoatOwner ADD CONSTRAINT PK__BoatOwne__8C9111E5F5E02C09 PRIMARY KEY (BoatID, OwnerID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Boat.BoatOwner', (table) => {
		table.integer('BoatID').notNullable();
		table.integer('OwnerID').notNullable();
		table.boolean('CurrentOwner').notNullable();
	});
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Boat.BoatOwner');
};
