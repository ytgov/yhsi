// IF NOT EXISTS (SELECT name FROM sys.schemas WHERE name = N'AirCrash')
// 	EXEC sp_executesql N'CREATE SCHEMA [AirCrash]';
// GO

// IF NOT EXISTS (SELECT name FROM sys.schemas WHERE name = N'Boat')
// 	EXEC sp_executesql N'CREATE SCHEMA [Boat]';
// GO

// IF NOT EXISTS (SELECT name FROM sys.schemas WHERE name = N'Burial')
// 	EXEC sp_executesql N'CREATE SCHEMA [Burial]';
// GO

// IF NOT EXISTS (SELECT name FROM sys.schemas WHERE name = N'InterpretiveSite')
// 	EXEC sp_executesql N'CREATE SCHEMA [InterpretiveSite]';
// GO

// IF NOT EXISTS (SELECT name FROM sys.schemas WHERE name = N'Person')
// 	EXEC sp_executesql N'CREATE SCHEMA [Person]';
// GO

// IF NOT EXISTS (SELECT name FROM sys.schemas WHERE name = N'Place')
// 	EXEC sp_executesql N'CREATE SCHEMA [Place]';
// GO

// IF NOT EXISTS (SELECT name FROM sys.schemas WHERE name = N'Security')
// 	EXEC sp_executesql N'CREATE SCHEMA [Security]';
// GO

// IF NOT EXISTS (SELECT name FROM sys.schemas WHERE name = N'YHIS')
// 	EXEC sp_executesql N'CREATE SCHEMA [YHIS]';
// GO

// IF NOT EXISTS (SELECT name FROM sys.schemas WHERE name = N'YRHP')
// 	EXEC sp_executesql N'CREATE SCHEMA [YRHP]';
// GO

import { Knex } from 'knex';

exports.up = async function (knex: Knex, Promise: any) {
	await knex.raw('CREATE SCHEMA [AirCrash]');
	await knex.raw('CREATE SCHEMA [Boat]');
	await knex.raw('CREATE SCHEMA [Burial]');
	await knex.raw('CREATE SCHEMA [InterpretiveSite]');
	await knex.raw('CREATE SCHEMA [Person]');
	await knex.raw('CREATE SCHEMA [Place]');
	await knex.raw('CREATE SCHEMA [Security]');
	await knex.raw('CREATE SCHEMA [YHIS]');
	await knex.raw('CREATE SCHEMA [YRHP]');
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.raw('DROP SCHEMA [AirCrash]');
	await knex.raw('DROP SCHEMA [Boat]');
	await knex.raw('DROP SCHEMA [Burial]');
	await knex.raw('DROP SCHEMA [InterpretiveSite]');
	await knex.raw('DROP SCHEMA [Person]');
	await knex.raw('DROP SCHEMA [Place]');
	await knex.raw('DROP SCHEMA [Security]');
	await knex.raw('DROP SCHEMA [YHIS]');
	await knex.raw('DROP SCHEMA [YRHP]');
};
