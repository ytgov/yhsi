// -- BEGIN TABLE dbo.Photo_Missing
// IF OBJECT_ID('dbo.Photo_Missing', 'U') IS NOT NULL
// DROP TABLE dbo.Photo_Missing;
// GO

// CREATE TABLE dbo.Photo_Missing (
// 	RowId uniqueidentifier NOT NULL DEFAULT (newid()),
// 	Id int NULL,
// 	PlaceId int NULL,
// 	OriginalFileName nvarchar(256) NULL,
// 	FeatureName nvarchar(600) NULL,
// 	CommunityId int NOT NULL,
// 	NTSMapNumber nvarchar(20) NULL,
// 	Address nvarchar(600) NULL,
// 	DateCreated date NULL,
// 	YHSIRecord nvarchar(20) NULL,
// 	BordenRecord nvarchar(20) NULL,
// 	PaleoRecord nvarchar(20) NULL,
// 	ArchivalRecord nvarchar(20) NULL,
// 	IsOtherRecord bit NOT NULL,
// 	OriginalMediaId int NOT NULL,
// 	OriginalRecord nvarchar(256) NULL,
// 	MediaStorage int NOT NULL,
// 	Comments nvarchar(max) NULL,
// 	Caption nvarchar(256) NULL,
// 	Copyright int NOT NULL,
// 	CreditLine nvarchar(256) NULL,
// 	OwnerId int NOT NULL,
// 	PhotoProjectId int NOT NULL,
// 	Program int NOT NULL,
// 	Creator nvarchar(256) NULL,
// 	CommunityName nvarchar(256) NULL,
// 	Location nvarchar(256) NULL,
// 	UsageRights int NULL,
// 	IsComplete bit NOT NULL,
// 	ImageHeight int NULL,
// 	ImageWidth int NULL,
// 	Subjects varchar(500) NULL,
// 	Rating int NULL
// );
// GO

// ALTER TABLE dbo.Photo_Missing ADD CONSTRAINT [PK_Image-old] PRIMARY KEY (RowId);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Photo_Missing', (table) => {
		table.integer('Id').nullable();
		table.integer('PlaceId').nullable();
		table.string('OriginalFileName', 256).nullable();
		table.string('FeatureName', 600).nullable();
		table.integer('CommunityId').notNullable();
		table.string('NTSMapNumber', 20).nullable();
		table.string('Address', 600).nullable();
		table.date('DateCreated').nullable();
		table.string('YHSIRecord', 20).nullable();
		table.string('BordenRecord', 20).nullable();
		table.string('PaleoRecord', 20).nullable();
		table.string('ArchivalRecord', 20).nullable();
		table.boolean('IsOtherRecord').notNullable();
		table.integer('OriginalMediaId').notNullable();
		table.string('OriginalRecord', 256).nullable();
		table.integer('MediaStorage').notNullable();
		table.text('Comments').nullable();
		table.string('Caption', 256).nullable();
		table.integer('Copyright').notNullable();
		table.string('CreditLine', 256).nullable();
		table.integer('OwnerId').notNullable();
		table.integer('PhotoProjectId').notNullable();
		table.integer('Program').notNullable();
		table.string('Creator', 256).nullable();
		table.string('CommunityName', 256).nullable();
		table.string('Location', 256).nullable();
		table.integer('UsageRights').nullable();
		table.boolean('IsComplete').notNullable();
		table.integer('ImageHeight').nullable();
		table.integer('ImageWidth').nullable();
		table.string('Subjects', 500).nullable();
		table.integer('Rating').nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Photo_Missing');
};
