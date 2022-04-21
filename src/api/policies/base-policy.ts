import { Knex } from 'knex';

import { User } from '../models';

export abstract class BasePolicy<Type> {
	record: Type;
	user: User;

	constructor(user: User, record: Type) {
		this.user = user;
		this.record = record;
	}

	show(): Boolean {
		throw new Error('not implemented');
	}

	create(): Boolean {
		throw new Error('not implemented');
	}

	update(): Boolean {
		throw new Error('not implemented');
	}

	delete(): Boolean {
		throw new Error('not implemented');
	}

	scope(user: User): Knex.QueryBuilder {
		throw new Error('not implemented');
	}
}

export default BasePolicy;
