// -- BEGIN TABLE InterpretiveSite.Photos
// IF OBJECT_ID('InterpretiveSite.Photos', 'U') IS NOT NULL
// DROP TABLE InterpretiveSite.Photos;
// GO

// CREATE TABLE InterpretiveSite.Photos (
// 	Id smallint NOT NULL IDENTITY(1,1),
// 	SiteID smallint NOT NULL,
// 	Photo_RowID nvarchar(255) NOT NULL
// );
// GO

// ALTER TABLE InterpretiveSite.Photos ADD CONSTRAINT PK__Photos__3214EC074166BB59 PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('InterpretiveSite.Photos', (table) => {
		table.increments('Id').primary();
		table.integer('SiteID').notNullable();
		table.string('Photo_RowID', 255).notNullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.Photos');
};
