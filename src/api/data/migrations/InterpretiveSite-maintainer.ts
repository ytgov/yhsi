// -- BEGIN TABLE InterpretiveSite.Maintainer
// IF OBJECT_ID('InterpretiveSite.Maintainer', 'U') IS NOT NULL
// DROP TABLE InterpretiveSite.Maintainer;
// GO

// CREATE TABLE InterpretiveSite.Maintainer (
// 	MaintID smallint NOT NULL IDENTITY(1,1),
// 	AssetID smallint NULL,
// 	SiteID smallint NULL,
// 	Maintainer varchar(50) NULL
// );
// GO

// ALTER TABLE InterpretiveSite.Maintainer ADD CONSTRAINT PK__Maintain__D79F0B8CEFBEA873 PRIMARY KEY (MaintID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('InterpretiveSite.Maintainer', (table) => {
		table.increments('MaintID').primary();
		table.integer('AssetID').nullable();
		table.integer('SiteID').nullable();
		table.string('Maintainer', 50).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.Maintainer');
};
