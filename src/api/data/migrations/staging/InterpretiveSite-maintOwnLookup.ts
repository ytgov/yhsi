// -- BEGIN TABLE InterpretiveSite.MaintOwnLookup
// IF OBJECT_ID('InterpretiveSite.MaintOwnLookup', 'U') IS NOT NULL
// DROP TABLE InterpretiveSite.MaintOwnLookup;
// GO

// CREATE TABLE InterpretiveSite.MaintOwnLookup (
// 	MaintOwnLUpID smallint NOT NULL IDENTITY(1,1),
// 	MaintOwnName varchar(50) NOT NULL,
// 	MaintOwnNotes varchar(255) NULL
// );
// GO

// ALTER TABLE InterpretiveSite.MaintOwnLookup ADD CONSTRAINT PK__MaintOwn__0FF9C75D1892497E PRIMARY KEY (MaintOwnLUpID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('InterpretiveSite.MaintOwnLookup', (table) => {
		table.increments('MaintOwnLUpID').primary();
		table.string('MaintOwnName', 50).notNullable();
		table.string('MaintOwnNotes', 255).nullable();
	});

	await knex('InterpretiveSite.MaintOwnLookup').delete().whereRaw('1=1');
	await knex('InterpretiveSite.MaintOwnLookup').insert([
		{
			MaintOwnLUpID: 1,
			MaintOwnName: 'Tourism',
			MaintOwnNotes: 'Contact Becky',
		},
		{
			MaintOwnLUpID: 2,
			MaintOwnName: 'Highways',
			MaintOwnNotes: 'Contact regional offices',
		},
		{
			MaintOwnLUpID: 3,
			MaintOwnName: 'Environment',
			MaintOwnNotes: '',
		},
		{
			MaintOwnLUpID: 4,
			MaintOwnName: 'BC Government',
			MaintOwnNotes: 'Joe Smith (604)456-8789',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.MaintOwnLookup');
};