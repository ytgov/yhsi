import knex, { Knex } from 'knex';
import { QueryStatement, SortStatement } from './';
import { Photo, PHOTO_FIELDS } from '../data';
import { DB_CONFIG } from '../config';
const db = knex(DB_CONFIG);
export class CatalogService {

    //CAUSE

    async doCauseSearch( page: number, limit: number, offset: number, filters: any){
        const {
			textToMatch = '',
			sortBy = 'CauseLupID',
			sort = 'asc',
		} = filters;
		let counter = [{ count: 0 }];
		let list = [];

		if (textToMatch) {
			counter = await db("Burial.CauseLookup").where("Burial.CauseLookup.Cause", "like", `%${textToMatch}%`)
				.count('CauseLupID', { as: 'count' });

			list = await db("Burial.CauseLookup").where("Burial.CauseLookup.Cause", "like", `%${textToMatch}%`)
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db("Burial.CauseLookup")
				.count('CauseLupID', { as: 'count' });

			list = await db("Burial.CauseLookup")
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
        return { count: counter[0].count, body: list };
    }

	async getAllCauses(){
		return await db("Burial.CauseLookup").orderBy(
            "Burial.CauseLookup.Cause",
            "asc"
          );
	}

    //CEMETARY

    async doCemetarySearch( page: number, limit: number, offset: number, filters: any){
        const {
			textToMatch = '',
			sortBy = 'CemetaryLupID',
			sort = 'asc',
		} = filters;
		let counter = [{ count: 0 }];
		let list = [];

		if (textToMatch) {
			counter = await db("Burial.CemetaryLookup").where("Burial.CemetaryLookup.Cemetary", "like", `%${textToMatch}%`)
				.count('CemetaryLupID', { as: 'count' });

			list = await db("Burial.CemetaryLookup").where("Burial.CemetaryLookup.Cemetary", "like", `%${textToMatch}%`)
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db("Burial.CemetaryLookup")
				.count('CemetaryLupID', { as: 'count' });

			list = await db("Burial.CemetaryLookup")
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
        return { count: counter[0].count, body: list };
    }

	async getAllCemetaries(){
		return await db("Burial.CemetaryLookup").orderBy(
            "Burial.CemetaryLookup.Cemetary",
            "asc"
          );
	}
    
    //MEMBERSHIP

    async doMembershipSearch( page: number, limit: number, offset: number, filters: any){
        const {
			textToMatch = '',
			sortBy = 'MembershipLUpID',
			sort = 'asc',
		} = filters;
		let counter = [{ count: 0 }];
		let list = [];

		if (textToMatch) {
			counter = await db("Burial.MembershipLookup").where("Burial.MembershipLookup.Membership", "like", `%${textToMatch}%`)
				.count('MembershipLUpID', { as: 'count' });

			list = await db("Burial.MembershipLookup").where("Burial.MembershipLookup.Membership", "like", `%${textToMatch}%`)
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db("Burial.MembershipLookup")
				.count('MembershipLUpID', { as: 'count' });

			list = await db("Burial.MembershipLookup")
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
        return { count: counter[0].count, body: list };
    }

	async getAllMemberships(){
		return await db("Burial.MembershipLookup").orderBy(
            "Burial.MembershipLookup.Membership",
            "asc"
          );
	}

    //OCCUPATION

    async doOccupationSearch( page: number, limit: number, offset: number, filters: any){
        const {
			textToMatch = '',
			sortBy = 'OccupationLupID',
			sort = 'asc',
		} = filters;
		let counter = [{ count: 0 }];
		let list = [];

		if (textToMatch) {
			counter = await db("Burial.OccupationLookup").where("Burial.OccupationLookup.Occupation", "like", `%${textToMatch}%`)
				.count('OccupationLupID', { as: 'count' });

			list = await db("Burial.OccupationLookup").where("Burial.OccupationLookup.Occupation", "like", `%${textToMatch}%`)
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db("Burial.OccupationLookup")
				.count('OccupationLupID', { as: 'count' });

			list = await db("Burial.OccupationLookup")
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
        return { count: counter[0].count, body: list };
    }

	async getAllOcupations(){
		return await db("Burial.OccupationLookup").orderBy(
            "Burial.OccupationLookup.Occupation",
            "asc"
          );
	}
    
    //RELATIONSHIP

    async doRelationshipSearch( page: number, limit: number, offset: number, filters: any){
        const {
			textToMatch = '',
			sortBy = 'RelationLUpID',
			sort = 'asc',
		} = filters;
		let counter = [{ count: 0 }];
		let list = [];

		if (textToMatch) {
			counter = await db("Burial.RelationLookup").where("Burial.RelationLookup.Relationship", "like", `%${textToMatch}%`)
				.count('RelationLUpID', { as: 'count' });

			list = await db("Burial.RelationLookup").where("Burial.RelationLookup.Relationship", "like", `%${textToMatch}%`)
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db("Burial.RelationLookup")
				.count('RelationLUpID', { as: 'count' });

			list = await db("Burial.RelationLookup")
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
        return { count: counter[0].count, body: list };
    }

	async getAllRelationships(){
		return await db("Burial.RelationLookup").orderBy(
            "Burial.RelationLookup.Relationship",
            "asc"
          );
	}
    
    //RELIGION

    async doReligionSearch( page: number, limit: number, offset: number, filters: any){
        const {
			textToMatch = '',
			sortBy = 'ReligionLUpID',
			sort = 'asc',
		} = filters;
		let counter = [{ count: 0 }];
		let list = [];

		if (textToMatch) {
			counter = await db("Burial.ReligionLookup").where("Burial.ReligionLookup.Religion", "like", `%${textToMatch}%`)
				.count('ReligionLUpID', { as: 'count' });

			list = await db("Burial.ReligionLookup").where("Burial.ReligionLookup.Religion", "like", `%${textToMatch}%`)
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db("Burial.ReligionLookup")
				.count('ReligionLUpID', { as: 'count' });

			list = await db("Burial.ReligionLookup")
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
        return { count: counter[0].count, body: list };
    }

	async getAllReligions(){
		return await db("Burial.ReligionLookup").orderBy(
            "Burial.ReligionLookup.Religion",
            "asc"
          );
	}

	//ROUTES
	async getAllRoutes(){
		return await db("InterpretiveSite.RouteLookup").orderBy(
			"InterpretiveSite.RouteLookup.RouteName",
			"asc"
		);
	}
	//ASSET TYPES
	async getAllAssetTypes(){
		return await db("InterpretiveSite.AssetTypeLookup").orderBy(
			"InterpretiveSite.AssetTypeLookup.Type",
			"asc"
		);
	}
	//CATEGORIES
	async getAllCategories(){
		return await db("InterpretiveSite.AssetCategoryLookup").orderBy(
			"InterpretiveSite.AssetCategoryLookup.Category",
			"asc"
		);
	}
	//MAINTAINER
	async getAllMaintainers(){
		return await db("InterpretiveSite.MaintOwnLookup").orderBy(
			"InterpretiveSite.MaintOwnLookup.MaintOwnName",
			"asc"
		);
	}
}
