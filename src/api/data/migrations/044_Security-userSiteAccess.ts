// -- BEGIN TABLE Security.UserSiteAccess
// IF OBJECT_ID('Security.UserSiteAccess', 'U') IS NOT NULL
// DROP TABLE Security.UserSiteAccess;
// GO

// CREATE TABLE Security.UserSiteAccess (
// 	id int NOT NULL IDENTITY(1,1),
// 	user_id int NOT NULL,
// 	access_type_id int NOT NULL,
// 	access_text nvarchar(150) NOT NULL
// );
// GO

// ALTER TABLE Security.UserSiteAccess ADD CONSTRAINT PK__UserSite__3213E83F01A4ED1C PRIMARY KEY (id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Security.UserSiteAccess', (table) => {
		table.increments('id').primary();
		table.integer('user_id').notNullable();
		table.integer('access_type_id').notNullable();
		table.string('access_text', 150).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Security.UserSiteAccess');
};
