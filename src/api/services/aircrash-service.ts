import knex, { Knex } from 'knex';
import { QueryStatement, SortStatement } from './';
import { Photo, PHOTO_FIELDS } from '../data';
import { DB_CONFIG } from '../config';
const db = knex(DB_CONFIG);
export class AircrashService {

	async getAll(){
        const sortBy = 'YACSINumber';
	    const sort = 'asc';

		return await db
            .select('*')
            .from('dbo.vAircrash')
            .orderBy(`${sortBy}`, `${sort}`);
	}

	async getById(aircrashId: string) {	
		const aircrash = await db
			.select('*')
			.from('dbo.vAircrash')
			.where('dbo.vAircrash.yacsinumber', aircrashId)
			.first();

        if (!aircrash) {
            return null;
        }

		aircrash.infoSources = await db
			.select('*')
			.from('AirCrash.InfoSource')
			.where('AirCrash.InfoSource.YACSINumber', aircrashId);

        return aircrash;
    }

    async doSearch( page: number, limit: number, offset: number, filters: any){
        const {
			textToMatch = '',
			sortBy = 'yacsinumber',
			sort = 'asc',
		} = filters;
		let counter = [{ count: 0 }];
		let aircrashes = [];

		if(limit === 0){
			counter = await db
				.from('dbo.vAircrash')
				.where('yacsinumber', 'like', `%${textToMatch}%`)
				.orWhere('crashdate', 'like', `%${textToMatch}%`)
				.orWhere('aircrafttype', 'like', `%${textToMatch}%`)
				.orWhere('aircraftregistration', 'like', `%${textToMatch}%`)
				.orWhere('nation', 'like', `%${textToMatch}%`)
				.orWhere('militarycivilian', 'like', `%${textToMatch}%`)
				.orWhere('crashlocation', 'like', `%${textToMatch}%`)
				.orWhere('pilot', 'like', `%${textToMatch}%`)
				.orWhere('soulsonboard', 'like', `%${textToMatch}%`)
				.orWhere('injuries', 'like', `%${textToMatch}%`)
				.orWhere('fatalities', 'like', `%${textToMatch}%`)
				.count('yacsinumber', { as: 'count' });

			aircrashes = await db
				.select('*')
				.from('dbo.vAircrash')
				.where('yacsinumber', 'like', `%${textToMatch}%`)
				.orWhere('crashdate', 'like', `%${textToMatch}%`)
				.orWhere('aircrafttype', 'like', `%${textToMatch}%`)
				.orWhere('aircraftregistration', 'like', `%${textToMatch}%`)
				.orWhere('nation', 'like', `%${textToMatch}%`)
				.orWhere('militarycivilian', 'like', `%${textToMatch}%`)
				.orWhere('crashlocation', 'like', `%${textToMatch}%`)
				.orWhere('pilot', 'like', `%${textToMatch}%`)
				.orWhere('soulsonboard', 'like', `%${textToMatch}%`)
				.orWhere('injuries', 'like', `%${textToMatch}%`)
				.orWhere('fatalities', 'like', `%${textToMatch}%`)
				.orderBy(`${sortBy}`, `${sort}`);
		}
		else if (textToMatch) {
			counter = await db
				.from('dbo.vAircrash')
				.where('yacsinumber', 'like', `%${textToMatch}%`)
				.orWhere('crashdate', 'like', `%${textToMatch}%`)
				.orWhere('aircrafttype', 'like', `%${textToMatch}%`)
				.orWhere('aircraftregistration', 'like', `%${textToMatch}%`)
				.orWhere('nation', 'like', `%${textToMatch}%`)
				.orWhere('militarycivilian', 'like', `%${textToMatch}%`)
				.orWhere('crashlocation', 'like', `%${textToMatch}%`)
				.orWhere('pilot', 'like', `%${textToMatch}%`)
				.orWhere('soulsonboard', 'like', `%${textToMatch}%`)
				.orWhere('injuries', 'like', `%${textToMatch}%`)
				.orWhere('fatalities', 'like', `%${textToMatch}%`)
				.count('yacsinumber', { as: 'count' });

			aircrashes = await db
				.select('*')
				.from('dbo.vAircrash')
				.where('yacsinumber', 'like', `%${textToMatch}%`)
				.orWhere('crashdate', 'like', `%${textToMatch}%`)
				.orWhere('aircrafttype', 'like', `%${textToMatch}%`)
				.orWhere('aircraftregistration', 'like', `%${textToMatch}%`)
				.orWhere('nation', 'like', `%${textToMatch}%`)
				.orWhere('militarycivilian', 'like', `%${textToMatch}%`)
				.orWhere('crashlocation', 'like', `%${textToMatch}%`)
				.orWhere('pilot', 'like', `%${textToMatch}%`)
				.orWhere('soulsonboard', 'like', `%${textToMatch}%`)
				.orWhere('injuries', 'like', `%${textToMatch}%`)
				.orWhere('fatalities', 'like', `%${textToMatch}%`)
				//.orderBy('yacsinumber', 'asc')
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db
				.from('dbo.vAircrash')
				.count('yacsinumber', { as: 'count' });

			aircrashes = await db
				.select('*')
				.from('dbo.vAircrash')
				//.orderBy('dbo.vAircrash.yacsinumber', 'asc')
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}

        return { count: counter[0].count, body: aircrashes };

    }

}
