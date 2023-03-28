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
	await knex.schema.createTable('Burial.Burial', (table) => {
		table.smallint('BurialID').primary();
		table.string('LastName', 200).nullable();
		table.string('FirstName', 255).nullable();
		table.string('Gender', 8).nullable();
		table.string('GenderOther', 100).nullable();
		table.smallint('BirthYear').nullable();
		table.tinyint('BirthMonth').nullable();
		table.tinyint('BirthDay').nullable();
		table.string('BirthDateNotes', 200).nullable();
		table.smallint('DeathYear').nullable();
		table.tinyint('DeathMonth').nullable();
		table.tinyint('DeathDay').nullable();
		table.string('DeathDateNotes', 200).nullable();
		table.string('Age', 10).nullable();
		table.string('Manner', 15).nullable();
		table.smallint('CauseID').nullable();
		table.smallint('CemetaryID').nullable();
		table.string('OtherCemetaryDesc', 200).nullable();
		table.string('PlotDescription', 200).nullable();
		table.string('ShippedIndicator', 1).nullable();
		table.string('DestinationShipped', 200).nullable();
		table.string('FuneralPaidBy', 200).nullable();
		table.string('OriginCity', 150).nullable();
		table.string('OriginState', 150).nullable();
		table.string('OriginCountry', 150).nullable();
		table.string('OtherCountry', 150).nullable();
		table.string('PersonNotes', 2000).nullable();
		table.smallint('ReligionID').nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.Burial');
};
