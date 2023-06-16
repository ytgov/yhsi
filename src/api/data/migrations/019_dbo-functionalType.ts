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
			Description: 'Food Supply / Barn, Stable or Other Animal Housing',
		},
		{
			Description: 'Food Supply / Barn',
		},
		{
			Description: 'Food Supply / Cultivated Area',
		},
		{
			Description: 'Food Supply / Equipment Shed',
		},
		{
			Description: 'Food Supply / Farm or Ranch',
		},
		{
			Description: 'Food Supply / Food Storage Facility',
		},
		{
			Description: 'Food Supply / Granary or Silo',
		},
		{
			Description: 'Food Supply / Horticultural Facility or Site',
		},
		{
			Description: 'Government / Commemorative Monument',
		},
		{
			Description: 'Government / Correctional Facility',
		},
		{
			Description: 'Government / Courthouse and/or Registry Office',
		},
		{
			Description: 'Government / Custom Building',
		},
		{
			Description: 'Government / Diplomatic Building',
		},
		{
			Description: 'Government / Fire Station',
		},
		{
			Description: 'Government / Office or Office Building',
		},
		{
			Description: 'Government / Legislative Building',
		},
		{
			Description: 'Government / Police Station',
		},
		{
			Description: 'Government / Post Office',
		},
		{
			Description: 'Government / Town Hall or City Hall',
		},
		{
			Description: 'Government / Treaty-Making Site',
		},
		{
			Description: 'Leisure / Aquarium, Planetarium or Zoo',
		},
		{
			Description: 'Leisure / Auditorium, Cinema or NIghtclub',
		},
		{
			Description: 'Leisure / Museum',
		},
		{
			Description: 'Leisure / Park Fixture',
		},
		{
			Description: 'Residence / Settlement',
		},
		{
			Description: 'Residence / Estate',
		},
		{
			Description: 'Residence / Multiple Dwelling',
		},
		{
			Description: 'Residence / Outbuilding',
		},
		{
			Description: 'Residence / Group Residence',
		},
		{
			Description: 'Residence / Suburb',
		},
		{
			Description: 'Residence / Single Dwelling',
		},
		{
			Description: 'Residence / Stable or Garage',
		},
		{
			Description: 'Education / Special or Training School',
		},
		{
			Description: 'Leisure / Library',
		},
		{
			Description: 'Education / Post-Secondary Institution',
		},
		{
			Description: 'Education / Composite School',
		},
		{
			Description: 'Education / Primary or Secondary School',
		},
		{
			Description: 'Health & Research / Animal Care Facility',
		},
		{
			Description: 'Health & Research / Clinic',
		},
		{
			Description:
				'Health & Research / Hospital or Other Health Care Institution',
		},
		{
			Description: 'Health & Research / Research Facility',
		},
		{
			Description: 'Industry / Communications Facility',
		},
		{
			Description: 'Industry / Natural Resource Extraction Facility or Site',
		},
		{
			Description: 'Industry / Engineering Facility',
		},
		{
			Description: 'Industry / Power Generation Facility',
		},
		{
			Description: 'Industry / Food and Beverage Manufacturing Facility',
		},
		{
			Description: 'Industry / Metal Products Manufacturing Facility',
		},
		{
			Description: 'Industry / Water or Sewage Facility',
		},
		{
			Description: 'Community / Military Office',
		},
		{
			Description: 'Community / Military Base',
		},
		{
			Description: 'Community / Battle Site',
		},
		{
			Description: 'Community / Civil Defense Site',
		},
		{
			Description: 'Community / Military Defence Installation',
		},
		{
			Description: 'Community / Drill Hall',
		},
		{
			Description: 'Community / Residential Facility',
		},
		{
			Description: 'Environment / Nature Element',
		},
		{
			Description: 'Food Supply / Hunting or Resource Harvesting Site',
		},
		{
			Description: 'Transport - Water / Route',
		},
		{
			Description: 'Leisure / Social, Benevolent or Fraternal Club',
		},
		{
			Description: 'Leisure / Exhibition Centre',
		},
		{
			Description: 'Leisure / Exhibition or Amusement Park',
		},
		{
			Description: 'Leisure / Park',
		},
		{
			Description: 'Leisure / Pool or Beach',
		},
		{
			Description: 'Leisure / Recreation Centre',
		},
		{
			Description: 'Leisure / Sports Facility or Site',
		},
		{
			Description: 'Leisure / Tourist Facility',
		},
		{
			Description:
				'Religion, Ritual & Funeral / Mortuary Site, Cemetery or Enclosure',
		},
		{
			Description: 'Religion, Ritual & Funeral / Legend Site',
		},
		{
			Description: 'Religion, Ritual & Funeral / Mission',
		},
		{
			Description:
				'Religion, Ritual & Funeral / Religious Facility or Place of Worship',
		},
		{
			Description: 'Religion, Ritual & Funeral / Religious Facility',
		},
		{
			Description: 'Religion, Ritual & Funeral / Aboriginal Ritual Site',
		},
		{
			Description: 'Commerce / Commercial Services / Bank or Stock Exchange',
		},
		{
			Description: 'Commerce / Commercial Services / Office or Office Building',
		},
		{
			Description: 'Commerce / Commercial Services / Hotel, Motel or Inn',
		},
		{
			Description: 'Commerce / Commercial Services / Market',
		},
		{
			Description:
				'Commerce / Commercial Services / Shop or Wholesale Establishment',
		},
		{
			Description: 'Commerce / Commercial Services / Trading Post',
		},
		{
			Description: 'Commerce / Commercial Services / Studio',
		},
		{
			Description: 'Commerce / Commercial Services / Warehouse',
		},
		{
			Description: 'Transport - Air /Air Terminal',
		},
		{
			Description: 'Transport - Air /Air Transport Facility',
		},
		{
			Description: 'Transport - Air /Aircraft',
		},
		{
			Description: 'Transport - Air /Hangar',
		},
		{
			Description:
				'Transport - Land / Bridge, Tunnel or Other Engineering Work',
		},
		{
			Description: 'Transport - Land / Pedestrian Way',
		},
		{
			Description: 'Transport - Land / Road Facility',
		},
		{
			Description: 'Transport - Land / Service Station',
		},
		{
			Description: 'Transport - Land / Bridge or Tunnel',
		},
		{
			Description: 'Transport - Rail / Rail Transport Facility',
		},
		{
			Description: 'Transport - Rail / Station or Other Rail Facility',
		},
		{
			Description: 'Transport - Water / Dock or Dry Dock',
		},
		{
			Description: 'Transport - Water / Canal or Canal Works',
		},
		{
			Description: 'Transport - Water / Navigational Aid or Lighthouse',
		},
		{
			Description: 'Transport - Water / Harbour Facility',
		},
		{
			Description: 'Transport - Water / Vessel',
		},
		{
			Description: 'Transport - Water / Water Transport Facility',
		},
		{
			Description: 'Undetermined (Archaeological Site) / Buried Site',
		},
		{
			Description: 'Undetermined (Archaeological Site) / Exposed Site',
		},
		{
			Description:
				'Commerce / Commercial Services / Eating or Drinking Establishment',
		},
		{
			Description: 'Food Supply / Farm Element',
		},
		{
			Description: 'Food Supply / Fisheries Site',
		},
		{
			Description: 'Community / Military Support',
		},
		{
			Description: 'Education / One-Room School',
		},
		{
			Description: 'Education / Secondary School',
		},
		{
			Description: 'Industry / Animal Products Processing Facility',
		},
		{
			Description: 'Industry / Crafts Production Facility',
		},
		{
			Description: 'Industry / Non-Metallic Mineral Products',
		},
		{
			Description: 'Industry / Petroleum and Coal Products Facility',
		},
		{
			Description: 'Industry / Wood and/or Paper Manufacturing Facility',
		},
		{
			Description: 'Transport - Raill / Rolling Stock',
		},
		{
			Description: 'Transport - Water / Landing Point',
		},
		{
			Description: 'Transport - Water / Route',
		},
		{
			Description: 'Food Supply / Household Garden',
		},
		{
			Description: 'Government / Civic Space',
		},
		{
			Description: 'Leisure / Public Art or Furnishings',
		},
		{
			Description: 'Government / Town',
		},
		{
			Description: 'Food Supply / Grain Elevator',
		},
		{
			Description: 'Food Supply / Rural District or Area',
		},
		{
			Description: 'Government / Residence',
		},
		{
			Description: 'Undetermined (Archaeological Site) / Underwater Site',
		},
		{
			Description: 'Industry / Armament Manufacturing Facility',
		},
		{
			Description: 'Industry / Furniture Manufacturing Facility',
		},
		{
			Description:
				'Industry / Machinery or Other Equipment Manufacturing Facility',
		},
		{
			Description: 'Industry / Textile or Leather Manufacturing Facility',
		},
		{
			Description: 'Industry / Chemical Products Manufacturing Facility',
		},
		{
			Description: 'Industry / Tobacco Manufacturing Facility',
		},
		{
			Description: 'Leisure / Historic or Interpretive Site',
		},
		{
			Description: 'Religion, Ritual & Funeral / Religious Institution',
		},
		{
			Description: 'Transport - Land / Road or Public Way',
		},
		{
			Description: 'Transport - Land / Portage',
		},
		{
			Description: 'Traditional Trail or Trading Route',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.FunctionalType');
};
