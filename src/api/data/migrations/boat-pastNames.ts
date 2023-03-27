// -- BEGIN TABLE Boat.PastNames
// IF OBJECT_ID('Boat.PastNames', 'U') IS NOT NULL
// DROP TABLE Boat.PastNames;
// GO

// CREATE TABLE Boat.PastNames (
// 	Id int NOT NULL IDENTITY(1,1),
// 	BoatId int NOT NULL,
// 	BoatName varchar(64) NOT NULL
// );
// GO

// ALTER TABLE Boat.PastNames ADD CONSTRAINT PK__PastName__3214EC07DD0D47D4 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.raw(`CREATE TABLE Boat.PastNames (
    Id int NOT NULL IDENTITY(1,1),
    BoatId int NOT NULL,
    BoatName varchar(64) NOT NULL
  );
  ALTER TABLE Boat.PastNames ADD CONSTRAINT PK__PastName__3214EC07DD0D47D4 PRIMARY KEY (Id);
    `);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.raw(`DROP TABLE Boat.PastNames;`);
};
