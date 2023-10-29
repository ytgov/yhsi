// -- BEGIN TABLE Burial.NOKin
// IF OBJECT_ID('Burial.NOKin', 'U') IS NOT NULL
// DROP TABLE Burial.NOKin;
// GO

// CREATE TABLE Burial.NOKin (
// 	NOKID smallint NOT NULL IDENTITY(1,1),
// 	BurialID smallint NOT NULL,
// 	RelationshipID smallint NOT NULL,
// 	Quantity tinyint NULL,
// 	Name varchar(200) NULL,
// 	Location varchar(100) NULL
// );
// GO

// ALTER TABLE Burial.NOKin ADD CONSTRAINT PK__NOKin__05FA48A30A49EA48 PRIMARY KEY (NOKID);
// GO

//Burial Next of Kin

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.NOKin', (table) => {
		table.increments('NOKID').primary();
		table.integer('BurialID').notNullable();
		table.integer('RelationshipID').notNullable();
		table.integer('Quantity').nullable();
		table.string('Name', 200).nullable();
		table.string('Location', 100).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.NOKin');
};
