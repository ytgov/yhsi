<<<<<<< HEAD
import knex from 'knex';
=======
import knex, { Knex } from 'knex';
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
import { QueryStatement, SortStatement } from './';
import { Photo, PHOTO_FIELDS } from '../data';
import { DB_CONFIG } from '../config';
import { burialsRouter } from 'routes';
const db = knex(DB_CONFIG);
export class BurialService {

	async getAll(){
        const sortBy = 'LastName';
		const sort = 'asc';

		return await db.select(
						'BUR.BurialID',
						'BUR.LastName',
						'BUR.FirstName',
						'BUR.Gender',
						'BUR.GenderOther',
						'BUR.BirthYear',
						'BUR.BirthMonth',
						'BUR.BirthDay',
						'BUR.BirthDateNotes',
						'BUR.DeathYear',
						'BUR.DeathMonth',
						'BUR.DeathDay',
						'BUR.DeathDateNotes',
						'BUR.Age',
						'BUR.Manner',
						'CL.Cause',
						'CE.Cemetary',
						'BUR.OtherCemetaryDesc',
						'BUR.PlotDescription',
						'BUR.ShippedIndicator',
						'BUR.DestinationShipped',
						'BUR.FuneralPaidBy',
						'BUR.OriginCity',
						'BUR.OriginState',
						'BUR.OriginCountry',
						'BUR.OtherCountry',
						'BUR.PersonNotes',
						'RE.Religion'
						)
					.from('Burial.Burial as BUR')
					.leftJoin('Burial.CauseLookup as CL', 'CL.CauseLUpID', '=', 'BUR.CauseID')
					.leftJoin('Burial.CemetaryLookup as CE', 'CE.CemetaryLUpID', '=', 'BUR.CemetaryID')
					.leftJoin('Burial.ReligionLookup as RE', 'RE.ReligionLUpID', '=', 'BUR.ReligionID')
					.orderBy(`${sortBy}`, `${sort}`);
	}

	async getById(burialId: string) {	
        const burial = await db
            .select("BUR.*")
            .from('Burial.Burial as BUR')
            .where('BUR.BurialID', burialId)
            .first();

        if (!burial) {
            return null;
        }

        burial.Cause = await db
            .select('CL.*').from('Burial.Burial as BUR')
            .join('Burial.CauseLookup as CL', 'CL.CauseLUpID', '=', 'BUR.CauseID').first();

        burial.Cemetary = await db
            .select('CL.*').from('Burial.Burial as BUR')
            .join('Burial.CemetaryLookup as CL', 'CL.CemetaryLUpID', '=', 'BUR.CemetaryID').first();

        burial.Religion = await db
            .select('CL.*').from('Burial.Burial as BUR')
            .join('Burial.ReligionLookup as CL', 'CL.ReligionLUpID', '=', 'BUR.ReligionID').first();

        burial.Occupations = await db
            .select('OC.*', 'BOC.*').from('Burial.Occupation AS BOC')
            .where('BOC.BurialID', burialId)
            .join('Burial.OccupationLookup as OC', 'OC.OccupationLUpID', '=', 'BOC.OccupationID');

        burial.Memberships = await db
            .select('ML.*', 'MEM.Chapter', 'MEM.Notes', 'MEM.ID').from('Burial.Membership AS MEM')
            .where('MEM.BurialID', burialId)
            .join('Burial.MembershipLookup as ML', 'ML.MembershipLUpID', '=', 'MEM.MembershipID');

        burial.SiteVisits = await db
            .select('*').from('Burial.SiteVisit')
            .where('Burial.SiteVisit.BurialID', burialId);

        burial.Kinships = await db
            .select('KIN.*', 'REL.*').from('Burial.NOKin AS KIN')
            .where('KIN.BurialID', burialId)
            .join('Burial.RelationLookup as REL', 'REL.RelationLUpID', '=', 'KIN.RelationshipID');
        
        burial.Sources = await db
            .select('SO.*').from('Burial.Source AS SO')
            .where('SO.BurialID', burialId);
            
        return burial;
    }

	async doSearch(page: number, limit: number, offset: number, filters: any){

		const { 
			textToMatch = '', 
			sortBy = 'LastName', 
			sort = 'asc', 
			BirthYear = '',
			BirthMonth = '',
			BirthDay = '',
			DeathYear = '',
			DeathMonth = '',
			DeathDay = '',
			Gender = '',
			Cause = '',
			Manner = '',
			Cemetary = '',
			OriginCountry = ''  } = filters;

		let burials = [];

			burials = await db
					.select(
						'BUR.BurialID',
						'BUR.LastName',
						'BUR.FirstName',
						'BUR.Gender',
						'BUR.GenderOther',
						'BUR.BirthYear',
						'BUR.BirthMonth',
						'BUR.BirthDay',
						'BUR.BirthDateNotes',
						'BUR.DeathYear',
						'BUR.DeathMonth',
						'BUR.DeathDay',
						'BUR.DeathDateNotes',
						'BUR.Age',
						'BUR.Manner',
						'CL.Cause',
						'CE.Cemetary',
						'BUR.OtherCemetaryDesc',
						'BUR.PlotDescription',
						'BUR.ShippedIndicator',
						'BUR.DestinationShipped',
						'BUR.FuneralPaidBy',
						'BUR.OriginCity',
						'BUR.OriginState',
						'BUR.OriginCountry',
						'BUR.OtherCountry',
						'BUR.PersonNotes',
						'RE.Religion'
						)
					.from('Burial.Burial as BUR')
					.leftJoin('Burial.CauseLookup as CL', 'CL.CauseLUpID', '=', 'BUR.CauseID')
					.leftJoin('Burial.CemetaryLookup as CE', 'CE.CemetaryLUpID', '=', 'BUR.CemetaryID')
					.leftJoin('Burial.ReligionLookup as RE', 'RE.ReligionLUpID', '=', 'BUR.ReligionID')
					.where('BUR.FirstName', 'like', `%${textToMatch}%`)
					.orWhere('BUR.LastName', 'like', `%${textToMatch}%`)
					.andWhere('BUR.Gender', 'like', `%${Gender}%`)
					.andWhere('BUR.BirthYear', 'like', `%${BirthYear}%`)
					.andWhere('BUR.BirthMonth', 'like', `%${BirthMonth}%`)
					.andWhere('BUR.BirthDay', 'like', `%${BirthDay}%`)
					.andWhere('BUR.DeathYear', 'like', `%${DeathYear}%`)
					.andWhere('BUR.DeathMonth', 'like', `%${DeathMonth}%`)
					.andWhere('BUR.DeathDay', 'like', `%${DeathDay}%`)
					.andWhere('BUR.Manner', 'like', `%${Manner}%`)
					.andWhere('CL.Cause', 'like', `%${Cause}%`)
					.andWhere('CE.Cemetary', 'like', `%${Cemetary}%`)
					//.andWhere('BUR.OtherCemetaryDesc', 'like', `%${OtherCemetaryDesc}%`)
					//.andWhere('BUR.OriginCity', 'like', `%${OriginCity}%`)
					//.andWhere('BUR.OriginState', 'like', `%${OriginState}%`)
					.andWhere('BUR.OriginCountry', 'like', `%${OriginCountry}%`)
					//.andWhere('BUR.OtherCountry', 'like', `%${OtherCountry}%`)
					.orderBy(`${sortBy}`, `${sort}`)
					.limit(limit)
					.offset(offset);

		return { count: burials.length, body: burials };

		
	}

}
