// -- BEGIN TABLE dbo.Community
// IF OBJECT_ID('dbo.Community', 'U') IS NOT NULL
// DROP TABLE dbo.Community;
// GO

// CREATE TABLE dbo.Community (
// 	Id int NOT NULL IDENTITY(1,1),
// 	Name nvarchar(256) NOT NULL
// );
// GO

// ALTER TABLE dbo.Community ADD CONSTRAINT PK_Comunity PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Community', (table) => {
		table.increments('Id').primary();
		table.string('Name', 256).notNullable();
	});

	await knex('dbo.Community').delete().whereRaw('1=1');
	await knex('dbo.Community').insert([
		{
			Name: 'Aishihik',
		},
		{
			Name: 'Ballarat Creek',
		},
		{
			Name: 'Beaver Creek',
		},
		{
			Name: 'Big Salmon',
		},
		{
			Name: 'Britannia Creek',
		},
		{
			Name: 'Brooks Brook',
		},
		{
			Name: 'Burwash',
		},
		{
			Name: 'Canol Road',
		},
		{
			Name: 'Canyon Creek',
		},
		{
			Name: 'Carcross',
		},
		{
			Name: 'Carcross Road',
		},
		{
			Name: 'Carlisle Creek',
		},
		{
			Name: 'Carmacks',
		},
		{
			Name: 'Casino Creek',
		},
		{
			Name: 'Champagne',
		},
		{
			Name: 'Coffee Creek',
		},
		{
			Name: 'Conrad',
		},
		{
			Name: 'Dalton Post',
		},
		{
			Name: 'Dawson City',
		},
		{
			Name: 'Destruction Bay',
		},
		{
			Name: 'Donjek',
		},
		{
			Name: 'Elsa',
		},
		{
			Name: 'Faro',
		},
		{
			Name: 'Fort Reliance',
		},
		{
			Name: 'Fort Selkirk',
		},
		{
			Name: 'Forty Mile',
		},
		{
			Name: 'Granville',
		},
		{
			Name: 'Haines Junction',
		},
		{
			Name: 'Herschel Island',
		},
		{
			Name: 'Highet Creek',
		},
		{
			Name: 'Hootalinqua',
		},
		{
			Name: 'Jakes Corner',
		},
		{
			Name: 'Johnsons Crossing',
		},
		{
			Name: 'Keno',
		},
		{
			Name: 'Keno 700',
		},
		{
			Name: 'Klukshu',
		},
		{
			Name: 'Little Salmon',
		},
		{
			Name: 'Livingstone',
		},
		{
			Name: 'Lorne Mountain',
		},
		{
			Name: 'Lower Laberge',
		},
		{
			Name: 'Mackeno',
		},
		{
			Name: 'Marsh Lake',
		},
		{
			Name: 'Mayo',
		},
		{
			Name: 'Minto',
		},
		{
			Name: 'Moosehide',
		},
		{
			Name: 'None',
		},
		{
			Name: 'North Fork',
		},
		{
			Name: 'Ogilvie',
		},
		{
			Name: 'Old Crow',
		},
		{
			Name: 'Old Mayo Indian Village',
		},
		{
			Name: 'Old Ross River',
		},
		{
			Name: 'Pelly Crossing',
		},
		{
			Name: 'Pelly Farm',
		},
		{
			Name: 'Pelly Farm - Stepping Stone',
		},
		{
			Name: 'Rampart House',
		},
		{
			Name: 'Robinson',
		},
		{
			Name: 'Ross River',
		},
		{
			Name: 'Ruby 400',
		},
		{
			Name: 'Selwyn',
		},
		{
			Name: 'Seventeen Mile Wood Camp',
		},
		{
			Name: 'Sheep Creek',
		},
		{
			Name: 'Sheep Mountain',
		},
		{
			Name: 'Silver City',
		},
		{
			Name: 'Sister Island',
		},
		{
			Name: 'Snag',
		},
		{
			Name: 'Stewart Island',
		},
		{
			Name: 'Swift River',
		},
		{
			Name: 'Tagish',
		},
		{
			Name: 'Teslin',
		},
		{
			Name: 'Upper Liard',
		},
		{
			Name: 'Watson Lake',
		},
		{
			Name: 'Wernecke',
		},
		{
			Name: 'Whitehorse',
		},
		{
			Name: 'Whitestone Village',
		},
		{
			Name: 'Williams Creek',
		},
		{
			Name: 'Yukon Crossing',
		},
		{
			Name: 'Upper Laberge',
		},
		{
			Name: 'Lake Laberge',
		},
		{
			Name: 'South Fork',
		},
		{
			Name: 'Yukon Ditch',
		},
		{
			Name: 'Lansing',
		},
		{
			Name: 'Klondike City',
		},
		{
			Name: 'Overland Trail',
		},
		{
			Name: 'Outside of Canada',
		},
		{
			Name: 'Lansing Post',
		},
		{
			Name: 'Alaska Highway',
		},
		{
			Name: 'Klondike Highway',
		},
		{
			Name: 'Robert Campbell Highway',
		},
		{
			Name: 'Haines Road',
		},
		{
			Name: 'Dempster Highway',
		},
		{
			Name: 'Tagish Road',
		},
		{
			Name: 'Stewart Crossing',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Community');
};
