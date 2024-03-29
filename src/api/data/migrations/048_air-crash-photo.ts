// -- BEGIN TABLE AirCrash.Photo
// IF OBJECT_ID('AirCrash.Photo', 'U') IS NOT NULL
// DROP TABLE AirCrash.Photo;
// GO

// CREATE TABLE AirCrash.Photo (
// 	Id int NOT NULL IDENTITY(1,1),
// 	YACSINumber nvarchar(256) NULL,
// 	Photo_RowID nvarchar(255) NULL
// );
// GO

// ALTER TABLE AirCrash.Photo ADD CONSTRAINT PK__PhotoTES__3214EC0757C39966 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('AirCrash.Photo', (table) => {
		table.increments('Id').primary();
		table.string('YACSINumber', 256).nullable();
		table.string('Photo_RowID', 255).nullable();
	});
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('AirCrash.Photo');
};
