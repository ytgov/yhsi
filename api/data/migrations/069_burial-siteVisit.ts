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
	await knex.schema.createTable('Burial.SiteVisit', (table) => {
		table.increments('SiteVisitID').primary();
		table.integer('BurialID').notNullable();
		table.integer('VisitYear').notNullable();
		table.string('Condition', 10).nullable();
		table.string('MarkerDescription', 160).nullable();
		table.string('Inscription', 600).nullable();
		table.string('RecordedBy', 60).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.SiteVisit');
};
