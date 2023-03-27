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
	await knex.raw(`CREATE TABLE Boat.BoatOwner (
    BoatID int NOT NULL,
    OwnerID int NOT NULL,
    CurrentOwner bit NOT NULL
  );

  ALTER TABLE Boat.BoatOwner ADD CONSTRAINT PK__BoatOwne__8C9111E5F5E02C09 PRIMARY KEY (BoatID, OwnerID);
    `);
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.raw(`DROP TABLE Boat.BoatOwner;`);
};
