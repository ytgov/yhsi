// -- BEGIN TABLE Boat.Boat
// IF OBJECT_ID('Boat.Boat', 'U') IS NOT NULL
// DROP TABLE Boat.Boat;
// GO

// CREATE TABLE Boat.Boat (
// 	Id int NOT NULL IDENTITY(1,1),
// 	ConstructionDate datetime2(7) NULL DEFAULT (NULL),
// 	ServiceStart datetime2(7) NULL DEFAULT (NULL),
// 	ServiceEnd datetime2(7) NULL DEFAULT (NULL),
// 	VesselType varchar(64) NULL DEFAULT (NULL),
// 	CurrentLocation varchar(512) NULL DEFAULT (NULL),
// 	Notes varchar(4096) NULL DEFAULT (NULL),
// 	RegistrationNumber varchar(64) NULL DEFAULT (NULL),
// 	Name varchar(64) NULL DEFAULT (NULL)
// );
// GO

// ALTER TABLE Boat.Boat ADD CONSTRAINT PK__Boat__3214EC07E7E5761C PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.raw(`CREATE TABLE Boat.Boat (
    Id int NOT NULL IDENTITY(1,1),
    ConstructionDate datetime2(7) NULL DEFAULT (NULL),
    ServiceStart datetime2(7) NULL DEFAULT (NULL),
    ServiceEnd datetime2(7) NULL DEFAULT (NULL),
    VesselType varchar(64) NULL DEFAULT (NULL),
    CurrentLocation varchar(512) NULL DEFAULT (NULL),
    Notes varchar(4096) NULL DEFAULT (NULL),
    RegistrationNumber varchar(64) NULL DEFAULT (NULL),
    Name varchar(64) NULL DEFAULT (NULL)
  );

  ALTER TABLE Boat.Boat ADD CONSTRAINT PK__Boat__3214EC07E7E5761C PRIMARY KEY (Id);
    `);
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.raw(`DROP TABLE Boat.Boat;`);
};
