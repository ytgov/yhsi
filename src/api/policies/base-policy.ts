import knex, { Knex } from 'knex';

import { User } from '../models';

export abstract class BasePolicyScope {
	scope: Knex.QueryBuilder;
	user: User;

	constructor(scope: Knex.QueryBuilder, user: User) {
		this.scope = scope;
		this.user = user;
	}

	resolve(): Knex.QueryBuilder {
		throw new Error('not implemented');
	}

	get emptyScope(): Knex.QueryBuilder {
		return this.scope.whereRaw('(1=0)');
	}
}

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
}

export default BasePolicy;
