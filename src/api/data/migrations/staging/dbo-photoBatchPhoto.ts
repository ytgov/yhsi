// -- BEGIN TABLE dbo.PhotoBatchPhoto
// IF OBJECT_ID('dbo.PhotoBatchPhoto', 'U') IS NOT NULL
// DROP TABLE dbo.PhotoBatchPhoto;
// GO

// CREATE TABLE dbo.PhotoBatchPhoto (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PhotoBatchId int NOT NULL,
// 	PhotoFile varbinary(max) NULL,
// 	PhotoFileName nvarchar(200) NOT NULL,
// 	PhotoContentType nvarchar(100) NOT NULL,
// 	ThumbFile varbinary(max) NULL
// );
// GO

// ALTER TABLE dbo.PhotoBatchPhoto ADD CONSTRAINT PK__YHS_Phot__3214EC076E3FF4E7 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.PhotoBatchPhoto', (table) => {
		table.increments('Id').primary();
		table.integer('PhotoBatchId').notNullable();
		table.binary('PhotoFile').nullable();
		table.string('PhotoFileName', 200).notNullable();
		table.string('PhotoContentType', 100).notNullable();
		table.binary('ThumbFile').nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.PhotoBatchPhoto');
};
