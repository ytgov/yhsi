// -- BEGIN TABLE Place.AlternateName
// IF OBJECT_ID('Place.AlternateName', 'U') IS NOT NULL
// DROP TABLE Place.AlternateName;
// GO

// CREATE TABLE Place.AlternateName (
// 	PlaceID int NOT NULL,
// 	AlternateName varchar(255) NOT NULL,
// 	Id int NOT NULL IDENTITY(1,1)
// );
// GO

// ALTER TABLE Place.AlternateName ADD CONSTRAINT PK__Alternat__3214EC0722C106A5 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Place.AlternateName', (table) => {
		table.integer('PlaceID').notNullable();
		table.string('AlternateName', 255).notNullable();
		table.increments('Id').primary();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Place.AlternateName');
};
