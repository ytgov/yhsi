// -- BEGIN TABLE Place.FirstNationName
// IF OBJECT_ID('Place.FirstNationName', 'U') IS NOT NULL
// DROP TABLE Place.FirstNationName;
// GO

// CREATE TABLE Place.FirstNationName (
// 	PlaceId int NOT NULL,
// 	FNName varchar(64) NOT NULL,
// 	FNLanguage varchar(128) NULL DEFAULT (NULL),
// 	FNDesription varchar(255) NULL,
// 	Id int NOT NULL IDENTITY(1,1)
// );
// GO

// ALTER TABLE Place.FirstNationName ADD CONSTRAINT PK__FirstNat__3214EC076302D5B8 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Place.FirstNationName', (table) => {
		table.integer('PlaceId').notNullable();
		table.string('FNName', 64).notNullable();
		table.string('FNLanguage', 128).nullable().defaultTo(null);
		table.string('FNDesription', 255).nullable();
		table.increments('Id').primary();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Place.FirstNationName');
};
