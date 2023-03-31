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
			Id: 1,
			Name: 'Aishihik',
		},
		{
			Id: 2,
			Name: 'Ballarat Creek',
		},
		{
			Id: 3,
			Name: 'Beaver Creek',
		},
		{
			Id: 4,
			Name: 'Big Salmon',
		},
		{
			Id: 5,
			Name: 'Britannia Creek',
		},
		{
			Id: 6,
			Name: 'Brooks Brook',
		},
		{
			Id: 7,
			Name: 'Burwash',
		},
		{
			Id: 8,
			Name: 'Canol Road',
		},
		{
			Id: 9,
			Name: 'Canyon Creek',
		},
		{
			Id: 10,
			Name: 'Carcross',
		},
		{
			Id: 11,
			Name: 'Carcross Road',
		},
		{
			Id: 12,
			Name: 'Carlisle Creek',
		},
		{
			Id: 13,
			Name: 'Carmacks',
		},
		{
			Id: 14,
			Name: 'Casino Creek',
		},
		{
			Id: 15,
			Name: 'Champagne',
		},
		{
			Id: 16,
			Name: 'Coffee Creek',
		},
		{
			Id: 17,
			Name: 'Conrad',
		},
		{
			Id: 18,
			Name: 'Dalton Post',
		},
		{
			Id: 19,
			Name: 'Dawson City',
		},
		{
			Id: 20,
			Name: 'Destruction Bay',
		},
		{
			Id: 21,
			Name: 'Donjek',
		},
		{
			Id: 22,
			Name: 'Elsa',
		},
		{
			Id: 23,
			Name: 'Faro',
		},
		{
			Id: 24,
			Name: 'Fort Reliance',
		},
		{
			Id: 25,
			Name: 'Fort Selkirk',
		},
		{
			Id: 26,
			Name: 'Forty Mile',
		},
		{
			Id: 27,
			Name: 'Granville',
		},
		{
			Id: 28,
			Name: 'Haines Junction',
		},
		{
			Id: 29,
			Name: 'Herschel Island',
		},
		{
			Id: 30,
			Name: 'Highet Creek',
		},
		{
			Id: 31,
			Name: 'Hootalinqua',
		},
		{
			Id: 32,
			Name: 'Jakes Corner',
		},
		{
			Id: 33,
			Name: 'Johnsons Crossing',
		},
		{
			Id: 34,
			Name: 'Keno',
		},
		{
			Id: 35,
			Name: 'Keno 700',
		},
		{
			Id: 36,
			Name: 'Klukshu',
		},
		{
			Id: 37,
			Name: 'Little Salmon',
		},
		{
			Id: 38,
			Name: 'Livingstone',
		},
		{
			Id: 39,
			Name: 'Lorne Mountain',
		},
		{
			Id: 40,
			Name: 'Lower Laberge',
		},
		{
			Id: 41,
			Name: 'Mackeno',
		},
		{
			Id: 42,
			Name: 'Marsh Lake',
		},
		{
			Id: 43,
			Name: 'Mayo',
		},
		{
			Id: 44,
			Name: 'Minto',
		},
		{
			Id: 45,
			Name: 'Moosehide',
		},
		{
			Id: 46,
			Name: 'None',
		},
		{
			Id: 47,
			Name: 'North Fork',
		},
		{
			Id: 48,
			Name: 'Ogilvie',
		},
		{
			Id: 49,
			Name: 'Old Crow',
		},
		{
			Id: 50,
			Name: 'Old Mayo Indian Village',
		},
		{
			Id: 51,
			Name: 'Old Ross River',
		},
		{
			Id: 52,
			Name: 'Pelly Crossing',
		},
		{
			Id: 53,
			Name: 'Pelly Farm',
		},
		{
			Id: 54,
			Name: 'Pelly Farm - Stepping Stone',
		},
		{
			Id: 55,
			Name: 'Rampart House',
		},
		{
			Id: 56,
			Name: 'Robinson',
		},
		{
			Id: 57,
			Name: 'Ross River',
		},
		{
			Id: 59,
			Name: 'Ruby 400',
		},
		{
			Id: 60,
			Name: 'Selwyn',
		},
		{
			Id: 61,
			Name: 'Seventeen Mile Wood Camp',
		},
		{
			Id: 62,
			Name: 'Sheep Creek',
		},
		{
			Id: 63,
			Name: 'Sheep Mountain',
		},
		{
			Id: 64,
			Name: 'Silver City',
		},
		{
			Id: 65,
			Name: 'Sister Island',
		},
		{
			Id: 66,
			Name: 'Snag',
		},
		{
			Id: 67,
			Name: 'Stewart Island',
		},
		{
			Id: 68,
			Name: 'Swift River',
		},
		{
			Id: 69,
			Name: 'Tagish',
		},
		{
			Id: 70,
			Name: 'Teslin',
		},
		{
			Id: 71,
			Name: 'Upper Liard',
		},
		{
			Id: 72,
			Name: 'Watson Lake',
		},
		{
			Id: 73,
			Name: 'Wernecke',
		},
		{
			Id: 74,
			Name: 'Whitehorse',
		},
		{
			Id: 75,
			Name: 'Whitestone Village',
		},
		{
			Id: 76,
			Name: 'Williams Creek',
		},
		{
			Id: 77,
			Name: 'Yukon Crossing',
		},
		{
			Id: 78,
			Name: 'Upper Laberge',
		},
		{
			Id: 79,
			Name: 'Lake Laberge',
		},
		{
			Id: 80,
			Name: 'South Fork',
		},
		{
			Id: 81,
			Name: 'Yukon Ditch',
		},
		{
			Id: 82,
			Name: 'Lansing',
		},
		{
			Id: 83,
			Name: 'Klondike City',
		},
		{
			Id: 85,
			Name: 'Overland Trail',
		},
		{
			Id: 86,
			Name: 'Outside of Canada',
		},
		{
			Id: 87,
			Name: 'Lansing Post',
		},
		{
			Id: 88,
			Name: 'Alaska Highway',
		},
		{
			Id: 89,
			Name: 'Klondike Highway',
		},
		{
			Id: 90,
			Name: 'Robert Campbell Highway',
		},
		{
			Id: 91,
			Name: 'Haines Road',
		},
		{
			Id: 92,
			Name: 'Dempster Highway',
		},
		{
			Id: 93,
			Name: 'Tagish Road',
		},
		{
			Id: 94,
			Name: 'Stewart Crossing',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	knex.schema.dropTable('dbo.Community');
};
