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
			Id: 1,
			Description: 'Carcross/Tagish',
		},
		{
			Id: 2,
			Description: 'Champagne/Aishihik',
		},
		{
			Id: 3,
			Description: 'Kaska Dena Nation',
		},
		{
			Id: 4,
			Description: 'Kluane',
		},
		{
			Id: 5,
			Description: 'Kwanlin Dun',
		},
		{
			Id: 6,
			Description: 'Liard First Nation',
		},
		{
			Id: 7,
			Description: 'Little Salmon/Carmacks',
		},
		{
			Id: 8,
			Description: 'Na-Cho Nyak Dun',
		},
		{
			Id: 9,
			Description: 'Ross River Dena',
		},
		{
			Id: 10,
			Description: 'Selkirk',
		},
		{
			Id: 11,
			Description: 'Taan Kwachan',
		},
		{
			Id: 12,
			Description: 'Teslin Tlingit',
		},
		{
			Id: 13,
			Description: 'Trondek Hwechin',
		},
		{
			Id: 14,
			Description: 'Vuntut Gwitchin',
		},
		{
			Id: 15,
			Description: 'White River',
		},
		{
			Id: 16,
			Description: 'Inuvialuit',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.FirstNation');
};
