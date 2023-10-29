// -- BEGIN TABLE dbo.BoatEntity
// IF OBJECT_ID('dbo.BoatEntity', 'U') IS NOT NULL
// DROP TABLE dbo.BoatEntity;
// GO

// CREATE TABLE dbo.BoatEntity (
// 	Boat uniqueidentifier NOT NULL DEFAULT (newid()),
// 	UID int NULL,
// 	SysStartTime datetime2(7) NOT NULL DEFAULT (sysutcdatetime()),
// 	SysEndTime datetime2(7) NOT NULL DEFAULT (CONVERT([datetime2],'9999-12-31 23:59:59.9999999'))
// );
// GO

// ALTER TABLE dbo.BoatEntity ADD CONSTRAINT BoatEntity_pk PRIMARY KEY (Boat);
// GO

// -- Table dbo.BoatEntity contains no data. No inserts have been genrated.
// -- END TABLE dbo.BoatEntity

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.BoatEntity', (table) => {
		table.increments('Boat').primary();
		table.integer('UID').notNullable();
		table.string('SysStartTime').notNullable();
		table.string('SysEndTime').notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.BoatEntity');
};
