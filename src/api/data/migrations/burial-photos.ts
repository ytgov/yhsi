// -- BEGIN TABLE Burial.Photo
// IF OBJECT_ID('Burial.Photo', 'U') IS NOT NULL
// DROP TABLE Burial.Photo;
// GO

// CREATE TABLE Burial.Photo (
// 	Id smallint NOT NULL IDENTITY(1,1),
// 	BurialID smallint NOT NULL,
// 	Photo_RowID nvarchar(255) NOT NULL
// );
// GO

// ALTER TABLE Burial.Photo ADD CONSTRAINT PK__Photo__3214EC0728CB35D1 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	knex.raw(`CREATE TABLE Burial.Photo (
    	Id smallint NOT NULL IDENTITY(1,1),
      BurialID smallint NOT NULL,
      Photo_RowID nvarchar(255) NOT NULL
    );
    ALTER TABLE Burial.Photo ADD CONSTRAINT PK__Photo__3214EC0728CB35D1 PRIMARY KEY (Id);
    `);
};
exports.down = async function (knex: Knex, Promise: any) {
	knex.raw(`DROP TABLE Burial.Photo;`);
};
