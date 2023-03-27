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
	await knex.raw(`CREATE TABLE Boat.Photo (
    BoatId int NOT NULL,
    Photo_RowID varchar(255) NULL,
    Id int NOT NULL IDENTITY(1,1)
  );
  ALTER TABLE Boat.Photo ADD CONSTRAINT PK__Photo__3214EC076ADE23BB PRIMARY KEY (Id);
    `);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.raw(`DROP TABLE Boat.Photo;`);
};
