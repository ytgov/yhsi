// -- BEGIN TABLE dbo.Prod_Photo_List
// IF OBJECT_ID('dbo.Prod_Photo_List', 'U') IS NOT NULL
// DROP TABLE dbo.Prod_Photo_List;
// GO

// CREATE TABLE dbo.Prod_Photo_List (
// 	Id int NULL,
// 	OriginalFileName nvarchar(256) NULL,
// 	FeatureName nvarchar(600) NULL,
// 	YHSIRecord nvarchar(20) NULL,
// 	IsComplete bit NOT NULL,
// 	PhotoProjectId int NOT NULL,
// 	OriginalMediaId int NOT NULL,
// 	CommunityId int NOT NULL,
// 	PlaceId int NULL,
// 	OwnerId int NOT NULL,
// 	Subjects varchar(500) NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Prod_Photo_List', (table) => {
		table.integer('Id').nullable();
		table.string('OriginalFileName', 256).nullable();
		table.string('FeatureName', 600).nullable();
		table.string('YHSIRecord', 20).nullable();
		table.boolean('IsComplete').notNullable();
		table.integer('PhotoProjectId').notNullable();
		table.integer('OriginalMediaId').notNullable();
		table.integer('CommunityId').notNullable();
		table.integer('PlaceId').nullable();
		table.integer('OwnerId').notNullable();
		table.string('Subjects', 500).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Prod_Photo_List');
};
