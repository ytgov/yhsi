// -- BEGIN TABLE Boat.Owner
// IF OBJECT_ID('Boat.Owner', 'U') IS NOT NULL
// DROP TABLE Boat.Owner;
// GO

// CREATE TABLE Boat.Owner (
// 	Id int NOT NULL IDENTITY(1,1),
// 	OwnerName varchar(64) NOT NULL
// );
// GO

// ALTER TABLE Boat.Owner ADD CONSTRAINT PK__Owner__3214EC07BD1B459E PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Boat.Owner', (table) => {
		table.increments('Id').primary();
		table.string('OwnerName', 64).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Boat.Owner');
};
