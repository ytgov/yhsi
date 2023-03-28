// -- BEGIN TABLE Burial.SiteVisit
// IF OBJECT_ID('Burial.SiteVisit', 'U') IS NOT NULL
// DROP TABLE Burial.SiteVisit;
// GO

// CREATE TABLE Burial.SiteVisit (
// 	SiteVisitID smallint NOT NULL IDENTITY(1,1),
// 	BurialID smallint NOT NULL,
// 	VisitYear smallint NOT NULL,
// 	[Condition] varchar(10) NULL,
// 	MarkerDescription varchar(160) NULL,
// 	Inscription varchar(600) NULL,
// 	RecordedBy varchar(60) NULL
// );
// GO

// ALTER TABLE Burial.SiteVisit ADD CONSTRAINT PK__SiteVisi__B2D065E5581167AD PRIMARY KEY (SiteVisitID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	knex.raw(`CREATE TABLE Burial.SiteVisit (
    	SiteVisitID smallint NOT NULL IDENTITY(1,1),
      BurialID smallint NOT NULL,
      VisitYear smallint NOT NULL,
      [Condition] varchar(10) NULL,
      MarkerDescription varchar(160) NULL,
      Inscription varchar(600) NULL,
      RecordedBy varchar(60) NULL
    );
    ALTER TABLE Burial.SiteVisit ADD CONSTRAINT PK__SiteVisi__B2D065E5581167AD PRIMARY KEY (SiteVisitID);
    `);
};
exports.down = async function (knex: Knex, Promise: any) {
	knex.raw(`DROP TABLE Burial.SiteVisit;`);
};
