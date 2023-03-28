// -- BEGIN TABLE Burial.NOKin
// IF OBJECT_ID('Burial.NOKin', 'U') IS NOT NULL
// DROP TABLE Burial.NOKin;
// GO

// CREATE TABLE Burial.NOKin (
// 	NOKID smallint NOT NULL IDENTITY(1,1),
// 	BurialID smallint NOT NULL,
// 	RelationshipID smallint NOT NULL,
// 	Quantity tinyint NULL,
// 	Name varchar(200) NULL,
// 	Location varchar(100) NULL
// );
// GO

// ALTER TABLE Burial.NOKin ADD CONSTRAINT PK__NOKin__05FA48A30A49EA48 PRIMARY KEY (NOKID);
// GO

//Burial Next of Kin

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	knex.raw(`CREATE TABLE Burial.NOKin (
    	NOKID smallint NOT NULL IDENTITY(1,1),
      BurialID smallint NOT NULL,
      RelationshipID smallint NOT NULL,
      Quantity tinyint NULL,
      Name varchar(200) NULL,
      Location varchar(100) NULL
    );
    ALTER TABLE Burial.NOKin ADD CONSTRAINT PK__NOKin__05FA48A30A49EA48 PRIMARY KEY (NOKID);
    `);
};
exports.down = async function (knex: Knex, Promise: any) {
	knex.raw(`DROP TABLE Burial.NOKin;`);
};
