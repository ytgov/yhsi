// -- BEGIN TABLE dbo.Statute
// IF OBJECT_ID('dbo.Statute', 'U') IS NOT NULL
// DROP TABLE dbo.Statute;
// GO

// CREATE TABLE dbo.Statute (
// 	Id int NOT NULL IDENTITY(1,1),
// 	RecognitionAuthority nvarchar(256) NULL,
// 	RecognitionType nvarchar(256) NULL,
// 	Description nvarchar(256) NULL,
// 	AllStatute nvarchar(256) NULL
// );
// GO

// ALTER TABLE dbo.Statute ADD CONSTRAINT PK_Statute PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.Statute', (table) => {
		table.increments('Id').primary();
		table.string('RecognitionAuthority', 256).nullable();
		table.string('RecognitionType', 256).nullable();
		table.string('Description', 256).nullable();
		table.string('AllStatute', 256).nullable();
	});

	await knex('Statute').delete().whereRaw('1=1');
	await knex('Statute').insert([
		{
			RecognitionAuthority: 'No Statute Selected',
			RecognitionType: '',
			Description: '',
			AllStatute: '',
		},
		{
			RecognitionAuthority: 'Government of Yukon (/First Nation)',
			RecognitionType:
				'Yukon First Nations Final Agreement-Yukon First Nations Site',
			Description: 'Yukon First Nation Final Agreement/Historic Resources Act',
			AllStatute: 'Yukon First Nation Final Agreement/Historic Resources Act',
		},
		{
			RecognitionAuthority: 'Government of Yukon (/First Nation)',
			RecognitionType:
				'Yukon First Nation Final Agreement-Special Managment Area',
			Description: 'Yukon First Nation Final Agreement/Historic Resources Act',
			AllStatute: 'Yukon First Nation Final Agreement-Historic Resources Act',
		},
		{
			RecognitionAuthority: 'City of Whitehorse',
			RecognitionType: 'Historic Site',
			Description: 'City of Whitehorse By-law',
			AllStatute: 'City of Whitehorse By-law',
		},
		{
			RecognitionAuthority: 'Government of Yukon',
			RecognitionType: 'Territorial Historic Site',
			Description: 'Historic Resources Act',
			AllStatute: 'Historic Resources Act',
		},
		{
			RecognitionAuthority: 'Local Governments (YK)',
			RecognitionType: 'Historic Control Zone',
			Description: 'Municipal Act',
			AllStatute: 'Municipal Act',
		},
		{
			RecognitionAuthority: 'Government of Canada',
			RecognitionType: 'National Historic Site',
			Description: 'National Historic Sites Act',
			AllStatute: 'National Historic Sites Act',
		},
		{
			RecognitionAuthority: 'Government of Canada',
			RecognitionType: 'Recognized Federal Heritage Building',
			Description: 'Treasury Board Heritage Buildings Policy',
			AllStatute: 'Treasury Board Heritage Buildings Policy',
		},
		{
			RecognitionAuthority: 'Government of Canada',
			RecognitionType: 'Classified Federal Heritage Building',
			Description: 'Treasury Board Heritage Buildings Policy',
			AllStatute: 'Treasury Board Heritage Buildings Policy',
		},
		{
			RecognitionAuthority: 'Government of Yukon',
			RecognitionType: 'Territorial Park',
			Description: 'Territorial Parks Act',
			AllStatute: 'Parks and Land Certainty Act',
		},
		{
			RecognitionAuthority: 'Government of Canada',
			RecognitionType: 'Heritage Railway Station',
			Description: 'Heritage Railway Station Protection Act',
			AllStatute: 'Heritage Railway Station Protection Act',
		},
		{
			RecognitionAuthority: 'Town of the City of Dawson',
			RecognitionType: 'Historic Site',
			Description: 'Town of the City of Dawson By-law',
			AllStatute: 'Town of the City of Dawson By-law',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.Statute');
};
