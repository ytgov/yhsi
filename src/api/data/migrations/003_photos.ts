// CREATE TABLE dbo.Photo (
// 	RowId uniqueidentifier NOT NULL,
// 	Id int NULL,
// 	PlaceId int NULL,
// 	[File] varbinary(max) NULL,
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
// 	Rating int NOT NULL,
// 	Subjects varchar(500) NULL,
// 	LegacyBatchInfo nvarchar(150) NULL,
// 	IsSiteDefault bit NOT NULL
// );
// GO

// ALTER TABLE dbo.Photo ADD CONSTRAINT PK_Image PRIMARY KEY (RowId);
// GO

import { OriginalMedia } from 'data/static-entities';
import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('photo', (table) => {
		// table.increments('Id').primary();
		table.integer('RowId').primary();
		table.integer('Id');
		table.integer('PlaceId');
		table.binary('File');
		table.string('OriginalFileName', 256);
		table.string('FeatureName', 600);
		table.integer('CommunityId').notNullable();
		table.string('NTSMapNumber', 20);
		table.string('Address', 600);
		table.date('DateCreated');
		table.string('YHSIRecord', 20);
		table.string('BordenRecord', 20);
		table.string('PaleoRecord', 20);
		table.string('ArchivalRecord', 20);
		table.boolean('IsOtherRecord').notNullable();
		table.integer('OriginalMediaId').notNullable();
		table.string('OriginalRecord', 256);
		table.integer('MediaStorage').notNullable();
		table.string('Comments');
		table.string('Caption', 256);
		table.integer('OwnerId').notNullable();
		table.integer('PhotoProjectId').notNullable();
		table.integer('Program').notNullable();
		table.string('Creator', 256);
		table.string('CommunityName', 256);
		table.string('Location', 256);
		table.integer('UsageRights');
		table.boolean('IsComplete').notNullable();
		table.integer('ImageHeight');
		table.integer('ImageWidth');
		table.integer('Rating').notNullable();
		table.string('Subjects', 500);
		table.string('LegacyBatchInfo', 150);
		table.boolean('IsSiteDefault').notNullable();
	});
	await knex.schema.createTable('PhotoOwner', (table) => {
		table.increments('Id').primary();
		table.string('Name', 256).nullable();
		table.string('Email', 256).nullable();
		table.string('Address', 256).nullable();
		table.string('Telephone', 256).nullable();
		table.string('ContactPerson', 256).nullable();
	});
	await knex.schema.createTable('OriginalMedia', (table) => {
		table.increments('Id').primary();
		table.string('Type', 256).notNullable();
	});
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTableIfExists('photo');
	await knex.schema.dropTableIfExists('PhotoOwner');
	await knex.schema.dropTableIfExists('OriginalMedia');
};
