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
	await knex.schema.createTable('AirCrash.AirCrash', (table) => {
		table.string('YACSINumber', 256).notNullable();
		table.dateTime('CrashDate').nullable();
		table.string('AircraftType', 255).nullable();
		table.string('AircraftRegistration', 255).nullable();
		table.string('Nation', 25).nullable();
		table.string('MilitaryCivilian', 25).nullable();
		table.string('CrashLocation', 255).nullable();
		table.integer('RemainsonSite').nullable();
		table.string('ExtentofRemainsonSite', 255).nullable();
		table.string('OtherLocationsofRemains', 255).nullable();
		table.string('Pilot', 255).nullable();
		table.integer('Fatalities').nullable();
		table.string('DescriptionofCrashEvent', 255).nullable();
		table.text('Comments').nullable();
		table.text('SignificanceofAircraft').nullable();
		table.string('Sources', 255).nullable();
		table.string('Photographs', 255).nullable();
		table.string('InYukon', 255).nullable();
		table.integer('SoulsonBoard').nullable();
		table.integer('Injuries').nullable();
		table.string('Accuracy', 255).nullable();
		table.string('AircraftCaption', 255).nullable();
		table.string('AircraftafterCrashCaption', 255).nullable();
		table.specificType('Location', 'geography').nullable();
		table.specificType('LocationText', 'varchar(255)').nullable();
		table.string('DateDescriptor', 10).nullable();
		table.string('DateNote', 140).nullable();
		table.string('PilotLastName', 50).nullable();
		table.string('PilotFirstName', 50).nullable();
		table.string('PilotRank', 50).nullable();
	});
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('AirCrash.AirCrash');
};
