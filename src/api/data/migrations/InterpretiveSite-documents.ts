// -- BEGIN TABLE InterpretiveSite.Documents
// IF OBJECT_ID('InterpretiveSite.Documents', 'U') IS NOT NULL
// DROP TABLE InterpretiveSite.Documents;
// GO

// CREATE TABLE InterpretiveSite.Documents (
// 	DocID smallint NOT NULL IDENTITY(1,1),
// 	ActionID smallint NULL,
// 	InspectID smallint NULL,
// 	SiteID smallint NULL,
// 	DocDesc varchar(140) NULL,
// 	UploadedBy varchar(50) NULL,
// 	UploadDate date NULL,
// 	Document varbinary(max) NULL,
// 	AssetID smallint NULL DEFAULT (NULL),
// 	FileType varchar(30) NULL
// );
// GO

// ALTER TABLE InterpretiveSite.Documents ADD CONSTRAINT PK__Document__3EF1888DAA25EC7C PRIMARY KEY (DocID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('InterpretiveSite.Documents', (table) => {
		table.increments('DocID').primary();
		table.integer('ActionID').nullable();
		table.integer('InspectID').nullable();
		table.integer('SiteID').nullable();
		table.string('DocDesc', 140).nullable();
		table.string('UploadedBy', 50).nullable();
		table.date('UploadDate').nullable();
		table.binary('Document').nullable();
		table.integer('AssetID').nullable();
		table.string('FileType', 30).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.Documents');
};
