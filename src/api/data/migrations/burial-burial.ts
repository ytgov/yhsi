// -- BEGIN TABLE Burial.Burial
// IF OBJECT_ID('Burial.Burial', 'U') IS NOT NULL
// DROP TABLE Burial.Burial;
// GO

// CREATE TABLE Burial.Burial (
// BurialID smallint NOT NULL IDENTITY(1,1),
// LastName varchar(200) NULL,
// FirstName varchar(255) NULL,
// Gender varchar(8) NULL,
// GenderOther varchar(100) NULL,
// BirthYear smallint NULL,
// BirthMonth tinyint NULL,
// BirthDay tinyint NULL,
// BirthDateNotes varchar(200) NULL,
// DeathYear smallint NULL,
// DeathMonth tinyint NULL,
// DeathDay tinyint NULL,
// DeathDateNotes varchar(200) NULL,
// Age varchar(10) NULL,
// Manner varchar(15) NULL,
// CauseID smallint NULL,
// CemetaryID smallint NULL,
// OtherCemetaryDesc varchar(200) NULL,
// PlotDescription varchar(200) NULL,
// ShippedIndicator varchar(1) NULL,
// DestinationShipped varchar(200) NULL,
// FuneralPaidBy varchar(200) NULL,
// OriginCity varchar(150) NULL,
// OriginState varchar(150) NULL,
// OriginCountry varchar(150) NULL,
// OtherCountry varchar(150) NULL,
// PersonNotes varchar(2000) NULL,
// ReligionID smallint NULL
// );
// GO

// ALTER TABLE Burial.Burial ADD CONSTRAINT PK_BurialID PRIMARY KEY (BurialID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	knex.raw(`CREATE TABLE Burial.Burial (
    	BurialID smallint NOT NULL IDENTITY(1,1),
      LastName varchar(200) NULL,
      FirstName varchar(255) NULL,
      Gender varchar(8) NULL,
      GenderOther varchar(100) NULL,
      BirthYear smallint NULL,
      BirthMonth tinyint NULL,
      BirthDay tinyint NULL,
      BirthDateNotes varchar(200) NULL,
      DeathYear smallint NULL,
      DeathMonth tinyint NULL,
      DeathDay tinyint NULL,
      DeathDateNotes varchar(200) NULL,
      Age varchar(10) NULL,
      Manner varchar(15) NULL,
      CauseID smallint NULL,
      CemetaryID smallint NULL,
      OtherCemetaryDesc varchar(200) NULL,
      PlotDescription varchar(200) NULL,
      ShippedIndicator varchar(1) NULL,
      DestinationShipped varchar(200) NULL,
      FuneralPaidBy varchar(200) NULL,
      OriginCity varchar(150) NULL,
      OriginState varchar(150) NULL,
      OriginCountry varchar(150) NULL,
      OtherCountry varchar(150) NULL,
      PersonNotes varchar(2000) NULL,
      ReligionID smallint NULL
    )
    ALTER TABLE Burial.Burial ADD CONSTRAINT PK_BurialID PRIMARY KEY (BurialID);
    `);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.raw(`DROP TABLE Burial.Burial;`);
};
