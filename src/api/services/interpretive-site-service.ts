import knex, { Knex } from 'knex';
import { QueryStatement, SortStatement } from './';
import { Photo, PHOTO_FIELDS } from '../data';
import { DB_CONFIG } from '../config';
import { burialsRouter } from 'routes';
const db = knex(DB_CONFIG);
export class InterpretiveSiteService {

    //SITES
	async getAllSites(){
        const sortBy = 'SiteName';
		const sort = 'asc';

		return await db
        .select('*')
        .from('InterpretiveSite.Sites')
        .orderBy(`${sortBy}`, `${sort}`);
	}

	async getSiteById(siteId: number) {	
        const item= await db
			.select('*')
			.from('InterpretiveSite.Sites')
			.where('InterpretiveSite.Sites.SiteID', siteId)
			.first();

		if (!item) {
			return null;
		}

		item.actions = await db
			.select('*')
			.from('InterpretiveSite.Actions')
			.where('InterpretiveSite.Actions.SiteID', siteId);

        item.assets = await db
			.select('*')
			.from('InterpretiveSite.Assets')
			.where('InterpretiveSite.Actions.SiteID', siteId);

        item.maintainer = await db
			.select('*')
			.from('InterpretiveSite.Maintainer')
			.where('InterpretiveSite.Maintainer.SiteID', siteId);
            
        return item;
    }

    async doSiteSearch( page: number, limit: number, offset: number, filters: any){
		let counter = [{ count: 0 }];
		let sites = [];
		const { textToMatch = '', RouteName = '', KMNum = '', MapSheet = '', sortBy, sort } = filters;
		//name,  route, km, mapsheet, established and maintained by
		if(limit === 0){
			counter = await db
				.from('InterpretiveSite.Sites')
				.where(builder => {
					if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
					if(KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
					if(MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
                    // if(MapSheet !== '') builder.where('MapSheet', 'like', `%${ServiceEnd}%`);
                    // if(MapSheet !== '') builder.where('MapSheet', 'like', `%${ServiceEnd}%`);
				})
				.count('Id', { as: 'count' });

            sites = await db
				.select('*')
				.from('InterpretiveSite.Sites')
				.where(builder => {
					if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
					if(KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
					if(MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`);
		}
        else {
			counter = await db
				.from('InterpretiveSite.Sites')
				.where(builder => {
					if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
					if(KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
					if(MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
				})
				.count('Id', { as: 'count' });

            sites = await db
				.select('*')
				.from('InterpretiveSite.Sites')
				.where(builder => {
					if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
					if(KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
					if(MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}

		// for (const boat of boats) {
		// 	boat.owners = await db
		// 		.select('boat.boatowner.currentowner', 'boat.Owner.OwnerName')
		// 		.from('boat.boatowner')
		// 		.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
		// 		.where('boat.boatowner.boatid', boat.Id);
		// }
		//console.log("BOATS", boats.length);
        return { count: counter[0].count, body: sites };

    }

    //ACTIONS
    async doActionSearch( page: number, limit: number, offset: number, filters: any){
		let counter = [{ count: 0 }];
		let actions = [ ""];
        const { textToMatch = '', RouteName = '', KMNum = '', MapSheet = '', sortBy, sort } = filters;
        if(limit === 0){
			counter = await db
				.from('InterpretiveSite.Actions')
				.where(builder => {
					if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
					if(KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
					if(MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
                    // if(MapSheet !== '') builder.where('MapSheet', 'like', `%${ServiceEnd}%`);
                    // if(MapSheet !== '') builder.where('MapSheet', 'like', `%${ServiceEnd}%`);
				})
				.count('Id', { as: 'count' });

            actions = await db
				.select('*')
				.from('InterpretiveSite.Actions')
				.where(builder => {
					if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
					if(KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
					if(MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`);
		}
        else {
			counter = await db
				.from('InterpretiveSite.Actions')
				.where(builder => {
					if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
					if(KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
					if(MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
				})
				.count('Id', { as: 'count' });

            actions = await db
				.select('*')
				.from('InterpretiveSite.Actions')
				.where(builder => {
					if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
					if(KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
					if(MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
        return { count: counter[0].count, body: actions };

    }

    //ASSETS
    async doAssetSearch( page: number, limit: number, offset: number, filters: any){
		let counter = [{ count: 0 }];
		let boats = [""];
		const { textToMatch = '', Owner, ConstructionDate = '', ServiceStart = '', ServiceEnd = '', VesselType = '', sortBy, sort } = filters;
		
		//console.log("BOATS", boats.length);
        return { count: counter[0].count, body: boats };

    }

}
