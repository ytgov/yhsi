// -- BEGIN TABLE InterpretiveSite.Actions
// IF OBJECT_ID('InterpretiveSite.Actions', 'U') IS NOT NULL
// DROP TABLE InterpretiveSite.Actions;
// GO

// CREATE TABLE InterpretiveSite.Actions (
// 	ActionID smallint NOT NULL IDENTITY(1,1),
// 	InspectID smallint NULL,
// 	SiteID smallint NULL,
// 	ActionDesc varchar(255) NOT NULL,
// 	ToBeCompleteDate date NULL,
// 	ActionCompleteDate date NULL,
// 	CompletionDesc varchar(255) NULL,
// 	Priority varchar(8) NULL,
// 	CreatedBy varchar(50) NULL,
// 	CreatedDate date NULL,
// 	CompletedBy varchar(50) NULL
// );
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('InterpretiveSite.Actions', (table) => {
		//ActionID is not unique either. It's unique per site
		table.increments('ActionID').notNullable();
		table.integer('InspectID').nullable();
		table.integer('SiteID').nullable();
		table.string('ActionDesc', 1024).notNullable();
		table.date('ToBeCompleteDate').nullable();
		table.date('ActionCompleteDate').nullable();
		table.string('CompletionDesc', 1024).nullable();
		table.string('Priority', 8).nullable();
		table.string('CreatedBy', 100).nullable();
		table.date('CreatedDate').nullable();
		table.string('CompletedBy', 100).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.Actions');
};
