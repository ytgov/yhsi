// -- BEGIN TABLE dbo.PhotoBatch
// IF OBJECT_ID('dbo.PhotoBatch', 'U') IS NOT NULL
// DROP TABLE dbo.PhotoBatch;
// GO

// CREATE TABLE dbo.PhotoBatch (
// 	Id int NOT NULL IDENTITY(1,1),
// 	Name nvarchar(100) NOT NULL,
// 	UserId int NOT NULL,
// 	DateCreated datetime NULL,
// 	PlaceId int NULL,
// 	CommunityId int NULL,
// 	NTSMapNumber nvarchar(20) NULL,
// 	Address nvarchar(600) NULL,
// 	YHSIRecord nvarchar(20) NULL,
// 	BordenRecord nvarchar(20) NULL,
// 	PaleoRecord nvarchar(20) NULL,
// 	ArchivalRecord nvarchar(20) NULL,
// 	IsOtherRecord bit NOT NULL DEFAULT (0),
// 	OriginalMediaId int NULL,
// 	OriginalRecord nvarchar(256) NULL,
// 	MediaStorage int NULL,
// 	Comments nvarchar(max) NULL,
// 	Caption nvarchar(256) NULL,
// 	Copyright int NULL,
// 	CreditLine nvarchar(256) NULL,
// 	OwnerId int NULL,
// 	PhotoProjectId int NULL,
// 	Program int NULL,
// 	Creator nvarchar(256) NULL,
// 	CommunityName nvarchar(256) NULL,
// 	Location nvarchar(256) NULL,
// 	UsageRights int NULL,
// 	IsComplete bit NOT NULL DEFAULT (0),
// 	Subjects varchar(500) NULL,
// 	isPrivate bit NOT NULL DEFAULT (0)
// );
// GO

// ALTER TABLE dbo.PhotoBatch ADD CONSTRAINT PK__YHS_Phot__3214EC07D8910904 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.PhotoBatch', (table) => {
		table.increments('Id').primary();
		table.string('Name', 100).notNullable();
		table.integer('UserId').notNullable();
		table.dateTime('DateCreated').nullable();
		table.integer('PlaceId').nullable();
		table.integer('CommunityId').nullable();
		table.string('NTSMapNumber', 20).nullable();
		table.string('Address', 600).nullable();
		table.string('YHSIRecord', 20).nullable();
		table.string('BordenRecord', 20).nullable();
		table.string('PaleoRecord', 20).nullable();
		table.string('ArchivalRecord', 20).nullable();
		table.boolean('IsOtherRecord').notNullable();
		table.integer('OriginalMediaId').nullable();
		table.string('OriginalRecord', 256).nullable();
		table.integer('MediaStorage').nullable();
		table.text('Comments').nullable();
		table.string('Caption', 256).nullable();
		table.integer('Copyright').nullable();
		table.string('CreditLine', 256).nullable();
		table.integer('OwnerId').nullable();
		table.integer('PhotoProjectId').nullable();
		table.integer('Program').nullable();
		table.string('Creator', 256).nullable();
		table.string('CommunityName', 256).nullable();
		table.string('Location', 256).nullable();
		table.integer('UsageRights').nullable();
		table.boolean('IsComplete').notNullable();
		table.string('Subjects', 500).nullable();
		table.boolean('isPrivate').notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.PhotoBatch');
};
