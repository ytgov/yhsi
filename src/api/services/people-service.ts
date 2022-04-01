import knex, { Knex } from 'knex';
import { QueryStatement, SortStatement } from './';
import { Photo, PHOTO_FIELDS } from '../data';
import { DB_CONFIG } from '../config';
const db = knex(DB_CONFIG);
export class PeopleService {

	async getAll(){
        const sortBy = 'GivenName';
        const sort = 'asc';
    
        return await db
        .from('Person.Person')
        .orderBy(`${sortBy}`, `${sort}`);
	}

	async getById(personId: string) {	
		const person = await db
            .from('Person.Person')
            .where('Person.PersonID', personId)
            .first();
        person.histories = await db
			.from('Person.History')
			.where('History.PersonID', personId);
        return person;
    }

    async doSearch( page: number, limit: number, offset: number, filters: any){
        const {
			textToMatch = '',
			sortBy = 'GivenName',
			sort = 'asc',
		} = filters;
		let counter = [{ count: 0 }];
        let people = [];

        if (textToMatch) {
        counter = await db
            .from('Person.Person')
            .where('Surname', 'like', `%${textToMatch}%`)
            .orWhere('GivenName', 'like', `%${textToMatch}%`)
            .orWhere('BirthYear', 'like', `%${textToMatch}%`)
            .orWhere('BirthAccuracy', 'like', `%${textToMatch}%`)
            .orWhere('DeathYear', 'like', `%${textToMatch}%`)
            .orWhere('DeathAccuracy', 'like', `%${textToMatch}%`)
            .count('PersonID', { as: 'count' });

        people = await db
            .from('Person.Person')
            .where('Surname', 'like', `%${textToMatch}%`)
            .orWhere('GivenName', 'like', `%${textToMatch}%`)
            .orWhere('BirthYear', 'like', `%${textToMatch}%`)
            .orWhere('BirthAccuracy', 'like', `%${textToMatch}%`)
            .orWhere('DeathYear', 'like', `%${textToMatch}%`)
            .orWhere('DeathAccuracy', 'like', `%${textToMatch}%`)
            .orderBy(`${sortBy}`, `${sort}`)
            .limit(limit)
            .offset(offset);
        } else {
        counter = await db
            .from('Person.Person')
            .count('PersonID', { as: 'count' });

        people = await db
            .from('Person.Person')
            .orderBy(`${sortBy}`, `${sort}`)
            .limit(limit)
            .offset(offset);
        }

        return { count: counter[0].count, body: people };

    }

}
