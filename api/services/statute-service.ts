import db from 'db/db-client';
import { Statute } from '../models';

export class StatuteService {
	getAll() {
		return db<Statute>('Statute').select(
			'id',
			'recognitionAuthority',
			'recognitionType',
			'description',
			'allStatute'
		);
	}
}
