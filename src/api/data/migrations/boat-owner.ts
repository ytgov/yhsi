// -- BEGIN TABLE Boat.Owner
// IF OBJECT_ID('Boat.Owner', 'U') IS NOT NULL
// DROP TABLE Boat.Owner;
// GO

// CREATE TABLE Boat.Owner (
// 	Id int NOT NULL IDENTITY(1,1),
// 	OwnerName varchar(64) NOT NULL
// );
// GO

// ALTER TABLE Boat.Owner ADD CONSTRAINT PK__Owner__3214EC07BD1B459E PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.raw(`CREATE TABLE Boat.Owner (
    Id int NOT NULL IDENTITY(1,1),
    OwnerName varchar(64) NOT NULL
  );
  ALTER TABLE Boat.Owner ADD CONSTRAINT PK__Owner__3214EC07BD1B459E PRIMARY KEY (Id);
    `);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.raw(`DROP TABLE Boat.Owner;`);
};
