// -- BEGIN TABLE dbo.Statute
// IF OBJECT_ID('dbo.Statute', 'U') IS NOT NULL
// DROP TABLE dbo.Statute;
// GO

// CREATE TABLE dbo.Statute (
// 	Id int NOT NULL IDENTITY(1,1),
// 	RecognitionAuthority nvarchar(256) NULL,
// 	RecognitionType nvarchar(256) NULL,
// 	Description nvarchar(256) NULL,
// 	AllStatute nvarchar(256) NULL
// );
// GO

// ALTER TABLE dbo.Statute ADD CONSTRAINT PK_Statute PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Statute', (table) => {
		table.increments('Id').primary();
		table.string('RecognitionAuthority', 256).nullable();
		table.string('RecognitionType', 256).nullable();
		table.string('Description', 256).nullable();
		table.string('AllStatute', 256).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Statute');
};
