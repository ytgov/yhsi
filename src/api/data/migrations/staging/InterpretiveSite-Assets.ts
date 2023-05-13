// -- BEGIN TABLE InterpretiveSite.Assets
// IF OBJECT_ID('InterpretiveSite.Assets', 'U') IS NOT NULL
// DROP TABLE InterpretiveSite.Assets;
// GO

// CREATE TABLE InterpretiveSite.Assets (
// 	AssetID smallint NOT NULL IDENTITY(1,1),
// 	SiteID smallint NOT NULL,
// 	Category varchar(30) NULL,
// 	[Type] varchar(100) NULL,
// 	[Size] varchar(40) NULL,
// 	Description varchar(500) NULL,
// 	SignText nvarchar(max) NULL,
// 	InstallDate date NULL,
// 	DecommissionDate date NULL,
// 	DecommissionNotes varchar(255) NULL,
// 	Status varchar(30) NULL
// );
// GO

// ALTER TABLE InterpretiveSite.Assets ADD CONSTRAINT PK__Assets__43492372AF7A63F0 PRIMARY KEY (AssetID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('InterpretiveSite.Assets', (table) => {
		table.increments('AssetID').primary();
		table.integer('SiteID').notNullable();
		table.string('Category', 30).nullable();
		table.string('Type', 100).nullable();
		table.string('Size', 40).nullable();
		table.string('Description', 500).nullable();
		table.string('SignText', 255).nullable();
		table.date('InstallDate').nullable();
		table.date('DecommissionDate').nullable();
		table.string('DecommissionNotes', 255).nullable();
		table.string('Status', 30).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.Assets');
};
