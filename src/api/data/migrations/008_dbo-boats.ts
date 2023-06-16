// -- BEGIN TABLE dbo.boats$
// IF OBJECT_ID('dbo.[boats$]', 'U') IS NOT NULL
// DROP TABLE dbo.[boats$];
// GO

// CREATE TABLE dbo.[boats$] (
// 	UID real NULL,
// 	Record_Type nvarchar(255) NULL,
// 	Orig_Boat nvarchar(255) NULL,
// 	Boat_Name_1 nvarchar(255) NULL,
// 	Boat_Name2 nvarchar(255) NULL,
// 	Boat_Name3 nvarchar(255) NULL,
// 	Construction_Date nvarchar(255) NULL,
// 	Service_Start_Date nvarchar(255) NULL,
// 	Service_End_Date nvarchar(255) NULL,
// 	Vessle_Type nvarchar(255) NULL,
// 	Current_Loc_Desc nvarchar(255) NULL,
// 	Registration_No nvarchar(255) NULL,
// 	Notes nvarchar(255) NULL,
// 	Org_Company nvarchar(255) NULL,
// 	Owner1 nvarchar(255) NULL,
// 	Owner2 nvarchar(255) NULL,
// 	Owner3 nvarchar(255) NULL,
// 	Owner4 nvarchar(255) NULL,
// 	Owner5 nvarchar(255) NULL,
// 	Owner6 nvarchar(255) NULL,
// 	Org_History ntext NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.[boats$]', (table) => {
		table.string('UID', 255).nullable();
		table.string('Record_Type', 255).nullable();
		table.string('Orig_Boat', 255).nullable();
		table.string('Boat_Name_1', 255).nullable();
		table.string('Boat_Name2', 255).nullable();
		table.string('Boat_Name3', 255).nullable();
		table.string('Construction_Date', 255).nullable();
		table.string('Service_Start_Date', 255).nullable();
		table.string('Service_End_Date', 255).nullable();
		table.string('Vessle_Type', 255).nullable();
		table.string('Current_Loc_Desc', 255).nullable();
		table.string('Registration_No', 255).nullable();
		table.string('Notes', 255).nullable();
		table.string('Org_Company', 255).nullable();
		table.string('Owner1', 255).nullable();
		table.string('Owner2', 255).nullable();
		table.string('Owner3', 255).nullable();
		table.string('Owner4', 255).nullable();
		table.string('Owner5', 255).nullable();
		table.string('Owner6', 255).nullable();
		table.text('Org_History').nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.[boats$]');
};
