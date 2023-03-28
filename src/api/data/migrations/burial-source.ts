// -- BEGIN TABLE Burial.Source
// IF OBJECT_ID('Burial.Source', 'U') IS NOT NULL
// DROP TABLE Burial.Source;
// GO

// CREATE TABLE Burial.Source (
// 	SourceID smallint NOT NULL IDENTITY(1,1),
// 	BurialID smallint NOT NULL,
// 	Source varchar(200) NOT NULL
// );
// GO

// ALTER TABLE Burial.Source ADD CONSTRAINT PK__Source__16E019F95120B963 PRIMARY KEY (SourceID);
// GO
import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	knex.raw(`CREATE TABLE Burial.Source (
    	SourceID smallint NOT NULL IDENTITY(1,1),
      BurialID smallint NOT NULL,
      Source varchar(200) NOT NULL
    );
    ALTER TABLE Burial.Source ADD CONSTRAINT PK__Source__16E019F95120B963 PRIMARY KEY (SourceID);
    `);
};
exports.down = async function (knex: Knex, Promise: any) {
	knex.raw(`DROP TABLE Burial.Source;`);
};
