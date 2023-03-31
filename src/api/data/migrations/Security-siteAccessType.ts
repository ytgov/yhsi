// -- BEGIN TABLE Security.SiteAccessType
// IF OBJECT_ID('Security.SiteAccessType', 'U') IS NOT NULL
// DROP TABLE Security.SiteAccessType;
// GO

// CREATE TABLE Security.SiteAccessType (
// 	id int NOT NULL,
// 	name nvarchar(100) NOT NULL
// );
// GO

// ALTER TABLE Security.SiteAccessType ADD CONSTRAINT pk_SiteAccessType PRIMARY KEY (id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Security.SiteAccessType', (table) => {
		table.integer('id').notNullable();
		table.string('name', 100).notNullable();
	});

	await knex('Security.SiteAccessType').delete().whereRaw('1=1');
	await knex('Security.SiteAccessType').insert([
		{
			id: 1,
			name: 'Map Sheet',
		},
		{
			id: 2,
			name: 'Community',
		},
		{
			id: 3,
			name: 'First Nation',
		},
	]);
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Security.SiteAccessType');
};
