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
			.distinct('boat.boatowner.ownerid')
			.from('boat.boatowner')
			.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
			.where('boat.boatowner.ownerid', ownerId)
			.first();

		owner.boats = await db
			.select('*')
			.from('boat.boat')
			.join('boat.BoatOwner', 'boat.BoatOwner.boatid', '=', 'boat.boat.id')
			.where('boat.boatowner.ownerid', ownerId);

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
			sortBy = 'ownerid',
			sort = 'asc',
		} = filters;
		let counter = [{ count: 0 }];
		let owners = [];

		if (textToMatch) {
			counter = await db
				.from('boat.Owner AS BO')
				.join('boat.boatowner AS CO', 'CO.ownerid', '=', 'BO.Id')
				.where('BO.OwnerName', 'like', `%${textToMatch}%`)
				.countDistinct('BO.id', { as: 'count' });

			owners = await db
				.select(
					'boat.boatowner.currentowner',
					'boat.Owner.OwnerName',
					'boat.owner.id'
				)
				.distinct('boat.boatowner.ownerid')
				.from('boat.boatowner')
				.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
				//.orderBy('boat.boatowner.ownerid', 'asc')
				.orderBy(`${sortBy}`, `${sort}`)
				.where('boat.Owner.OwnerName', 'like', `%${textToMatch}%`)
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db
				.from('boat.Owner AS BO')
				.join('boat.boatowner AS CO', 'CO.ownerid', '=', 'BO.Id')
				.countDistinct('BO.id', { as: 'count' });

			owners = await db
				.select(
					'boat.boatowner.currentowner',
					'boat.Owner.OwnerName',
					'boat.owner.id'
				)
				.distinct('boat.boatowner.ownerid')
				.from('boat.boatowner')
				.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
				//.orderBy('boat.boatowner.ownerid', 'asc')
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}

		return { count: counter[0].count, body: owners };

    }

}
