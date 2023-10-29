import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.raw(`INSERT INTO Security.[User] (email, first_name, last_name, create_date, roles, status) VALUES
	('ryanjagar@gmail.com', 'Ryan', 'Agar', '2023-05-15 14:58:46.000', 'Administrator', 'Active'),
	('diedre@driftgeomatics.com', 'Diedre', 'Davidson', '2023-05-16 01:28:18.000', 'Administrator', 'Active'),
	('maxrparker@gmail.com', 'Max', 'Parker', '2023-06-06 17:53:18.000', 'Administrator', 'Active')`);
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.raw(`DELETE FROM Security.[User] WHERE 1=1`);
};
