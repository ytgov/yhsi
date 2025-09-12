// -- BEGIN TABLE InterpretiveSite.Sites
// IF OBJECT_ID('InterpretiveSite.Sites', 'U') IS NOT NULL
// DROP TABLE InterpretiveSite.Sites;
// GO

// CREATE TABLE InterpretiveSite.Sites (
// 	SiteID smallint NOT NULL IDENTITY(1,1),
// 	SiteName varchar(60) NULL,
// 	LocationDesc varchar(150) NULL,
// 	RouteName varchar(50) NULL,
// 	KMNum smallint NULL,
// 	MapSheet varchar(7) NULL,
// 	Latitude float(8) NULL,
// 	Longitude float(8) NULL,
// 	EstablishedYear smallint NULL,
// 	AdvancedNotification varchar(7) NULL,
// 	NotificationDesc varchar(255) NULL
// );
// GO

// ALTER TABLE InterpretiveSite.Sites ADD CONSTRAINT PK__Sites__B9DCB9038B2768DE PRIMARY KEY (SiteID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('InterpretiveSite.Sites', (table) => {
		table.increments('SiteID').primary();
		table.string('SiteName', 60).nullable();
		table.string('LocationDesc', 150).nullable();
		table.string('RouteName', 50).nullable();
		table.float('KMNum').nullable();
		table.string('MapSheet', 7).nullable();
		table.float('Latitude').nullable();
		table.float('Longitude').nullable();
		table.integer('EstablishedYear').nullable();
		table.string('AdvancedNotification', 7).nullable();
		table.string('NotificationDesc', 255).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('InterpretiveSite.Sites');
};
