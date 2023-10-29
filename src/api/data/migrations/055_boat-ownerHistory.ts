// -- BEGIN TABLE Boat.OwnerHistory
// IF OBJECT_ID('Boat.OwnerHistory', 'U') IS NOT NULL
// DROP TABLE Boat.OwnerHistory;
// GO

// CREATE TABLE Boat.OwnerHistory (
// 	Id int NOT NULL IDENTITY(1,1),
// 	OwnerId int NOT NULL,
// 	HistoryText varchar(4096) NOT NULL,
// 	Reference varchar(256) NOT NULL
// );
// GO

// ALTER TABLE Boat.OwnerHistory ADD CONSTRAINT PK__OwnerHis__3214EC07C47E9BC6 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Boat.OwnerHistory', (table) => {
		table.increments('Id').primary();
		table.integer('OwnerId').notNullable();
		table.text('HistoryText').notNullable();
		table.string('Reference', 256).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Boat.OwnerHistory');
};
