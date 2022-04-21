import { Knex } from 'knex';

import { User } from '../models';

export abstract class BasePolicyScope {
	_scope: Knex.QueryBuilder;
	user: User;

	constructor(scope: Knex.QueryBuilder, user: User) {
		this._scope = scope.clone();
		this.user = user;
	}

	resolve(): Knex.QueryBuilder {
		throw new Error('not implemented');
	}

	get emptyScope(): Knex.QueryBuilder {
		return this.scope.whereRaw('(1=0)');
	}

	get scope(): Knex.QueryBuilder {
		return this._scope.clone();
	}
	set scope(value: Knex.QueryBuilder) {
		this._scope = value;
	}
}
