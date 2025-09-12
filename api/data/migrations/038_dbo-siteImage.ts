// -- BEGIN TABLE dbo.SiteImage
// IF OBJECT_ID('dbo.SiteImage', 'U') IS NOT NULL
// DROP TABLE dbo.SiteImage;
// GO

// CREATE TABLE dbo.SiteImage (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PlaceId int NULL,
// 	ImageTypeId int NULL,
// 	Caption nvarchar(256) NULL,
// 	ImageDescription nvarchar(256) NULL,
// 	FileName nvarchar(256) NULL,
// 	Copyright nvarchar(256) NULL,
// 	FileLocation nvarchar(256) NULL,
// 	ImagePath nvarchar(256) NULL,
// 	ThumbnailPath nvarchar(256) NULL,
// 	IsPrimary bit NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.SiteImage', (table) => {
		table.increments('Id').primary();
		table.integer('PlaceId').nullable();
		table.integer('ImageTypeId').nullable();
		table.string('Caption', 256).nullable();
		table.string('ImageDescription', 256).nullable();
		table.string('FileName', 256).nullable();
		table.string('Copyright', 256).nullable();
		table.string('FileLocation', 256).nullable();
		table.string('ImagePath', 256).nullable();
		table.string('ThumbnailPath', 256).nullable();
		table.boolean('IsPrimary').nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.SiteImage');
};
