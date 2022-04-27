import knex, { Knex } from 'knex';
import { QueryStatement, SortStatement } from './';
import { Photo, PHOTO_FIELDS } from '../data';
import { DB_CONFIG } from '../config';
import { burialsRouter } from 'routes';
const db = knex(DB_CONFIG);
export class BoatService {
	async getAll() {
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
			.where('boat.history.uid', boatId)
			.orderBy('boat.history.id', 'desc');

		return boat;
	}

	async doSearch(page: number, limit: number, offset: number, filters: any) {
		let counter = [{ count: 0 }];
		let boats = [];
		const {
			textToMatch = '',
			Owner,
			ConstructionDate = '',
			ServiceStart = '',
			ServiceEnd = '',
			VesselType = '',
			sortBy,
			sort,
		} = filters;
		//console.log("FILTERS", filters, limit);
		if (limit === 0) {
			counter = await db
				.from('boat.boat')
				.where((builder) => {
					if (textToMatch !== '')
						builder.where('Name', 'like', `%${textToMatch}%`);
					if (ConstructionDate !== '')
						builder.where('ConstructionDate', 'like', `%${ConstructionDate}%`);
					if (ServiceStart !== '')
						builder.where('ServiceStart', 'like', `%${ServiceStart}%`);
					if (ServiceEnd !== '')
						builder.where('ServiceEnd', 'like', `%${ServiceEnd}%`);
				})
				.count('Id', { as: 'count' });

			boats = await db
				.select('*')
				.from('boat.boat')
				.where((builder) => {
					if (textToMatch !== '')
						builder.where('Name', 'like', `%${textToMatch}%`);
					if (ConstructionDate !== '')
						builder.where('ConstructionDate', 'like', `%${ConstructionDate}%`);
					if (ServiceStart !== '')
						builder.where('ServiceStart', 'like', `%${ServiceStart}%`);
					if (ServiceEnd !== '')
						builder.where('ServiceEnd', 'like', `%${ServiceEnd}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`);
		} else {
			counter = await db
				.from('boat.boat')
				.where((builder) => {
					if (textToMatch !== '')
						builder.where('Name', 'like', `%${textToMatch}%`);
					if (ConstructionDate !== '')
						builder.where('ConstructionDate', 'like', `%${ConstructionDate}%`);
					if (ServiceStart !== '')
						builder.where('ServiceStart', 'like', `%${ServiceStart}%`);
					if (ServiceEnd !== '')
						builder.where('ServiceEnd', 'like', `%${ServiceEnd}%`);
				})
				.count('Id', { as: 'count' });

			boats = await db
				.select('*')
				.from('boat.boat')
				.where((builder) => {
					if (textToMatch !== '')
						builder.where('Name', 'like', `%${textToMatch}%`);
					if (ConstructionDate !== '')
						builder.where('ConstructionDate', 'like', `%${ConstructionDate}%`);
					if (ServiceStart !== '')
						builder.where('ServiceStart', 'like', `%${ServiceStart}%`);
					if (ServiceEnd !== '')
						builder.where('ServiceEnd', 'like', `%${ServiceEnd}%`);
				})
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
		//console.log("BOATS", boats.length);
		return { count: counter[0].count, body: boats };
	}

	async getOwnerNames(boatId: number) {
		return await db
			.select('boat.Owner.ownerName')
			.from('boat.boatowner')
			.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
			.where('boat.boatowner.boatid', boatId);
	}
}
