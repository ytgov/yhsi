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
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.AssetCategoryLookup');
};
