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

	await knex('dbo.FirstNation').delete().whereRaw('1=1');
	await knex('dbo.FirstNation').insert([
		{
			Description: 'Carcross/Tagish',
		},
		{
			Description: 'Champagne/Aishihik',
		},
		{
			Description: 'Kaska Dena Nation',
		},
		{
			Description: 'Kluane',
		},
		{
			Description: 'Kwanlin Dun',
		},
		{
			Description: 'Liard First Nation',
		},
		{
			Description: 'Little Salmon/Carmacks',
		},
		{
			Description: 'Na-Cho Nyak Dun',
		},
		{
			Description: 'Ross River Dena',
		},
		{
			Description: 'Selkirk',
		},
		{
			Description: 'Taan Kwachan',
		},
		{
			Description: 'Teslin Tlingit',
		},
		{
			Description: 'Trondek Hwechin',
		},
		{
			Description: 'Vuntut Gwitchin',
		},
		{
			Description: 'White River',
		},
		{
			Description: 'Inuvialuit',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.FirstNation');
};
