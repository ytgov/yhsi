import knex from 'knex';
import { QueryStatement, SortStatement } from './';
import { Photo, PHOTO_FIELDS } from '../data';
import { DB_CONFIG } from '../config';
import { burialsRouter } from 'routes';
const db = knex(DB_CONFIG);
export class BoatService {

	async getAll(){
        const sortBy = 'Name';
		const sort = 'asc';

		return await db
        .select('*')
        .from('boat.boat')
        .orderBy(`${sortBy}`, `${sort}`);
	}

	async getById(boatId: number) {	
        const boat = await db
			.select('*')
			.from('boat.boat')
			.where('boat.boat.id', boatId)
			.first();

		if (!boat) {
			return null;
		}

		boat.pastNames = await db
			.select('*')
			.from('boat.pastnames')
			.where('boat.pastnames.boatid', boatId);

		boat.owners = await db
			.select(
				'boat.boatowner.currentowner',
				'boat.Owner.OwnerName',
				'boat.owner.id'
			) //added boat.owner.id to the query (I need this for the details button)
			.from('boat.boatowner')
			.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
			.where('boat.boatowner.boatid', boatId);

		boat.histories = await db
			.select('*')
			.from('boat.history')
			.where('boat.history.uid', boatId);
            
        return boat;
    }

    async doSearch(textToMatch: any, page: number, limit: number, offset: number, sortBy: string, sort: string){
		let counter = [{ count: 0 }];
		let boats = [];

        if (textToMatch) {
			counter = await db
				.from('boat.boat')
				.where('name', 'like', `%${textToMatch}%`)
				.count('Id', { as: 'count' });

			boats = await db
				.select('*')
				.from('boat.boat')
				.where('name', 'like', `%${textToMatch}%`)
				//.orderBy('boat.boat.id', 'asc')
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db.from('boat.boat').count('Id', { as: 'count' });

			boats = await db
				.select('*')
				.from('boat.boat')
				//.orderBy('boat.boat.id', 'asc')
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}

		for (const boat of boats) {
			boat.owners = await db
				.select('boat.boatowner.currentowner', 'boat.Owner.OwnerName')
				.from('boat.boatowner')
				.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
				.where('boat.boatowner.boatid', boat.Id);
		}

        return { count: counter[0].count, body: boats };

    }

}
