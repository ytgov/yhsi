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
	await knex.raw(`CREATE TABLE AirCrash.InfoSource (
    Id int NOT NULL IDENTITY(1,1),
    YACSINumber nvarchar(256) NULL,
    Source nvarchar(250) NULL,
    [Type] nvarchar(10) NULL
  );
    `);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.raw(`DROP TABLE AirCrash.InfoSource;`);
};
