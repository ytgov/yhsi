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
			//yacsinumber = '',
			crashdate = '',
			aircrafttype = '',
			aircraftregistration = '',
			nation = '',
			militarycivilian = '',
			crashlocation = '',
			pilot = '',
			soulsonboard = '',
			injuries = '',
			fatalities = ''
		} = filters;
		let counter = [{ count: 0 }];
		let aircrashes = [];

		if(limit === 0){
			counter = await db
				.from('dbo.vAircrash')
				.where(builder => {
					if(textToMatch !== '') builder.where('yacsinumber', 'like', `%${textToMatch}%`);
					if(crashdate !== '') builder.where('crashdate', 'like', `%${crashdate}%`);
					if(aircrafttype !== '') builder.where('aircrafttype', 'like', `%${aircrafttype}%`);
					if(aircraftregistration !== '') builder.where('aircraftregistration', 'like', `%${aircraftregistration}%`);
					if(nation !== '') builder.where('nation', 'like', `%${nation}%`);
					if(militarycivilian !== '') builder.where('militarycivilian', 'like', `%${militarycivilian}%`);
					if(crashlocation !== '') builder.where('crashlocation', 'like', `%${crashlocation}%`);
					if(pilot !== '') {
						builder.where('pilotfirstname', 'like', `%${pilot}%`);
						builder.where('pilotlastname', 'like', `%${pilot}%`);
					}
					if(injuries !== '') builder.where('injuries', 'like', `%${injuries}%`);
					if(fatalities !== '') builder.where('fatalities', 'like', `%${fatalities}%`);
					if(soulsonboard !== '') builder.where('soulsonboard', 'like', `%${soulsonboard}%`);
				})
				.count('yacsinumber', { as: 'count' });

			aircrashes = await db
				.select('*')
				.from('dbo.vAircrash')
				.where(builder => {
					if(textToMatch !== '') builder.where('yacsinumber', 'like', `%${textToMatch}%`);
					if(crashdate !== '') builder.where('crashdate', 'like', `%${crashdate}%`);
					if(aircrafttype !== '') builder.where('aircrafttype', 'like', `%${aircrafttype}%`);
					if(aircraftregistration !== '') builder.where('aircraftregistration', 'like', `%${aircraftregistration}%`);
					if(nation !== '') builder.where('nation', 'like', `%${nation}%`);
					if(militarycivilian !== '') builder.where('militarycivilian', 'like', `%${militarycivilian}%`);
					if(crashlocation !== '') builder.where('crashlocation', 'like', `%${crashlocation}%`);
					if(pilot !== '') {
						builder.where('pilotfirstname', 'like', `%${pilot}%`);
						builder.where('pilotlastname', 'like', `%${pilot}%`);
					}
					if(injuries !== '') builder.where('injuries', 'like', `%${injuries}%`);
					if(fatalities !== '') builder.where('fatalities', 'like', `%${fatalities}%`);
					if(soulsonboard !== '') builder.where('soulsonboard', 'like', `%${soulsonboard}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`);
		}
		else {
			counter = await db
				.from('dbo.vAircrash')
				.where(builder => {
					if(textToMatch !== '') builder.where('yacsinumber', 'like', `%${textToMatch}%`);
					if(crashdate !== '') builder.where('crashdate', 'like', `%${crashdate}%`);
					if(aircrafttype !== '') builder.where('aircrafttype', 'like', `%${aircrafttype}%`);
					if(aircraftregistration !== '') builder.where('aircraftregistration', 'like', `%${aircraftregistration}%`);
					if(nation !== '') builder.where('nation', 'like', `%${nation}%`);
					if(militarycivilian !== '') builder.where('militarycivilian', 'like', `%${militarycivilian}%`);
					if(crashlocation !== '') builder.where('crashlocation', 'like', `%${crashlocation}%`);
					if(pilot !== '') {
						builder.where('pilotfirstname', 'like', `%${pilot}%`);
						builder.where('pilotlastname', 'like', `%${pilot}%`);
					}
					if(injuries !== '') builder.where('injuries', 'like', `%${injuries}%`);
					if(fatalities !== '') builder.where('fatalities', 'like', `%${fatalities}%`);
					if(soulsonboard !== '') builder.where('soulsonboard', 'like', `%${soulsonboard}%`);
				})
				.count('yacsinumber', { as: 'count' });

			aircrashes = await db
				.select('*')
				.from('dbo.vAircrash')
				.where(builder => {
					if(textToMatch !== '') builder.where('yacsinumber', 'like', `%${textToMatch}%`);
					if(crashdate !== '') builder.where('crashdate', 'like', `%${crashdate}%`);
					if(aircrafttype !== '') builder.where('aircrafttype', 'like', `%${aircrafttype}%`);
					if(aircraftregistration !== '') builder.where('aircraftregistration', 'like', `%${aircraftregistration}%`);
					if(nation !== '') builder.where('nation', 'like', `%${nation}%`);
					if(militarycivilian !== '') builder.where('militarycivilian', 'like', `%${militarycivilian}%`);
					if(crashlocation !== '') builder.where('crashlocation', 'like', `%${crashlocation}%`);
					if(pilot !== '') {
						builder.where('pilotfirstname', 'like', `%${pilot}%`);
						builder.where('pilotlastname', 'like', `%${pilot}%`);
					}
					if(injuries !== '') builder.where('injuries', 'like', `%${injuries}%`);
					if(fatalities !== '') builder.where('fatalities', 'like', `%${fatalities}%`);
					if(soulsonboard !== '') builder.where('soulsonboard', 'like', `%${soulsonboard}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
        return { count: counter[0].count, body: aircrashes };

    }

}
