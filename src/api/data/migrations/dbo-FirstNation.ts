// -- BEGIN TABLE dbo.FirstNation
// IF OBJECT_ID('dbo.FirstNation', 'U') IS NOT NULL
// DROP TABLE dbo.FirstNation;
// GO

// CREATE TABLE dbo.FirstNation (
// 	Id int NOT NULL IDENTITY(1,1),
// 	Description nvarchar(256) NULL
// );
// GO

// ALTER TABLE dbo.FirstNation ADD CONSTRAINT PK_FirstNation PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.FirstNation', (table) => {
		table.increments('Id').primary();
		table.string('Description', 256).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.FirstNation');
};
