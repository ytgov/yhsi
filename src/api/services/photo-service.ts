import Knex from 'knex';
import { QueryStatement, SortStatement } from './';
import { Photo, PHOTO_FIELDS } from '../data';

export class PhotoService {
	private knex: Knex;

	constructor(config: Knex.Config<any>) {
		this.knex = Knex(config);
	}

	async getAll(skip: number, take: number): Promise<Array<Photo>> {
		return this.knex('photo')
			.select<Photo[]>(PHOTO_FIELDS)
			.orderBy('rowId')
			.offset(skip)
			.limit(take);
	}

	async getById(id: string): Promise<Photo | undefined> {
		return this.knex('photo')
			.select<Photo>(PHOTO_FIELDS)
			.where({ rowId: id })
			.first()
			.catch((err: Error) => {
				console.log('BOMBED', err);
				return undefined;
			});
	}

	async getAllForPlace(id: number): Promise<Photo[]> {
		return this.knex('photo')
			.select<Photo[]>(PHOTO_FIELDS)
			.where({ placeId: id })
			.catch((err: Error) => {
				console.log('BOMBED', err);
				return new Array<Photo>();
			});
	}

	async getFileById(id: string): Promise<Photo | undefined> {
		return this.knex('photo')
			.select<Photo>('file')
			.where({ rowId: id })
			.first()
			.catch((err: Error) => {
				console.log('BOMBED', err);
				return undefined;
			});
	}

	async getPhotoCount(): Promise<number> {
		return new Promise(async (resolve, reject) => {
			let results = await this.knex<number>('photo').count('*', {
				as: 'count',
			});

			if (results) {
				let val = results[0].count as number;
				resolve(val);
			}

			resolve(0);
		});
	}

	async addPhoto(item: Photo): Promise<Photo | undefined> {
		return this.knex('photo').insert(item).returning<Photo>(PHOTO_FIELDS);
	}

	async updatePhoto(id: string, item: Photo): Promise<Photo | undefined> {
		return this.knex('photo')
			.where({ rowId: id })
			.update(item)
			.returning<Photo>(PHOTO_FIELDS);
	}

	async doSearch(
		query: Array<QueryStatement>,
		sort: Array<SortStatement>,
		page: number,
		page_size: number,
		skip: number,
		take: number
	): Promise<any> {
		return new Promise(async (resolve, reject) => {
			let selectStmt = this.knex('photo');
			let countStmt = this.knex('photo');

			if (query && query.length > 0) {
				query.forEach((stmt) => {
					switch (stmt.operator) {
						case 'eq': {
							let p = {};
							let m = `{"${stmt.field}": "${stmt.value}"}`;
							Object.assign(p, JSON.parse(m));
							selectStmt.where(p);
							countStmt.where(p);
							break;
						}
						case 'in': {
							let items = stmt.value.split(',');
							countStmt.whereIn(stmt.field, items);
							selectStmt.whereIn(stmt.field, items);
							break;
						}
						case 'notin': {
							let items = stmt.value.split(',');
							countStmt.whereNotIn(stmt.field, items);
							selectStmt.whereNotIn(stmt.field, items);
							break;
						}
						case 'gt': {
							selectStmt.where(stmt.field, '>', stmt.value);
							countStmt.where(stmt.field, '>', stmt.value);
							break;
						}
						case 'gte': {
							selectStmt.where(stmt.field, '>=', stmt.value);
							countStmt.where(stmt.field, '>=', stmt.value);
							break;
						}
						case 'lt': {
							selectStmt.where(stmt.field, '<', stmt.value);
							countStmt.where(stmt.field, '<', stmt.value);
							break;
						}
						case 'lte': {
							console.log(`Testing ${stmt.field} for IN on ${stmt.value}`);
							selectStmt.where(stmt.field, '<=', stmt.value);
							countStmt.where(stmt.field, '<=', stmt.value);
							break;
						}
						case 'contains': {
							selectStmt.whereRaw(
								`LOWER(${stmt.field}) like '%${stmt.value.toLowerCase()}%'`
							);
							countStmt.whereRaw(
								`LOWER(${stmt.field}) like '%${stmt.value.toLowerCase()}%'`
							);
							break;
						}
						default: {
							console.log(`IGNORING ${stmt.field} on ${stmt.value}`);
						}
					}
				});
			}

			if (sort && sort.length > 0) {
				sort.forEach((stmt) => {
					selectStmt.orderBy(stmt.field, stmt.direction);
				});
			} else {
				selectStmt.orderBy('photo.rowId');
			}

			let item_count = await countStmt
				.count('*', { as: 'counter' })
				.then((t: any) => t)
				.catch((err: Error) => {
					console.log('COUNT Query Error');
					return reject(err);
				});

			let count = 0;

			if (item_count) {
				let t = item_count[0];
				let y = t.counter as string;
				count = parseInt(y);
			}

			let page_count = Math.ceil(count / page_size);
			let data = await selectStmt
				.select<Photo[]>(PHOTO_FIELDS)
				.offset(skip)
				.limit(take);
			let results = {
				data,
				meta: { page, page_size, item_count: count, page_count },
			};

			resolve(results);
		});
	}
}
