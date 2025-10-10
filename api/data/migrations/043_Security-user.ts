// -- BEGIN TABLE Security.User
// IF OBJECT_ID('Security.[User]', 'U') IS NOT NULL
// DROP TABLE Security.[User];
// GO

// CREATE TABLE Security.[User] (
// 	id int NOT NULL IDENTITY(1,1),
// 	email nvarchar(200) NOT NULL,
// 	first_name nvarchar(100) NOT NULL,
// 	last_name nvarchar(100) NOT NULL,
// 	create_date datetime2(0) NOT NULL DEFAULT (getdate()),
// 	expire_date date NULL,
// 	last_login_date datetime2(0) NULL,
// 	roles nvarchar(1000) NULL,
// 	status nvarchar(50) NOT NULL
// );
// GO

// ALTER TABLE Security.[User] ADD CONSTRAINT PK__User__3213E83F4B561AA5 PRIMARY KEY (id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex) {
	await knex.raw(
		/* sql */ "IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Security') BEGIN EXEC('CREATE SCHEMA [Security]') END"
	);

	await knex.schema.createTable('Security.User', (table) => {
		table.increments('id').primary();
		table.string('email', 200).notNullable();
		table.string('first_name', 100).notNullable();
		table.string('last_name', 100).notNullable();
		table.dateTime('create_date').notNullable(); //Was default to now
		table.date('expire_date').nullable();
		table.dateTime('last_login_date').nullable();
		table.string('roles', 1000).nullable();
		table.string('status', 50).notNullable();
	});

	// await knex.raw(`INSERT INTO Security.[User] (email, first_name, last_name, create_date, status) VALUES
	// ('ryanjagar@gmail.com', 'Ryan', 'Agar', '2023-05-15 14:58:46.000', 'Active'),
	// ('diedre@driftgeomatics.com', 'Diedre', 'Davidson', '2023-05-16 01:28:18.000', 'Active'),
	// ('maxrparker@gmail.com', 'Max', 'Parker', '2023-06-06 17:53:18.000', 'Active')`);
};

exports.down = async function (knex: Knex) {
	await knex.schema.dropTable('Security.User');
};
