import { Knex } from 'knex';

import { User } from '../models';

export abstract class BasePolicyScope {
	scope: Knex.QueryBuilder;
	user: User;

	constructor(scope: Knex.QueryBuilder, user: User) {
		this.scope = scope.clone();
		this.user = user;
	}

	resolve(): Knex.QueryBuilder {
		throw new Error('not implemented');
	}

	get emptyScope(): Knex.QueryBuilder {
		return this.scope.whereRaw('(1=0)');
	}
}
