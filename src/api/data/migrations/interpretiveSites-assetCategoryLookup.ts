// -- BEGIN TABLE InterpretiveSite.AssetCategoryLookup
// IF OBJECT_ID('InterpretiveSite.AssetCategoryLookup', 'U') IS NOT NULL
// DROP TABLE InterpretiveSite.AssetCategoryLookup;
// GO

// CREATE TABLE InterpretiveSite.AssetCategoryLookup (
// 	CatLUpID smallint NOT NULL IDENTITY(1,1),
// 	Category varchar(30) NOT NULL,
// 	Status bit NOT NULL
// );
// GO

// ALTER TABLE InterpretiveSite.AssetCategoryLookup ADD CONSTRAINT PK__AssetCat__D7766E441149C0D2 PRIMARY KEY (CatLUpID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable(
		'InterpretiveSite.AssetCategoryLookup',
		(table) => {
			table.increments('CatLUpID').primary();
			table.string('Category', 30).notNullable();
			table.boolean('Status').notNullable();
		}
	);

	await knex('InterpretiveSite.AssetCategoryLookup').delete().whereRaw('1=1');
	await knex('InterpretiveSite.AssetCategoryLookup').insert([
		{
			CatLUpID: 1,
			Category: 'Sign',
			Status: true,
		},
		{
			CatLUpID: 2,
			Category: 'Garbage Container',
			Status: true,
		},
		{
			CatLUpID: 3,
			Category: 'Outhouse',
			Status: true,
		},
		{
			CatLUpID: 4,
			Category: 'Viewing Platform',
			Status: true,
		},
		{
			CatLUpID: 5,
			Category: 'Campground',
			Status: true,
		},
		{
			CatLUpID: 6,
			Category: 'LandScape Feature',
			Status: true,
		},
		{
			CatLUpID: 7,
			Category: 'Inactive Item',
			Status: false,
		},
		{
			CatLUpID: 8,
			Category: 'test',
			Status: true,
		},
		{
			CatLUpID: 9,
			Category: 'test2',
			Status: false,
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.AssetCategoryLookup');
};
