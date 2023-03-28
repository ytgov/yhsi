// -- BEGIN TABLE Place.PlaceHistory
// IF OBJECT_ID('Place.PlaceHistory', 'U') IS NOT NULL
// DROP TABLE Place.PlaceHistory;
// GO

// CREATE TABLE Place.PlaceHistory (
// 	PlaceId int NOT NULL,
// 	HistoryText varchar(max) NOT NULL,
// 	Reference varchar(2048) NULL DEFAULT (NULL),
// 	Restricted int NULL,
// 	Id int NOT NULL IDENTITY(1,1)
// );
// GO

// ALTER TABLE Place.PlaceHistory ADD CONSTRAINT PK__PlaceHis__3214EC07C4DEAE17 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Place.PlaceHistory', (table) => {
		table.integer('PlaceId').notNullable();
		table.string('HistoryText', 4000).notNullable();
		table.string('Reference', 2048).nullable().defaultTo(null);
		table.integer('Restricted').nullable();
		table.increments('Id').primary();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Place.PlaceHistory');
};
