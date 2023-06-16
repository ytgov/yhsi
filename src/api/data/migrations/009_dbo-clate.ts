// - BEGIN TABLE dbo.clate$
// IF OBJECT_ID('dbo.[clate$]', 'U') IS NOT NULL
// DROP TABLE dbo.[clate$];
// GO

// CREATE TABLE dbo.[clate$] (
// 	YACSI nvarchar(255) NULL,
// 	Latitude float(8) NULL,
// 	Longitude float(8) NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.[clate$]', (table) => {
		table.string('YACSI', 255).nullable();
		table.float('Latitude').nullable();
		table.float('Longitude').nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.[clate$]');
};
