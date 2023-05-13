// -- BEGIN TABLE InterpretiveSite.Inspections
// IF OBJECT_ID('InterpretiveSite.Inspections', 'U') IS NOT NULL
// DROP TABLE InterpretiveSite.Inspections;
// GO

// CREATE TABLE InterpretiveSite.Inspections (
// 	InspectID smallint NOT NULL IDENTITY(1,1),
// 	SiteID smallint NULL,
// 	InspectionDate date NULL,
// 	Description varchar(255) NULL,
// 	InspectedBy varchar(50) NULL
// );
// GO

// ALTER TABLE InterpretiveSite.Inspections ADD CONSTRAINT PK__Inspecti__CCA48DD7578323B0 PRIMARY KEY (InspectID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('InterpretiveSite.Inspections', (table) => {
		table.increments('InspectID').primary();
		table.integer('SiteID').nullable();
		table.date('InspectionDate').nullable();
		table.string('Description', 255).nullable();
		table.string('InspectedBy', 50).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.Inspections');
};
