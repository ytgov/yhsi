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
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Security.SiteAccessType');
};
