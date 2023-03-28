// -- BEGIN TABLE Burial.CemetaryLookup
// IF OBJECT_ID('Burial.CemetaryLookup', 'U') IS NOT NULL
// DROP TABLE Burial.CemetaryLookup;
// GO

// CREATE TABLE Burial.CemetaryLookup (
// 	CemetaryLUpID smallint NOT NULL IDENTITY(1,1),
// 	Cemetary varchar(50) NOT NULL,
// 	Community varchar(50) NULL,
// 	Address varchar(200) NULL,
// 	Notes varchar(255) NULL,
// 	Latitude float(8) NULL,
// 	Longitude float(8) NULL
// );
// GO

// ALTER TABLE Burial.CemetaryLookup ADD CONSTRAINT PK__Cemetary__64608C64A0FED3EE PRIMARY KEY (CemetaryLUpID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	knex.raw(`CREATE TABLE Burial.CemetaryLookup (
    	CemetaryLUpID smallint NOT NULL IDENTITY(1,1),
      Cemetary varchar(50) NOT NULL,
      Community varchar(50) NULL,
      Address varchar(200) NULL,
      Notes varchar(255) NULL,
      Latitude float(8) NULL,
      Longitude float(8) NULL
    );`);
};
exports.down = async function (knex: Knex, Promise: any) {
	knex.raw(`DROP TABLE Burial.CemetaryLookup;`);
};
