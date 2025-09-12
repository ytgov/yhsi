// -- BEGIN TABLE dbo.Site_Status_CD
// IF OBJECT_ID('dbo.Site_Status_CD', 'U') IS NOT NULL
// DROP TABLE dbo.Site_Status_CD;
// GO

// CREATE TABLE dbo.Site_Status_CD (
// 	Site_Status_ID int NULL,
// 	Code int NULL,
// 	Description varchar(100) NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Site_Status_CD', (table) => {
		table.integer('Site_Status_ID').nullable();
		table.integer('Code').nullable();
		table.string('Description', 100).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Site_Status_CD');
};
