import { Knex } from 'knex';
import { isNil } from 'lodash';

export async function seed(knex: Knex): Promise<void> {
	const usersAttributes = [
		{
			email: 'admin@example.com',
			first_name: 'System',
			last_name: 'Administrator',
			create_date: new Date(),
			roles: 'Administrator',
			status: 'Active',
		},
	];

	for (const userAttributes of usersAttributes) {
		let user = await knex
			.withSchema('Security')
			.from('User')
			.where({ email: userAttributes.email })
			.first();

		if (isNil(user)) {
			[user] = await knex.withSchema('Security').insert(userAttributes).into('User').returning('*');
		} else {
			await knex.withSchema('Security').from('User').where('Id', user.Id).update(userAttributes);
		}
	}
}
