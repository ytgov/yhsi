// -- BEGIN TABLE AirCrash.InfoSource
// IF OBJECT_ID('AirCrash.InfoSource', 'U') IS NOT NULL
// DROP TABLE AirCrash.InfoSource;
// GO

// CREATE TABLE AirCrash.InfoSource (
// 	Id int NOT NULL IDENTITY(1,1),
// 	YACSINumber nvarchar(256) NULL,
// 	Source nvarchar(250) NULL,
// 	[Type] nvarchar(10) NULL
// );
// GO

// ALTER TABLE AirCrash.InfoSource ADD CONSTRAINT PK__InfoSour__3214EC0727D30A85 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('AirCrash.InfoSource', (table) => {
		table.increments('Id').primary();
		table.string('YACSINumber', 256).nullable();
		table.string('Source', 250).nullable();
		table.string('Type', 10).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('AirCrash.InfoSource');
};
