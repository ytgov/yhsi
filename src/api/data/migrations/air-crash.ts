// -- BEGIN TABLE AirCrash.AirCrash
// IF OBJECT_ID('AirCrash.AirCrash', 'U') IS NOT NULL
// DROP TABLE AirCrash.AirCrash;
// GO

// CREATE TABLE AirCrash.AirCrash (
// 	YACSINumber nvarchar(256) NOT NULL,
// 	CrashDate datetime2(7) NULL,
// 	AircraftType nvarchar(255) NULL,
// 	AircraftRegistration nvarchar(255) NULL,
// 	Nation nvarchar(25) NULL,
// 	MilitaryCivilian nvarchar(25) NULL,
// 	CrashLocation nvarchar(255) NULL,
// 	RemainsonSite int NULL,
// 	ExtentofRemainsonSite nvarchar(255) NULL,
// 	OtherLocationsofRemains nvarchar(255) NULL,
// 	Pilot nvarchar(255) NULL,
// 	Fatalities int NULL,
// 	DescriptionofCrashEvent nvarchar(255) NULL,
// 	Comments nvarchar(max) NULL,
// 	SignificanceofAircraft nvarchar(max) NULL,
// 	Sources nvarchar(255) NULL,
// 	Photographs nvarchar(255) NULL,
// 	InYukon nvarchar(255) NULL,
// 	SoulsonBoard int NULL,
// 	Injuries int NULL,
// 	Accuracy nvarchar(255) NULL,
// 	AircraftCaption nvarchar(255) NULL,
// 	AircraftafterCrashCaption nvarchar(255) NULL,
// 	Location geography NULL,
// 	LocationText AS ([Location].[STAsText]()),
// 	DateDescriptor varchar(10) NULL,
// 	DateNote varchar(140) NULL,
// 	PilotLastName varchar(50) NULL,
// 	PilotFirstName varchar(50) NULL,
// 	PilotRank varchar(50) NULL
// );
// GO

// ALTER TABLE AirCrash.AirCrash ADD CONSTRAINT PK__AirCrash__BE355E4365A9F75C PRIMARY KEY (YACSINumber);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.raw(`CREATE TABLE AirCrash.AirCrash (
  YACSINumber nvarchar(256) NOT NULL,
  CrashDate datetime2(7) NULL,
  AircraftType nvarchar(255) NULL,
  AircraftRegistration nvarchar(255) NULL,
  Nation nvarchar(25) NULL,
  MilitaryCivilian nvarchar(25) NULL,
  CrashLocation nvarchar(255) NULL,
  RemainsonSite int NULL,
  ExtentofRemainsonSite nvarchar(255) NULL,
  OtherLocationsofRemains nvarchar(255) NULL,
  Pilot nvarchar(255) NULL,
  Fatalities int NULL,
  DescriptionofCrashEvent nvarchar(255) NULL,
  Comments nvarchar(max) NULL,
  SignificanceofAircraft nvarchar(max) NULL,
  Sources nvarchar(255) NULL,
  Photographs nvarchar(255) NULL,
  InYukon nvarchar(255) NULL,
  SoulsonBoard int NULL,
  Injuries int NULL,
  Accuracy nvarchar(255) NULL,
  AircraftCaption nvarchar(255) NULL,
  AircraftafterCrashCaption nvarchar(255) NULL,
  Location geography NULL,
  LocationText AS ([Location].[STAsText]()),
  DateDescriptor varchar(10) NULL,
  DateNote varchar(140) NULL,
  PilotLastName varchar(50) NULL,
  PilotFirstName varchar(50) NULL,
  PilotRank varchar(50) NULL
);`);
	await knex.raw(
		`ALTER TABLE AirCrash.AirCrash ADD CONSTRAINT PK__AirCrash__BE355E4365A9F75C PRIMARY KEY (YACSINumber);`
	);
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.raw(`DROP TABLE AirCrash.AirCrash;`);
};
