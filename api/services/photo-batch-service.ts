import _ from 'lodash';

import db from '@/db/db-client';

import { QueryStatement, SortStatement } from './';
import { PhotoBatch, PhotoBatchPhoto, PHOTO_BATCH_FIELDS } from '../data';

export class PhotoBatchService {
	async getAll(skip: number, take: number): Promise<Array<any>> {
		return db('photobatch')
			.select(PHOTO_BATCH_FIELDS)
			.select(db.raw('photobatch.id as batchId'))
			.leftOuterJoin('photobatchphoto', 'photobatch.id', 'photobatchphoto.photobatchid')
			.count('photobatchphoto.id', { as: 'photoCount' })
			.groupBy(PHOTO_BATCH_FIELDS)
			.groupBy(db.raw('photobatch.id'))
			.orderBy('photobatch.name')
			.offset(skip)
			.limit(take);
	}

	async getPhotoBatchCount(): Promise<number> {
		const results = await db<number>('photobatch').count('*', {
			as: 'count',
		});

		if (!results) {
			throw new Error('No results found');
		}

		return results[0].count as number;
	}

	async doSearch(
		query: Array<QueryStatement>,
		sort: Array<SortStatement>,
		page: number,
		page_size: number,
		skip: number,
		take: number
	): Promise<any> {
		const selectStmt = db('photobatch')
			.select(PHOTO_BATCH_FIELDS)
			.select(db.raw('photobatch.id as batchId'))
			.select(db.raw("security.[user].first_name + ' ' + security.[user].last_name as userName"))
			.leftOuterJoin('photobatchphoto', 'photobatch.id', 'photobatchphoto.photobatchid')
			.leftOuterJoin('security.[user]', 'photobatch.userid', 'security.[user].id')
			.count('photobatchphoto.id', { as: 'photoCount' })
			.groupBy(PHOTO_BATCH_FIELDS)
			.groupBy(db.raw('security.[user].first_name'))
			.groupBy(db.raw('security.[user].last_name'))
			.groupBy(db.raw('photobatch.id'))
			.groupBy(db.raw('photobatch.userId'))
			.orderBy('photobatch.dateCreated', 'desc');

		if (query && query.length > 0) {
			query.forEach((stmt: any) => {
				switch (stmt.operator) {
					case 'eq': {
						const p = {};
						const m = `{"${stmt.field}": "${stmt.value}"}`;
						Object.assign(p, JSON.parse(m));
						selectStmt.orWhere(p);
						break;
					}
					case 'in': {
						const items = stmt.value.split(',');
						selectStmt.orWhereIn(stmt.field, items);
						break;
					}
					case 'notin': {
						const items = stmt.value.split(',');
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
						selectStmt.orWhere(stmt.field, '<=', stmt.value);
						break;
					}
					case 'contains': {
						selectStmt.orWhereRaw(`LOWER(${stmt.field}) like '%${stmt.value.toLowerCase()}%'`);
						break;
					}
					default: {
						//console.log(`IGNORING ${stmt.field} on ${stmt.value}`);
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

		const fullData = await selectStmt;
		//const uniqIds = _.uniq(fullData.map(i => i.batchId));
		const count = fullData.length;
		const page_count = Math.ceil(count / page_size);

		const data = await selectStmt.offset(skip).limit(take);
		const results = {
			data,
			meta: { page, page_size, item_count: count, page_count },
		};

		return results;
	}

	async getById(id: string): Promise<PhotoBatch | undefined> {
		return db('photobatch')
			.select<PhotoBatch>(PHOTO_BATCH_FIELDS)
			.where({ id: id })
			.first()
			.catch(() => {
				return undefined;
			});
	}

	async findBatchByName(name: string): Promise<PhotoBatch | undefined> {
		return db('PhotoBatch').select('Id as id', 'Name as name').where({ name }).first();
	}

	async addBatch(item: PhotoBatch): Promise<PhotoBatch | undefined> {
		const fields = _.clone(PHOTO_BATCH_FIELDS);
		fields.push('id');
		return db('PhotoBatch').insert(item).returning<PhotoBatch>(fields);
	}

	async getPhotos(id: string): Promise<PhotoBatchPhoto | undefined> {
		return db('photobatchphoto')
			.select<PhotoBatchPhoto>([
				'id',
				'photoBatchId',
				'thumbFile',
				'photoFileName',
				'photoContentType',
			])
			.where({ photoBatchId: id })
			.catch(() => {
				return undefined;
			});
	}

	async processBatch(id: string): Promise<any> {
		return db.raw(
			`insert into Photo (
            [placeId], [communityId], [nTSMapNumber], [address], [dateCreated], [yHSIRecord], [bordenRecord], [paleoRecord], [archivalRecord]
            , [isOtherRecord], [originalMediaId], [originalRecord], [mediaStorage], [comments], [caption], [copyright], [creditLine], [ownerId], [photoProjectId]
            , [program], [creator], [communityName], [location], [usageRights], [isComplete], [subjects], [isPrivate],
						[IsSiteDefault], 
						"file", featureName, originalFileName 
            ) OUTPUT Inserted.rowid
            select [placeId], [communityId], [nTSMapNumber], [address], [dateCreated], [yHSIRecord], [bordenRecord], [paleoRecord], [archivalRecord]
            , [isOtherRecord], [originalMediaId], [originalRecord], [mediaStorage], [comments], [caption], [copyright], [creditLine], [ownerId], [photoProjectId]
            , [program], [creator], [communityName], [location], [usageRights], [isComplete], [subjects], [isPrivate], 0 as [IsSiteDefault]
            , photobatchphoto.photoFile as "file", photobatchphoto.photoFileName as featureName, photobatchphoto.photoFileName as originalFileName 
            from [photobatch] left outer join [photobatchphoto] on [photobatch].[id] = [photobatchphoto].[photobatchid]
            where photobatch.id = ?`,
			id
		);
	}

	async deleteBatch(id: number): Promise<any> {
		await db('photobatchphoto').where({ photoBatchId: id }).delete();
		return db('photobatch').where({ id }).delete();
	}

	async updateBatch(id: string, item: PhotoBatch): Promise<PhotoBatch | undefined> {
		return db('PhotoBatch')
			.where({ id: id })
			.update(item)
			.returning<PhotoBatch>(PHOTO_BATCH_FIELDS);
	}

	async deletePhoto(id: number): Promise<any> {
		return db('photobatchphoto').where({ id }).delete();
	}

	async addPhoto(item: PhotoBatchPhoto): Promise<PhotoBatchPhoto | undefined> {
		return db('PhotoBatchPhoto')
			.insert(item)
			.returning<PhotoBatchPhoto>([
				'id',
				'photoBatchId',
				'thumbFile',
				'photoFileName',
				'photoContentType',
			]);
	}
}
