// -- BEGIN TABLE Place.Place
// IF OBJECT_ID('Place.Place', 'U') IS NOT NULL
// DROP TABLE Place.Place;
// GO

// CREATE TABLE Place.Place (
// 	Name varchar(255) NOT NULL,
// 	LocationDesc varchar(512) NULL,
// 	Latitude float(8) NULL,
// 	Longitude float(8) NULL,
// 	MapSheet varchar(25) NULL,
// 	Notes varchar(512) NULL,
// 	Accuracy varchar(30) NULL,
// 	Id int NOT NULL IDENTITY(1,1)
// );
// GO

// ALTER TABLE Place.Place ADD CONSTRAINT PK__Place__3214EC0728EFBE21 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';

exports.up = async function (knex: Knex) {
	await knex.raw(
		/* sql */ "IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Place') BEGIN EXEC('CREATE SCHEMA [Place]') END"
	);

	await knex.schema.createTable('Place.Place', (table) => {
		table.string('Name', 255).notNullable();
		table.string('LocationDesc', 512).nullable();
		table.float('Latitude', 8).nullable();
		table.float('Longitude', 8).nullable();
		table.string('MapSheet', 25).nullable();
		table.string('Notes', 512).nullable();
		table.string('Accuracy', 30).nullable();
		table.increments('Id').primary();
	});
};

exports.down = async function (knex: Knex) {
	await knex.schema.dropTable('Place.Place');
};
