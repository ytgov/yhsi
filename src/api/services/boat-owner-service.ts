import knex, { Knex } from 'knex';
import { QueryStatement, SortStatement } from './';
import { DB_CONFIG } from '../config';
const db = knex(DB_CONFIG);
export class BoatOwnerService {

	async getAll(){
        const sortBy = 'OwnerName';
	    const sort = 'asc';

		return await db.select(
                'boat.Owner.OwnerName'
            )
            .distinct('boat.boatowner.ownerid')
            .from('boat.boatowner')
            .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
            .orderBy(`${sortBy}`, `${sort}`); 
	}

	async getById(ownerId: string) {	

		const owner = await db
			.select('*')
			.from('Boat.Owner AS OW')
			//.join('Boat.BoatOwner AS BO', 'BO.ownerid', '=', 'OW.id')
			.where('OW.id', ownerId).first();

		owner.boats = await db
				// .select('OW.BoatID','BO.Name','OW.OwnerId')
				// .from('Boat.BoatOwner AS OW')
				// .join('Boat.Boat AS BO', 'BO.Id', '=', 'OW.BoatId')
				// .where('BO.Name', ownerId)
				// .orderBy('BO.Name', 'asc');
			.select('BOO.BoatID','BO.Name','BOO.OwnerID')
			.from('boat.boat AS BO')
			.join('boat.BoatOwner AS BOO', 'BOO.boatid', '=', 'BO.id')
			.where('BOO.ownerid', ownerId)
			.orderBy('BOO.BoatID', 'desc');
		owner.histories = await db
			.select('*')
			.from('boat.OwnerHistory')
			.orderBy('Id', 'desc')
			.where('boat.OwnerHistory.OwnerId', ownerId);
	
		owner.alias = await db
			.select('*')
			.from('boat.owneralias')
			.orderBy('Id','desc')
			.where('boat.owneralias.ownerid', ownerId);

        return owner;
    }

    async doSearch( page: number, limit: number, offset: number, filters: any){
        const {
			textToMatch = '',
			sortBy = 'ownername',
			sort = 'asc',
		} = filters;
		let counter = [{ count: 0 }];
		let owners = [];

		if (textToMatch) {
			counter = await db
				.from('boat.Owner AS BO')
				.where('BO.OwnerName', 'like', `%${textToMatch}%`)
				.count('BO.id', { as: 'count' });

			owners = await db
				.select(
					'OW.OwnerName',
					'OW.id'
				)
				.from('boat.Owner AS OW')
				.orderBy(`${sortBy}`, `${sort}`)
				.where('OW.OwnerName', 'like', `%${textToMatch}%`)
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db
				.from('boat.Owner AS BO')
				.count('BO.id', { as: 'count' });

			owners = await db
				.select(
					'OW.OwnerName',
					'OW.id'
				)
				.from('boat.Owner AS OW')
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
		return { count: counter[0].count, body: owners };
    }
}
