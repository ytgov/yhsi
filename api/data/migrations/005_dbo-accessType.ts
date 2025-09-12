// -- BEGIN TABLE dbo.AccessType
// IF OBJECT_ID('dbo.AccessType', 'U') IS NOT NULL
// DROP TABLE dbo.AccessType;
// GO

// CREATE TABLE dbo.AccessType (
// 	AccessID int NOT NULL IDENTITY(1,1),
// 	AccessName varchar(60) NOT NULL
// );
// GO

// ALTER TABLE dbo.AccessType ADD CONSTRAINT PK__AccessTy__4130D0BFA7F89388 PRIMARY KEY (AccessID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.AccessType', (table) => {
		table.increments('AccessID').primary();
		table.string('AccessName', 60).notNullable();
	});

	await knex
		.raw('SET IDENTITY_INSERT dbo.AccessType ON')
		.then(async function () {
			await knex('dbo.AccessType').delete().whereRaw('1=1');
			await knex('dbo.AccessType').insert([
				{
					AccessName: 'No Access',
				},
				{
					AccessName: 'View',
				},
				{
					AccessName: 'Edit',
				},
			]);
		});
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.AccessType');
};
