import knex, { Knex } from 'knex';
import { QueryStatement, SortStatement } from './';
import { Photo, PHOTO_FIELDS } from '../data';
import { DB_CONFIG } from '../config';
import { burialsRouter } from 'routes';
import { filter } from 'lodash';
const db = knex(DB_CONFIG);
export class InterpretiveSiteService {

  //SITES
	async getAllSites() {
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
			.where('InterpretiveSite.Assets.SiteID', siteId);
		
		item.inspections = await db
			.select('*')
			.from('InterpretiveSite.Inspections')
			.where('InterpretiveSite.Inspections.SiteID', siteId);

        item.maintainer = await db
			.select('*')
			.from('InterpretiveSite.Maintainer')
			.where('InterpretiveSite.Maintainer.SiteID', siteId);
            
        return item;
  }

	async addSite(item: any, assets: any, actions: any, inspections: any) {
		console.log(item, assets, actions, inspections);
		const res = await db
		.insert(item)
		.into('InterpretiveSite.Sites')
		.returning('*')
		.then(async (rows: any) => {
			const newSite = rows[0];

			//ASSETS
			if(assets.length > 0){
				newSite.assets = await db
				.insert(
					assets.map((item: any) => ({
						...item,
						SiteID: newSite.SiteID,
					}))
				)
				.into('InterpretiveSite.Assets')
				.returning('*')
				.then((rows: any) => {
					return rows;
				});
			}
			


			//ACTIONS
			if(actions.length > 0){
				newSite.actions = await db
				.insert(
					actions.map((item: any) => ({
						SiteID: newSite.SiteID,
						...item,
					}))
				)
				.into('InterpretiveSite.Actions')
				.then((rows: any) => {
					return rows;
				});
			}
			
			//INSPECTIONS
			if(inspections.length > 0){
				newSite.inspections = await db
				.insert(
					inspections.map((item: any) => ({
						Description: item.Description,
						InspectedBy: item.InspectedBy,
						InspectionDate: item.InspectionDate,
						SiteID: newSite.SiteID,
					}))
				)
				.into('InterpretiveSite.Inspections')
				.returning('*')
				.then((rows: any) => {
					return rows;
				});
			}
			
			return newSite;
		});
		return res;
	}

	async modifySite(SiteID: number, item: any, assets: any, actions: any, inspections: any){
		const res = await db('InterpretiveSite.Sites')
			.update(item)
			.where('InterpretiveSite.Sites.SiteID', SiteID);

		if(!res){
			return null;
		}

		//inspections
		let newInspections = inspections.filter((x: any) => x.new == true && !x.deleted).map((x: any) => ({ ...x, SiteID: SiteID }));
		if(newInspections.length > 0){
			await db
			.insert(newInspections)
			.into('InterpretiveSite.Inspections')
			.then((rows: any) => {
				return rows;
			});
		}

		let editInspections = inspections.filter((x: any) => x.edited == true && !x.deleted).map((x: any) => ({ ...x, SiteID: SiteID }));
		if(editInspections.length > 0){
			await db
			.insert(editInspections)
			.into('InterpretiveSite.Inspections')
			.then((rows: any) => {
				return rows;
			});
		}


		//assets
		let newAssets = assets.filter((x: any) => x.new == true && !x.deleted).map((x: any) => ({ ...x, SiteID: SiteID }));
		if(newAssets.length > 0){
			await db
			.insert(newAssets)
			.into('InterpretiveSite.Assets')
			.then((rows: any) => {
				return rows;
			});
		}

		let editAssets = assets.filter((x: any) => x.new == true && !x.deleted).map((x: any) => { 
				delete x.new;
				delete x.deleted;
				delete x.edited;
				return {...x, SiteID: SiteID} 
			});
		if(editAssets.length > 0){

			for (const item of editAssets) {
				await db
					.update(editAssets)
					.where('InterpretiveSite.Assets.AssetID', item.AssetID);
			}
		}


			// const deletedAssets = assets.filter((x: any) => x.deleted == true).map((x: any) => ({ BurialID: burialId, OccupationID: x.OccupationID, ID: x.ID }));
			// for (const item of deletedOccupations) {
			// 	await db('Burial.Occupation')
			// 		.where('Burial.Occupation.ID', item.ID).del();
			// }

			// const editAssets = assets.filter((x: any) => x.edited == true && x.deleted == undefined).map((x: any) => ({ BurialID: burialId, OccupationID: x.OccupationID, ID: x.ID }));
			// ////console.log("occupations to edit",editOccupations);
			// for (const item of editOccupations) {
			// 	await db('Burial.Occupation')
			// 		.update({ BurialID: burialId, OccupationID: item.OccupationID })
			// 		.where('Burial.Occupation.ID', item.ID);
			// }
		return res;
	}

  async doSiteSearch( page: number, limit: number, offset: number, filters: any) {
		let counter = [{ count: 0 }];
		let sites = [];
		const { SiteName = '', RouteName = '', KMNum = '', MapSheet = '', sortBy, sort } = filters;
		//name,  route, km, mapsheet, established and maintained by
		if(limit === 0){
			counter = await db
				.from('InterpretiveSite.Sites')
				.where(builder => {
					if(SiteName !== '') builder.where('SiteName', 'like', `%${SiteName}%`);
					if(RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
					if(KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
					if(MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
                    // if(MapSheet !== '') builder.where('MapSheet', 'like', `%${ServiceEnd}%`);
                    // if(MapSheet !== '') builder.where('MapSheet', 'like', `%${ServiceEnd}%`);
				})
				.count('SiteID', { as: 'count' });

            sites = await db
				.select('*')
				.from('InterpretiveSite.Sites')
				.where(builder => {
					if(SiteName !== '') builder.where('SiteName', 'like', `%${SiteName}%`);
					if(RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
					if(KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
					if(MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`);
		} else {
			counter = await db
				.from('InterpretiveSite.Sites')
				.where(builder => {
					if(SiteName !== '') builder.where('SiteName', 'like', `%${SiteName}%`);
					if(RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
					if(KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
					if(MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
				})
				.count('SiteID', { as: 'count' });

            sites = await db
				.select('*')
				.from('InterpretiveSite.Sites')
				.where(builder => {
					if(SiteName !== '') builder.where('SiteName', 'like', `%${SiteName}%`);
					if(RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
					if(KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
					if(MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
        return { count: counter[0].count, body: sites };

  }
  //INSPECTIONS
  
	async modifyInspection(item: any, InspectID: number) {
		return await db('InterpretiveSite.Inspections').update(item).where('InterpretiveSite.Inspections.InspectID', InspectID);
	}

  	async addInspection(item: any) {
		const res = await db
		.insert(item)
		.into('InterpretiveSite.Inspections')
		.returning('*')
		.then(async (rows: any) => {
			const newInsp = rows[0];		
			return newInsp;
		});
		return res;
	}

  //ACTIONS
	async getActionsBySiteId(SiteID: number) {
		const res = await db.select('*').from('InterpretiveSites.Actions').where('InterpretiveSite.Actions.SiteID', SiteID);
		return res;
	}

	async addAction(item: any) {
		const res = await db
		.insert(item)
		.into('InterpretiveSite.Action')
		.returning('*')
		.then(async (rows: any) => {
			const newAction = rows[0];		
			return newAction;
		});
		return res;
	}

	async modifyAction(item: any, ActionID: number) {
		const res = await db('InterpretiveSite.Action').update(item).where('InterpretiveSite.Action.ActionID', ActionID);
		console.log(res);
		return res;
	}

  async doActionSearch( page: number, limit: number, offset: number, filters: any) {
		let counter = [{ count: 0 }];
		let actions = [""];
    const { 
			//textToMatch = '', 
			ActionDesc = '', 
			ToBeCompleteDate = '', 
			ActionCompleteDate = '', 
			CompletionDesc = '',
			Priority = '',
			CreatedBy = '',
			CreatedDate = '',
			CompletedBy = '',
			sortBy, 
			sort
		} = filters;
    if(limit === 0){
			counter = await db
				.from('InterpretiveSite.Actions')
				.where(builder => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(ActionDesc !== '') builder.where('ActionDesc', 'like', `%${ActionDesc}%`);
					if(ToBeCompleteDate !== '') builder.where('ToBeCompleteDate', 'like', `%${ToBeCompleteDate}%`);
					if(ActionCompleteDate !== '') builder.where('ActionCompleteDate', 'like', `%${ActionCompleteDate}%`);
					if(CompletionDesc !== '') builder.where('CompletionDesc', 'like', `%${CompletionDesc}%`);
					if(Priority !== '') builder.where('Priority', 'like', `%${Priority}%`);
					if(CreatedBy !== '') builder.where('CreatedBy', 'like', `%${CreatedBy}%`);
					if(CreatedDate !== '') builder.where('CreatedDate', 'like', `%${CreatedDate}%`);
					if(CompletedBy !== '') builder.where('CompletedBy', 'like', `%${CompletedBy}%`);
				})
				.count('ActionID', { as: 'count' });

            actions = await db
				.select('*')
				.from('InterpretiveSite.Actions')
				.where(builder => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(ActionDesc !== '') builder.where('ActionDesc', 'like', `%${ActionDesc}%`);
					if(ToBeCompleteDate !== '') builder.where('ToBeCompleteDate', 'like', `%${ToBeCompleteDate}%`);
					if(ActionCompleteDate !== '') builder.where('ActionCompleteDate', 'like', `%${ActionCompleteDate}%`);
					if(CompletionDesc !== '') builder.where('CompletionDesc', 'like', `%${CompletionDesc}%`);
					if(Priority !== '') builder.where('Priority', 'like', `%${Priority}%`);
					if(CreatedBy !== '') builder.where('CreatedBy', 'like', `%${CreatedBy}%`);
					if(CreatedDate !== '') builder.where('CreatedDate', 'like', `%${CreatedDate}%`);
					if(CompletedBy !== '') builder.where('CompletedBy', 'like', `%${CompletedBy}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`);
		}
        else {
			counter = await db
				.from('InterpretiveSite.Actions')
				.where(builder => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(ActionDesc !== '') builder.where('ActionDesc', 'like', `%${ActionDesc}%`);
					if(ToBeCompleteDate !== '') builder.where('ToBeCompleteDate', 'like', `%${ToBeCompleteDate}%`);
					if(ActionCompleteDate !== '') builder.where('ActionCompleteDate', 'like', `%${ActionCompleteDate}%`);
					if(CompletionDesc !== '') builder.where('CompletionDesc', 'like', `%${CompletionDesc}%`);
					if(Priority !== '') builder.where('Priority', 'like', `%${Priority}%`);
					if(CreatedBy !== '') builder.where('CreatedBy', 'like', `%${CreatedBy}%`);
					if(CreatedDate !== '') builder.where('CreatedDate', 'like', `%${CreatedDate}%`);
					if(CompletedBy !== '') builder.where('CompletedBy', 'like', `%${CompletedBy}%`);
				})
				.count('ActionID', { as: 'count' });

            actions = await db
				.select('*')
				.from('InterpretiveSite.Actions')
				.where(builder => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(ActionDesc !== '') builder.where('ActionDesc', 'like', `%${ActionDesc}%`);
					if(ToBeCompleteDate !== '') builder.where('ToBeCompleteDate', 'like', `%${ToBeCompleteDate}%`);
					if(ActionCompleteDate !== '') builder.where('ActionCompleteDate', 'like', `%${ActionCompleteDate}%`);
					if(CompletionDesc !== '') builder.where('CompletionDesc', 'like', `%${CompletionDesc}%`);
					if(Priority !== '') builder.where('Priority', 'like', `%${Priority}%`);
					if(CreatedBy !== '') builder.where('CreatedBy', 'like', `%${CreatedBy}%`);
					if(CreatedDate !== '') builder.where('CreatedDate', 'like', `%${CreatedDate}%`);
					if(CompletedBy !== '') builder.where('CompletedBy', 'like', `%${CompletedBy}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
        return { count: counter[0].count, body: actions };

  }

  //ASSETS
	async getAssetsBySiteId(SiteID: number) {
		const res = await db.select('*').from('InterpretiveSites.Assets').where('InterpretiveSite.Assets.SiteID', SiteID);
		return res;
	}

	async addAsset(item: any, maintainer: any){
		let res: any = await db
		.insert(item)
		.into('InterpretiveSite.Assets')
		.returning('*');
		console.log(res);
		if(res){
			maintainer.SiteID = res[0].SiteID;
			maintainer.AssetID = res[0].AssetID;
			res.maintainer = await db.insert(maintainer).into('InterpretiveSite.Maintainer').returning('*');
		}

		return res;
	}

	async modifyAsset(item: any, AssetId: number) {
		const res = await db('InterpretiveSite.Assets').update(item).where('InterpretiveSite.Assets.AssetID', AssetId);
		return res;
	}

  async doAssetSearch(page: number, limit: number, offset: number, filters: any) {
		let counter = [{ count: 0 }];
		let assets = [""];
    const { 
			//textToMatch = '', 
			Category = '', 
			Type = '', 
			Size = '', 
			Description = '',
			SignText = '',
			InstallDate = '',
			DecommissionDate = '',
			DecommissionNotes = '',
			Status = '',
			sortBy, 
			sort
		} = filters;
    
		if(limit === 0) {
			counter = await db
				.from('InterpretiveSite.Assets')
				.where(builder => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(Category !== '') builder.where('Category', 'like', `%${Category}%`);
					if(Type !== '') builder.where('Type', 'like', `%${Type}%`);
					if(Size !== '') builder.where('Size', 'like', `%${Size}%`);
					if(Description !== '') builder.where('Description', 'like', `%${Description}%`);
					if(SignText !== '') builder.where('SignText', 'like', `%${SignText}%`);
					if(InstallDate !== '') builder.where('InstallDate', 'like', `%${InstallDate}%`);
					if(DecommissionDate !== '') builder.where('DecommissionDate', 'like', `%${DecommissionDate}%`);
					if(DecommissionNotes !== '') builder.where('DecommissionNotes', 'like', `%${DecommissionNotes}%`);
					if(Status !== '') builder.where('Status', 'like', `%${Status}%`);
				})
				.count('AssetID', { as: 'count' });

			assets = await db
				.select('*')
				.from('InterpretiveSite.Assets')
				.where(builder => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(Category !== '') builder.where('Category', 'like', `%${Category}%`);
					if(Type !== '') builder.where('Type', 'like', `%${Type}%`);
					if(Size !== '') builder.where('Size', 'like', `%${Size}%`);
					if(Description !== '') builder.where('Description', 'like', `%${Description}%`);
					if(SignText !== '') builder.where('SignText', 'like', `%${SignText}%`);
					if(InstallDate !== '') builder.where('InstallDate', 'like', `%${InstallDate}%`);
					if(DecommissionDate !== '') builder.where('DecommissionDate', 'like', `%${DecommissionDate}%`);
					if(DecommissionNotes !== '') builder.where('DecommissionNotes', 'like', `%${DecommissionNotes}%`);
					if(Status !== '') builder.where('Status', 'like', `%${Status}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`);
		} else {
			counter = await db
				.from('InterpretiveSite.Assets')
				.where(builder => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(Category !== '') builder.where('Category', 'like', `%${Category}%`);
					if(Type !== '') builder.where('Type', 'like', `%${Type}%`);
					if(Size !== '') builder.where('Size', 'like', `%${Size}%`);
					if(Description !== '') builder.where('Description', 'like', `%${Description}%`);
					if(SignText !== '') builder.where('SignText', 'like', `%${SignText}%`);
					if(InstallDate !== '') builder.where('InstallDate', 'like', `%${InstallDate}%`);
					if(DecommissionDate !== '') builder.where('DecommissionDate', 'like', `%${DecommissionDate}%`);
					if(DecommissionNotes !== '') builder.where('DecommissionNotes', 'like', `%${DecommissionNotes}%`);
					if(Status !== '') builder.where('Status', 'like', `%${Status}%`);
				})
				.count('AssetID', { as: 'count' });

			assets = await db
				.select('*')
				.from('InterpretiveSite.Assets')
				.where(builder => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if(Category !== '') builder.where('Category', 'like', `%${Category}%`);
					if(Type !== '') builder.where('Type', 'like', `%${Type}%`);
					if(Size !== '') builder.where('Size', 'like', `%${Size}%`);
					if(Description !== '') builder.where('Description', 'like', `%${Description}%`);
					if(SignText !== '') builder.where('SignText', 'like', `%${SignText}%`);
					if(InstallDate !== '') builder.where('InstallDate', 'like', `%${InstallDate}%`);
					if(DecommissionDate !== '') builder.where('DecommissionDate', 'like', `%${DecommissionDate}%`);
					if(DecommissionNotes !== '') builder.where('DecommissionNotes', 'like', `%${DecommissionNotes}%`);
					if(Status !== '') builder.where('Status', 'like', `%${Status}%`);
				})
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
    
		return { count: counter[0].count, body: assets };

  }

	async getDocumentsByOwnerID(param: any) {
		const { ActionID = '', InspectID = '',	SiteID = '' } = param;

		const filterColumn = {
			...ActionID && { ActionID },
			...InspectID && { InspectID },
			...SiteID && { SiteID },
		};

		let [key] = Object.keys(filterColumn);

		const res = await db.select(`DocID, ${key}, DocDesc, UploadedBy, UploadedDate`)
			.from('InterpretiveSites.Documents')
			.where(`InterpretiveSite.${key}`, filterColumn[key]);
		return res;
	}

	async getDocumentsByID(documentId: any) {
		const res = await db.select('*')
			.from('InterpretiveSites.Documents')
			.where('InterpretiveSite.DocID', documentId);
		return res;
	}
}
