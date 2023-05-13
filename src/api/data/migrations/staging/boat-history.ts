// -- BEGIN TABLE Boat.History
// IF OBJECT_ID('Boat.History', 'U') IS NOT NULL
// DROP TABLE Boat.History;
// GO

// CREATE TABLE Boat.History (
// 	UID int NULL,
// 	HistoryText nvarchar(max) NULL,
// 	Reference nvarchar(max) NULL,
// 	id int NOT NULL IDENTITY(1,1)
// );
// GO

// ALTER TABLE Boat.History ADD CONSTRAINT PK__History__3213E83FAE790F4D PRIMARY KEY (id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Boat.History', (table) => {
		table.integer('UID').nullable();
		table.string('HistoryText', 4000).nullable();
		table.string('Reference', 4000).nullable();
		table.increments('id').primary();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Boat.History');
};
