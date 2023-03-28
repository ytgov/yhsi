// -- BEGIN TABLE Burial.ReligionLookup
// IF OBJECT_ID('Burial.ReligionLookup', 'U') IS NOT NULL
// DROP TABLE Burial.ReligionLookup;
// GO

// CREATE TABLE Burial.ReligionLookup (
// 	ReligionLUpID smallint NOT NULL IDENTITY(1,1),
// 	Religion varchar(60) NOT NULL
// );
// GO

// ALTER TABLE Burial.ReligionLookup ADD CONSTRAINT PK__Religion__5BEEB01CAA6FD6A9 PRIMARY KEY (ReligionLUpID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	knex.raw(`CREATE TABLE Burial.ReligionLookup (
    	ReligionLUpID smallint NOT NULL IDENTITY(1,1),
      Religion varchar(60) NOT NULL
    );
    ALTER TABLE Burial.ReligionLookup ADD CONSTRAINT PK__Religion__5BEEB01CAA6FD6A9 PRIMARY KEY (ReligionLUpID);
    `);
};
exports.down = async function (knex: Knex, Promise: any) {
	knex.raw(`DROP TABLE Burial.ReligionLookup;`);
};
