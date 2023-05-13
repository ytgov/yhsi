// -- BEGIN TABLE dbo.FunctionalType
// IF OBJECT_ID('dbo.FunctionalType', 'U') IS NOT NULL
// DROP TABLE dbo.FunctionalType;
// GO

// CREATE TABLE dbo.FunctionalType (
// 	Id int NOT NULL IDENTITY(1,1),
// 	Description nvarchar(256) NULL
// );
// GO

// ALTER TABLE dbo.FunctionalType ADD CONSTRAINT PK_FunctionalType PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.FunctionalType', (table) => {
		table.increments('Id').primary();
		table.string('Description', 256).nullable();
	});

	await knex('dbo.FunctionalType').delete().whereRaw('1=1');
	await knex('dbo.FunctionalType').insert([
		{
			Id: 1,
			Description: 'Food Supply / Barn, Stable or Other Animal Housing',
		},
		{
			Id: 3,
			Description: 'Food Supply / Barn',
		},
		{
			Id: 4,
			Description: 'Food Supply / Cultivated Area',
		},
		{
			Id: 5,
			Description: 'Food Supply / Equipment Shed',
		},
		{
			Id: 6,
			Description: 'Food Supply / Farm or Ranch',
		},
		{
			Id: 7,
			Description: 'Food Supply / Food Storage Facility',
		},
		{
			Id: 8,
			Description: 'Food Supply / Granary or Silo',
		},
		{
			Id: 9,
			Description: 'Food Supply / Horticultural Facility or Site',
		},
		{
			Id: 11,
			Description: 'Government / Commemorative Monument',
		},
		{
			Id: 12,
			Description: 'Government / Correctional Facility',
		},
		{
			Id: 13,
			Description: 'Government / Courthouse and/or Registry Office',
		},
		{
			Id: 14,
			Description: 'Government / Custom Building',
		},
		{
			Id: 15,
			Description: 'Government / Diplomatic Building',
		},
		{
			Id: 16,
			Description: 'Government / Fire Station',
		},
		{
			Id: 17,
			Description: 'Government / Office or Office Building',
		},
		{
			Id: 18,
			Description: 'Government / Legislative Building',
		},
		{
			Id: 20,
			Description: 'Government / Police Station',
		},
		{
			Id: 21,
			Description: 'Government / Post Office',
		},
		{
			Id: 22,
			Description: 'Government / Town Hall or City Hall',
		},
		{
			Id: 23,
			Description: 'Government / Treaty-Making Site',
		},
		{
			Id: 24,
			Description: 'Leisure / Aquarium, Planetarium or Zoo',
		},
		{
			Id: 25,
			Description: 'Leisure / Auditorium, Cinema or NIghtclub',
		},
		{
			Id: 28,
			Description: 'Leisure / Museum',
		},
		{
			Id: 29,
			Description: 'Leisure / Park Fixture',
		},
		{
			Id: 31,
			Description: 'Residence / Settlement',
		},
		{
			Id: 32,
			Description: 'Residence / Estate',
		},
		{
			Id: 33,
			Description: 'Residence / Multiple Dwelling',
		},
		{
			Id: 34,
			Description: 'Residence / Outbuilding',
		},
		{
			Id: 35,
			Description: 'Residence / Group Residence',
		},
		{
			Id: 36,
			Description: 'Residence / Suburb',
		},
		{
			Id: 38,
			Description: 'Residence / Single Dwelling',
		},
		{
			Id: 39,
			Description: 'Residence / Stable or Garage',
		},
		{
			Id: 40,
			Description: 'Education / Special or Training School',
		},
		{
			Id: 41,
			Description: 'Leisure / Library',
		},
		{
			Id: 42,
			Description: 'Education / Post-Secondary Institution',
		},
		{
			Id: 43,
			Description: 'Education / Composite School',
		},
		{
			Id: 45,
			Description: 'Education / Primary or Secondary School',
		},
		{
			Id: 47,
			Description: 'Health & Research / Animal Care Facility',
		},
		{
			Id: 48,
			Description: 'Health & Research / Clinic',
		},
		{
			Id: 49,
			Description:
				'Health & Research / Hospital or Other Health Care Institution',
		},
		{
			Id: 50,
			Description: 'Health & Research / Research Facility',
		},
		{
			Id: 52,
			Description: 'Industry / Communications Facility',
		},
		{
			Id: 53,
			Description: 'Industry / Natural Resource Extraction Facility or Site',
		},
		{
			Id: 54,
			Description: 'Industry / Engineering Facility',
		},
		{
			Id: 55,
			Description: 'Industry / Power Generation Facility',
		},
		{
			Id: 56,
			Description: 'Industry / Food and Beverage Manufacturing Facility',
		},
		{
			Id: 57,
			Description: 'Industry / Metal Products Manufacturing Facility',
		},
		{
			Id: 58,
			Description: 'Industry / Water or Sewage Facility',
		},
		{
			Id: 59,
			Description: 'Community / Military Office',
		},
		{
			Id: 61,
			Description: 'Community / Military Base',
		},
		{
			Id: 62,
			Description: 'Community / Battle Site',
		},
		{
			Id: 63,
			Description: 'Community / Civil Defense Site',
		},
		{
			Id: 64,
			Description: 'Community / Military Defence Installation',
		},
		{
			Id: 66,
			Description: 'Community / Drill Hall',
		},
		{
			Id: 70,
			Description: 'Community / Residential Facility',
		},
		{
			Id: 74,
			Description: 'Environment / Nature Element',
		},
		{
			Id: 75,
			Description: 'Food Supply / Hunting or Resource Harvesting Site',
		},
		{
			Id: 76,
			Description: 'Transport - Water / Route',
		},
		{
			Id: 80,
			Description: 'Leisure / Social, Benevolent or Fraternal Club',
		},
		{
			Id: 81,
			Description: 'Leisure / Exhibition Centre',
		},
		{
			Id: 82,
			Description: 'Leisure / Exhibition or Amusement Park',
		},
		{
			Id: 84,
			Description: 'Leisure / Park',
		},
		{
			Id: 86,
			Description: 'Leisure / Pool or Beach',
		},
		{
			Id: 87,
			Description: 'Leisure / Recreation Centre',
		},
		{
			Id: 88,
			Description: 'Leisure / Sports Facility or Site',
		},
		{
			Id: 89,
			Description: 'Leisure / Tourist Facility',
		},
		{
			Id: 91,
			Description:
				'Religion, Ritual & Funeral / Mortuary Site, Cemetery or Enclosure',
		},
		{
			Id: 92,
			Description: 'Religion, Ritual & Funeral / Legend Site',
		},
		{
			Id: 94,
			Description: 'Religion, Ritual & Funeral / Mission',
		},
		{
			Id: 95,
			Description:
				'Religion, Ritual & Funeral / Religious Facility or Place of Worship',
		},
		{
			Id: 96,
			Description: 'Religion, Ritual & Funeral / Religious Facility',
		},
		{
			Id: 97,
			Description: 'Religion, Ritual & Funeral / Aboriginal Ritual Site',
		},
		{
			Id: 99,
			Description: 'Commerce / Commercial Services / Bank or Stock Exchange',
		},
		{
			Id: 100,
			Description: 'Commerce / Commercial Services / Office or Office Building',
		},
		{
			Id: 101,
			Description: 'Commerce / Commercial Services / Hotel, Motel or Inn',
		},
		{
			Id: 102,
			Description: 'Commerce / Commercial Services / Market',
		},
		{
			Id: 103,
			Description:
				'Commerce / Commercial Services / Shop or Wholesale Establishment',
		},
		{
			Id: 104,
			Description: 'Commerce / Commercial Services / Trading Post',
		},
		{
			Id: 105,
			Description: 'Commerce / Commercial Services / Studio',
		},
		{
			Id: 106,
			Description: 'Commerce / Commercial Services / Warehouse',
		},
		{
			Id: 107,
			Description: 'Transport - Air /Air Terminal',
		},
		{
			Id: 108,
			Description: 'Transport - Air /Air Transport Facility',
		},
		{
			Id: 109,
			Description: 'Transport - Air /Aircraft',
		},
		{
			Id: 110,
			Description: 'Transport - Air /Hangar',
		},
		{
			Id: 111,
			Description:
				'Transport - Land / Bridge, Tunnel or Other Engineering Work',
		},
		{
			Id: 112,
			Description: 'Transport - Land / Pedestrian Way',
		},
		{
			Id: 113,
			Description: 'Transport - Land / Road Facility',
		},
		{
			Id: 114,
			Description: 'Transport - Land / Service Station',
		},
		{
			Id: 115,
			Description: 'Transport - Land / Bridge or Tunnel',
		},
		{
			Id: 116,
			Description: 'Transport - Rail / Rail Transport Facility',
		},
		{
			Id: 118,
			Description: 'Transport - Rail / Station or Other Rail Facility',
		},
		{
			Id: 119,
			Description: 'Transport - Water / Dock or Dry Dock',
		},
		{
			Id: 120,
			Description: 'Transport - Water / Canal or Canal Works',
		},
		{
			Id: 121,
			Description: 'Transport - Water / Navigational Aid or Lighthouse',
		},
		{
			Id: 122,
			Description: 'Transport - Water / Harbour Facility',
		},
		{
			Id: 123,
			Description: 'Transport - Water / Vessel',
		},
		{
			Id: 124,
			Description: 'Transport - Water / Water Transport Facility',
		},
		{
			Id: 125,
			Description: 'Undetermined (Archaeological Site) / Buried Site',
		},
		{
			Id: 126,
			Description: 'Undetermined (Archaeological Site) / Exposed Site',
		},
		{
			Id: 127,
			Description:
				'Commerce / Commercial Services / Eating or Drinking Establishment',
		},
		{
			Id: 128,
			Description: 'Food Supply / Farm Element',
		},
		{
			Id: 129,
			Description: 'Food Supply / Fisheries Site',
		},
		{
			Id: 130,
			Description: 'Community / Military Support',
		},
		{
			Id: 131,
			Description: 'Education / One-Room School',
		},
		{
			Id: 132,
			Description: 'Education / Secondary School',
		},
		{
			Id: 133,
			Description: 'Industry / Animal Products Processing Facility',
		},
		{
			Id: 134,
			Description: 'Industry / Crafts Production Facility',
		},
		{
			Id: 136,
			Description: 'Industry / Non-Metallic Mineral Products',
		},
		{
			Id: 137,
			Description: 'Industry / Petroleum and Coal Products Facility',
		},
		{
			Id: 139,
			Description: 'Industry / Wood and/or Paper Manufacturing Facility',
		},
		{
			Id: 141,
			Description: 'Transport - Raill / Rolling Stock',
		},
		{
			Id: 142,
			Description: 'Transport - Water / Landing Point',
		},
		{
			Id: 143,
			Description: 'Transport - Water / Route',
		},
		{
			Id: 144,
			Description: 'Food Supply / Household Garden',
		},
		{
			Id: 145,
			Description: 'Government / Civic Space',
		},
		{
			Id: 148,
			Description: 'Leisure / Public Art or Furnishings',
		},
		{
			Id: 149,
			Description: 'Government / Town',
		},
		{
			Id: 558,
			Description: 'Food Supply / Grain Elevator',
		},
		{
			Id: 559,
			Description: 'Food Supply / Rural District or Area',
		},
		{
			Id: 564,
			Description: 'Government / Residence',
		},
		{
			Id: 571,
			Description: 'Undetermined (Archaeological Site) / Underwater Site',
		},
		{
			Id: 576,
			Description: 'Industry / Armament Manufacturing Facility',
		},
		{
			Id: 578,
			Description: 'Industry / Furniture Manufacturing Facility',
		},
		{
			Id: 579,
			Description:
				'Industry / Machinery or Other Equipment Manufacturing Facility',
		},
		{
			Id: 588,
			Description: 'Industry / Textile or Leather Manufacturing Facility',
		},
		{
			Id: 595,
			Description: 'Industry / Chemical Products Manufacturing Facility',
		},
		{
			Id: 599,
			Description: 'Industry / Tobacco Manufacturing Facility',
		},
		{
			Id: 600,
			Description: 'Leisure / Historic or Interpretive Site',
		},
		{
			Id: 601,
			Description: 'Religion, Ritual & Funeral / Religious Institution',
		},
		{
			Id: 602,
			Description: 'Transport - Land / Road or Public Way',
		},
		{
			Id: 604,
			Description: 'Transport - Land / Portage',
		},
		{
			Id: 605,
			Description: 'Traditional Trail or Trading Route',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.FunctionalType');
};
