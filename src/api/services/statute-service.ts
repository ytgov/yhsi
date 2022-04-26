import knex, { Knex } from 'knex';

import { Statute } from '../models';

export class StatuteService {
	private db: Knex;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
	}

	getAll() {
		return this.db<Statute>('Statute').select(
			'id',
			'recognitionAuthority',
			'recognitionType',
			'description',
			'allStatute'
		);
	}
}
