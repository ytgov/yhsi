// -- BEGIN TABLE Burial.Membership
// IF OBJECT_ID('Burial.Membership', 'U') IS NOT NULL
// DROP TABLE Burial.Membership;
// GO

// CREATE TABLE Burial.Membership (
// 	ID smallint NOT NULL IDENTITY(1,1),
// 	BurialID smallint NOT NULL,
// 	MembershipID smallint NOT NULL,
// 	Chapter varchar(100) NULL,
// 	Notes varchar(255) NULL
// );
// GO

// ALTER TABLE Burial.Membership ADD CONSTRAINT PK__Membersh__3214EC27FA61DFAB PRIMARY KEY (ID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.Membership', (table) => {
		table.increments('ID').primary();
		table.integer('BurialID').notNullable();
		table.integer('MembershipID').notNullable();
		table.string('Chapter', 100).nullable();
		table.string('Notes', 255).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.Membership');
};
