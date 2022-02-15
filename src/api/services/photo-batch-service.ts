import knex, { Knex } from 'knex';
import { QueryStatement, SortStatement } from './';
import {
	Photo,
	PhotoBatch,
	PhotoBatchPhoto,
	PHOTO_FIELDS,
	PHOTO_BATCH_FIELDS,
	SavedFilter,
} from '../data';
import _ from 'lodash';

export class PhotoBatchService {
	private knex: Knex;

	constructor(config: Knex.Config<any>) {
		this.knex = knex(config);
	}

	async getAll(skip: number, take: number): Promise<Array<any>> {
		return this.knex('photobatch')
			.select(PHOTO_BATCH_FIELDS)
			.select(this.knex.raw('photobatch.id as batchId'))
			.leftOuterJoin(
				'photobatchphoto',
				'photobatch.id',
				'photobatchphoto.photobatchid'
			)
			.count('photobatchphoto.id', { as: 'photoCount' })
			.groupBy(PHOTO_BATCH_FIELDS)
			.groupBy(this.knex.raw('photobatch.id'))
			.orderBy('photobatch.name')
			.offset(skip)
			.limit(take);
	}

	async getPhotoBatchCount(): Promise<number> {
		return new Promise(async (resolve, reject) => {
			let results = await this.knex<number>('photobatch').count('*', {
				as: 'count',
			});

			if (results) {
				let val = results[0].count as number;
				resolve(val);
			}

			resolve(0);
		});
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
			let selectStmt = this.knex('photobatch')
				.select(PHOTO_BATCH_FIELDS)
				.select(this.knex.raw('photobatch.id as batchId'))
				.select(this.knex.raw('photobatch.userId as userName'))
				.leftOuterJoin(
					'photobatchphoto',
					'photobatch.id',
					'photobatchphoto.photobatchid'
				)
				.count('photobatchphoto.id', { as: 'photoCount' })
				.groupBy(PHOTO_BATCH_FIELDS)
				.groupBy(this.knex.raw('photobatch.id'))
				.groupBy(this.knex.raw('photobatch.userId'));

			if (query && query.length > 0) {
				query.forEach((stmt: any) => {
					switch (stmt.operator) {
						case 'eq': {
							let p = {};
							let m = `{"${stmt.field}": "${stmt.value}"}`;
							Object.assign(p, JSON.parse(m));
							selectStmt.orWhere(p);
							break;
						}
						case 'in': {
							let items = stmt.value.split(',');
							selectStmt.orWhereIn(stmt.field, items);
							break;
						}
						case 'notin': {
							let items = stmt.value.split(',');
							selectStmt.whereNotIn(stmt.field, items);
							break;
						}
						case 'gt': {
							selectStmt.orWhere(stmt.field, '>', stmt.value);
							break;
						}
						case 'gte': {
							selectStmt.orWhere(stmt.field, '>=', stmt.value);
							break;
						}
						case 'lt': {
							selectStmt.orWhere(stmt.field, '<', stmt.value);
							break;
						}
						case 'lte': {
							//console.log(`Testing ${stmt.field} for IN on ${stmt.value}`)
							selectStmt.orWhere(stmt.field, '<=', stmt.value);
							break;
						}
						case 'contains': {
							selectStmt.orWhereRaw(
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
				selectStmt.orderBy('photobatch.name');
			}

			let fullData = await selectStmt;
			//let uniqIds = _.uniq(fullData.map(i => i.batchId));
			let count = fullData.length;
			let page_count = Math.ceil(count / page_size);

			let data = await selectStmt.offset(skip).limit(take);
			let results = {
				data,
				meta: { page, page_size, item_count: count, page_count },
			};

			resolve(results);
		});
	}

	async getById(id: string): Promise<PhotoBatch | undefined> {
		return this.knex('photobatch')
			.select<PhotoBatch>(PHOTO_BATCH_FIELDS)
			.where({ id: id })
			.first()
			.catch((err) => {
				console.log('BOMBED', err);
				return undefined;
			});
	}

	async addBatch(item: PhotoBatch): Promise<PhotoBatch | undefined> {
		let fields = _.clone(PHOTO_BATCH_FIELDS);
		fields.push('id');
		return this.knex('PhotoBatch').insert(item).returning<PhotoBatch>(fields);
	}

	async getPhotos(id: string): Promise<PhotoBatchPhoto | undefined> {
		return this.knex('photobatchphoto')
			.select<PhotoBatchPhoto>([
				'id',
				'photoBatchId',
				'photoFile',
				'photoFileName',
				'photoContentType',
			])
			.where({ photoBatchId: id })
			.catch((err) => {
				console.log('BOMBED', err);
				return undefined;
			});
	}

	async processBatch(id: string): Promise<any> {
		return this.knex.raw(
			`insert into Photo (
            [placeId], [communityId], [nTSMapNumber], [address], [dateCreated], [yHSIRecord], [bordenRecord], [paleoRecord], [archivalRecord]
            , [isOtherRecord], [originalMediaId], [originalRecord], [mediaStorage], [comments], [caption], [copyright], [creditLine], [ownerId], [photoProjectId]
            , [program], [creator], [communityName], [location], [usageRights], [isComplete], [subjects], [isPrivate]
            , "file", featureName, originalFileName 
            ) OUTPUT Inserted.rowid
            select [placeId], [communityId], [nTSMapNumber], [address], [dateCreated], [yHSIRecord], [bordenRecord], [paleoRecord], [archivalRecord]
            , [isOtherRecord], [originalMediaId], [originalRecord], [mediaStorage], [comments], [caption], [copyright], [creditLine], [ownerId], [photoProjectId]
            , [program], [creator], [communityName], [location], [usageRights], [isComplete], [subjects], [isPrivate]
            , photobatchphoto.photoFile as "file", photobatchphoto.photoFileName as featureName, photobatchphoto.photoFileName as originalFileName 
            from [photobatch] left outer join [photobatchphoto] on [photobatch].[id] = [photobatchphoto].[photobatchid]
            where photobatch.id = ?`,
			id
		);
	}

	async deleteBatch(id: number): Promise<any> {
		this.knex('photobatchphoto').where({ photoBatchId: id }).delete();
		return this.knex('photobatch').where({ id }).delete();
	}

	async updateBatch(
		id: string,
		item: PhotoBatch
	): Promise<PhotoBatch | undefined> {
		return this.knex('PhotoBatch')
			.where({ id: id })
			.update(item)
			.returning<PhotoBatch>(PHOTO_BATCH_FIELDS);
	}

	async deletePhoto(id: number): Promise<any> {
		return this.knex('photobatchphoto').where({ id }).delete();
	}

	async addPhoto(item: PhotoBatchPhoto): Promise<PhotoBatchPhoto | undefined> {
		return this.knex('PhotoBatchPhoto')
			.insert(item)
			.returning<PhotoBatchPhoto>([
				'id',
				'photoBatchId',
				'photoFile',
				'photoFileName',
				'photoContentType',
			]);
	}
}
