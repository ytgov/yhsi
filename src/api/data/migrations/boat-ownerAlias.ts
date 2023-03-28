// -- BEGIN TABLE Boat.OwnerAlias
// IF OBJECT_ID('Boat.OwnerAlias', 'U') IS NOT NULL
// DROP TABLE Boat.OwnerAlias;
// GO

// CREATE TABLE Boat.OwnerAlias (
// 	Id int NOT NULL IDENTITY(1,1),
// 	OwnerId int NOT NULL,
// 	Alias varchar(64) NOT NULL
// );
// GO

// ALTER TABLE Boat.OwnerAlias ADD CONSTRAINT PK__OwnerAli__3214EC07654D6C6C PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Boat.OwnerAlias', (table) => {
		table.increments('Id').primary();
		table.integer('OwnerId').notNullable();
		table.string('Alias', 64).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Boat.OwnerAlias');
};
