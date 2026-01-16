import db from '@/db/db-client';

export class InterpretiveSiteService {
	//SITES
	async getAllSites() {
		const sortBy = 'SiteName';
		const sort = 'asc';

		return await db.select('*').from('InterpretiveSite.Sites').orderBy(`${sortBy}`, `${sort}`);
	}
	async getMaintainersByID(param: any) {
		const { AssetID = '', SiteID = '' } = param;
		const filterColumn = {
			...(SiteID && { SiteID }),
			...(AssetID && { AssetID }),
		};

		const [key] = Object.keys(filterColumn);
		return await db
			.select('*')
			.from('InterpretiveSite.Maintainer')
			.where(`InterpretiveSite.Maintainer.${key}`, filterColumn[key]);
	}
	async getSiteById(siteId: number) {
		const item = await db
			.select('*')
			.from('InterpretiveSite.Sites')
			.where('InterpretiveSite.Sites.SiteID', siteId)
			.first();

		if (!item) {
			return null;
		}

		item.actions = await db
			.select('AC.*')
			.from('InterpretiveSite.Actions as AC')
			.where('AC.SiteID', siteId)
			.returning('*')
			.then(async (rows) => {
				for (const action of rows) {
					action.SiteName = item.SiteName;
					if (action.InspectID) {
						action.Inspection = await db
							.select('*')
							.from('InterpretiveSite.Inspections')
							.where('InterpretiveSite.Inspections.InspectID', '=', action.InspectID)
							.first();
					}
				}
				return rows;
			});

		//.rightJoin('InterpretiveSite.Inspections as IN', 'AC.InspectID', '=', 'IN.InspectID');

		item.assets = await db
			.select('AS.*', 'ST.SiteName')
			.from('InterpretiveSite.Assets as AS')
			.where('AS.SiteID', siteId)
			.join('InterpretiveSite.Sites as ST', 'ST.SiteID', '=', 'AS.SiteID');

		item.inspections = await db
			.select('*')
			.from('InterpretiveSite.Inspections')
			.where('InterpretiveSite.Inspections.SiteID', siteId);

		item.maintainers = await db
			.select('*')
			.from('InterpretiveSite.Maintainer')
			.where('InterpretiveSite.Maintainer.SiteID', siteId)
			.andWhere('InterpretiveSite.Maintainer.AssetID', null);

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
				if (assets.length > 0) {
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
				if (actions.length > 0) {
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
				if (inspections.length > 0) {
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
	async removeInspection(InspectID: number) {
		await db('InterpretiveSite.Actions')
			.where('InterpretiveSite.Actions.InspectID', InspectID)
			.del();

		await db('InterpretiveSite.Documents')
			.where('InterpretiveSite.Documents.InspectID', InspectID)
			.del();

		return await db('InterpretiveSite.Inspections')
			.where('InterpretiveSite.Inspections.InspectID', '=', InspectID)
			.del();
	}
	async objExists(objID: any, objName: string) {
		const { ActionID = '', InspectID = '', SiteID = '', AssetID = '' } = objID;

		const filterColumn = {
			...(ActionID && { ActionID }),
			...(InspectID && { InspectID }),
			...(SiteID && { SiteID }),
			...(AssetID && { AssetID }),
		};

		const [key] = Object.keys(filterColumn);
		return await db
			.select('*')
			.from(`InterpretiveSite.${objName}`)
			.where(`InterpretiveSite.${objName}.${key}`, filterColumn[key])
			.first();
	}

	async modifySite(SiteID: number, item: any, maintainers: any) {
		const res = await db('InterpretiveSite.Sites')
			.update(item)
			.where('InterpretiveSite.Sites.SiteID', SiteID);

		if (!res) {
			return null;
		}

		//maintainers
		const newMaintainers = maintainers
			.filter((x: any) => x.new == true && !x.deleted)
			.map((x: any) => ({ Maintainer: x.Maintainer, SiteID: x.SiteID }));
		if (newMaintainers.length > 0) {
			await db
				.insert(newMaintainers)
				.into('InterpretiveSite.Maintainer')
				.then((rows: any) => {
					return rows;
				});
		}

		const deletedMaintainers = maintainers
			.filter((x: any) => x.deleted == true)
			.map((x: any) => ({ MaintID: x.MaintID }));
		for (const item of deletedMaintainers) {
			await db('InterpretiveSite.Maintainer')
				.where('InterpretiveSite.Maintainer.MaintID', item.MaintID)
				.del();
		}

		// let editInspections = inspections.filter((x: any) => x.edited == true && !x.deleted).map((x: any) => ({ ...x, SiteID: SiteID }));
		// if(editInspections.length > 0){
		// 	await db
		// 	.insert(editInspections)
		// 	.into('InterpretiveSite.Inspections')
		// 	.then((rows: any) => {
		// 		return rows;
		// 	});
		// }

		// //assets
		// let newAssets = assets.filter((x: any) => x.new == true && !x.deleted).map((x: any) => ({ ...x, SiteID: SiteID }));
		// if(newAssets.length > 0){
		// 	await db
		// 	.insert(newAssets)
		// 	.into('InterpretiveSite.Assets')
		// 	.then((rows: any) => {
		// 		return rows;
		// 	});
		// }

		// let editAssets = assets.filter((x: any) => x.new == true && !x.deleted).map((x: any) => {
		// 		delete x.new;
		// 		delete x.deleted;
		// 		delete x.edited;
		// 		return {...x, SiteID: SiteID}
		// 	});
		// if(editAssets.length > 0){

		// 	for (const item of editAssets) {
		// 		await db
		// 			.update(editAssets)
		// 			.where('InterpretiveSite.Assets.AssetID', item.AssetID);
		// 	}
		// }

		// const deletedAssets = assets.filter((x: any) => x.deleted == true).map((x: any) => ({ InterpretiveSiteID: burialId, OccupationID: x.OccupationID, ID: x.ID }));
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async doSiteSearch(page: number, limit: number, offset: number, filters: any) {
		let counter = [{ count: 0 }];
		let sites = [];
		const {
			SiteName = '',
			RouteName = '',
			KMNum = '',
			MapSheet = '',
			sortBy = 'SiteID',
			sort = 'asc',
		} = filters;

		const query = db('InterpretiveSite.Sites').where((builder) => {
			if (SiteName !== '') builder.where('SiteName', 'like', `%${SiteName}%`);
			if (RouteName !== '') builder.where('RouteName', 'like', `%${RouteName}%`);
			if (KMNum !== '') builder.where('KMNum', 'like', `%${KMNum}%`);
			if (MapSheet !== '') builder.where('MapSheet', 'like', `%${MapSheet}%`);
			// if(MapSheet !== '') builder.where('MapSheet', 'like', `%${ServiceEnd}%`);
			// if(MapSheet !== '') builder.where('MapSheet', 'like', `%${ServiceEnd}%`);
		});

		counter = await query.clone().count('SiteID', { as: 'count' });
		const dataQuery = query.clone().select('*');

		//name,  route, km, mapsheet, established and maintained by
		if (limit === 0) {
			sites = await dataQuery.orderBy(`${sortBy}`, `${sort}`);
		} else {
			sites = await dataQuery.orderBy(`${sortBy}`, `${sort}`).limit(limit).offset(offset);
		}

		return { count: counter[0].count, body: sites };
	}
	//INSPECTIONS

	async modifyInspection(item: any, InspectID: number) {
		return await db('InterpretiveSite.Inspections')
			.update(item)
			.where('InterpretiveSite.Inspections.InspectID', InspectID)
			.returning('*');
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async doInspectionSearch(page: number, limit: number, offset: number, filters: any) {
		let counter = [{ count: 0 }];
		let inspections = [''];
		const {
			//textToMatch = '',
			InspectionDate = '',
			Description = '',
			InspectedBy = '',
			sortBy,
			sort,
		} = filters;
		if (limit === 0) {
			counter = await db
				.from('InterpretiveSite.Inspections as AC')
				.where((builder) => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if (InspectionDate !== '') builder.where('InspectionDate', 'like', `%${InspectionDate}%`);
					if (Description !== '') builder.where('Description', 'like', `%${Description}%`);
					if (InspectedBy !== '') builder.where('InspectedBy', 'like', `%${InspectedBy}%`);
				})
				.join('InterpretiveSite.Sites as ST', 'AC.SiteID', '=', 'ST.SiteID')
				.count('InspectID', { as: 'count' });

			inspections = await db
				.select('AC.*', 'ST.SiteName')
				.from('InterpretiveSite.Inspections as AC')
				.where((builder) => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if (InspectionDate !== '') builder.where('InspectionDate', 'like', `%${InspectionDate}%`);
					if (Description !== '') builder.where('Description', 'like', `%${Description}%`);
					if (InspectedBy !== '') builder.where('InspectedBy', 'like', `%${InspectedBy}%`);
				})
				.join('InterpretiveSite.Sites as ST', 'AC.SiteID', '=', 'ST.SiteID')
				.orderBy(`${sortBy}`, `${sort}`);
		} else {
			counter = await db
				.from('InterpretiveSite.Inspections as AC')
				.where((builder) => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if (InspectionDate !== '') builder.where('InspectionDate', 'like', `%${InspectionDate}%`);
					if (Description !== '') builder.where('Description', 'like', `%${Description}%`);
					if (InspectedBy !== '') builder.where('InspectedBy', 'like', `%${InspectedBy}%`);
				})
				.join('InterpretiveSite.Sites as ST', 'AC.SiteID', '=', 'ST.SiteID')
				.count('InspectID', { as: 'count' });

			inspections = await db
				.select('AC.*', 'ST.SiteName')
				.from('InterpretiveSite.Inspections as AC')
				.where((builder) => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if (InspectionDate !== '') builder.where('InspectionDate', 'like', `%${InspectionDate}%`);
					if (Description !== '') builder.where('Description', 'like', `%${Description}%`);
					if (InspectedBy !== '') builder.where('InspectedBy', 'like', `%${InspectedBy}%`);
				})
				.join('InterpretiveSite.Sites as ST', 'AC.SiteID', '=', 'ST.SiteID')
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
		return { count: counter[0].count, body: inspections };
	}

	//ACTIONS
	async getActionsBySiteId(SiteID: number) {
		const res = await db
			.select('*')
			.from('InterpretiveSite.Actions')
			.where('InterpretiveSite.Actions.SiteID', SiteID);
		return res;
	}
	async getActionsByInspectID(InspectID: number) {
		return await db
			.select('*')
			.from('InterpretiveSite.Actions')
			.where('InterpretiveSite.Actions.InspectID', InspectID);
	}
	async removeAction(ActionID: number) {
		await db('InterpretiveSite.Documents')
			.where('InterpretiveSite.Documents.ActionID', ActionID)
			.del();

		return await db('InterpretiveSite.Actions')
			.where('InterpretiveSite.Actions.ActionID', '=', ActionID)
			.del();
	}
	async addAction(item: any) {
		const res = await db
			.insert(item)
			.into('InterpretiveSite.Actions')
			.returning('*')
			.then(async (rows: any) => {
				const newAction = rows[0];
				return newAction;
			});
		return res;
	}

	async modifyAction(item: any, ActionID: number) {
		return await db('InterpretiveSite.Actions')
			.update(item)
			.where('InterpretiveSite.Actions.ActionID', ActionID)
			.returning('*');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async doActionSearch(page: number, limit: number, offset: number, filters: any) {
		let counter = [{ count: 0 }];
		let actions = [''];
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
			sort,
		} = filters;
		if (limit === 0) {
			counter = await db
				.from('InterpretiveSite.Actions as AC')
				.where((builder) => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if (ActionDesc !== '') builder.where('ActionDesc', 'like', `%${ActionDesc}%`);
					if (ToBeCompleteDate !== '')
						builder.where('ToBeCompleteDate', 'like', `%${ToBeCompleteDate}%`);
					if (ActionCompleteDate !== '')
						builder.where('ActionCompleteDate', 'like', `%${ActionCompleteDate}%`);
					if (CompletionDesc !== '') builder.where('CompletionDesc', 'like', `%${CompletionDesc}%`);
					if (Priority !== '') builder.where('Priority', 'like', `%${Priority}%`);
					if (CreatedBy !== '') builder.where('CreatedBy', 'like', `%${CreatedBy}%`);
					if (CreatedDate !== '') builder.where('CreatedDate', 'like', `%${CreatedDate}%`);
					if (CompletedBy !== '') builder.where('CompletedBy', 'like', `%${CompletedBy}%`);
				})
				.join('InterpretiveSite.Sites as ST', 'AC.SiteID', '=', 'ST.SiteID')
				.count('ActionID', { as: 'count' });

			actions = await db
				.select('AC.*', 'ST.SiteName')
				.from('InterpretiveSite.Actions as AC')
				.where((builder) => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if (ActionDesc !== '') builder.where('ActionDesc', 'like', `%${ActionDesc}%`);
					if (ToBeCompleteDate !== '')
						builder.where('ToBeCompleteDate', 'like', `%${ToBeCompleteDate}%`);
					if (ActionCompleteDate !== '')
						builder.where('ActionCompleteDate', 'like', `%${ActionCompleteDate}%`);
					if (CompletionDesc !== '') builder.where('CompletionDesc', 'like', `%${CompletionDesc}%`);
					if (Priority !== '') builder.where('Priority', 'like', `%${Priority}%`);
					if (CreatedBy !== '') builder.where('CreatedBy', 'like', `%${CreatedBy}%`);
					if (CreatedDate !== '') builder.where('CreatedDate', 'like', `%${CreatedDate}%`);
					if (CompletedBy !== '') builder.where('CompletedBy', 'like', `%${CompletedBy}%`);
				})
				.join('InterpretiveSite.Sites as ST', 'AC.SiteID', '=', 'ST.SiteID')
				.orderBy(`${sortBy}`, `${sort}`);
			console.log(actions);
		} else {
			counter = await db
				.from('InterpretiveSite.Actions as AC')
				.where((builder) => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if (ActionDesc !== '') builder.where('ActionDesc', 'like', `%${ActionDesc}%`);
					if (ToBeCompleteDate !== '')
						builder.where('ToBeCompleteDate', 'like', `%${ToBeCompleteDate}%`);
					if (ActionCompleteDate !== '')
						builder.where('ActionCompleteDate', 'like', `%${ActionCompleteDate}%`);
					if (CompletionDesc !== '') builder.where('CompletionDesc', 'like', `%${CompletionDesc}%`);
					if (Priority !== '') builder.where('Priority', 'like', `%${Priority}%`);
					if (CreatedBy !== '') builder.where('CreatedBy', 'like', `%${CreatedBy}%`);
					if (CreatedDate !== '') builder.where('CreatedDate', 'like', `%${CreatedDate}%`);
					if (CompletedBy !== '') builder.where('CompletedBy', 'like', `%${CompletedBy}%`);
				})
				.join('InterpretiveSite.Sites as ST', 'AC.SiteID', '=', 'ST.SiteID')
				.count('ActionID', { as: 'count' });

			actions = await db
				.select('AC.*', 'ST.SiteName')
				.from('InterpretiveSite.Actions as AC')
				.where((builder) => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if (ActionDesc !== '') builder.where('ActionDesc', 'like', `%${ActionDesc}%`);
					if (ToBeCompleteDate !== '')
						builder.where('ToBeCompleteDate', 'like', `%${ToBeCompleteDate}%`);
					if (ActionCompleteDate !== '')
						builder.where('ActionCompleteDate', 'like', `%${ActionCompleteDate}%`);
					if (CompletionDesc !== '') builder.where('CompletionDesc', 'like', `%${CompletionDesc}%`);
					if (Priority !== '') builder.where('Priority', 'like', `%${Priority}%`);
					if (CreatedBy !== '') builder.where('CreatedBy', 'like', `%${CreatedBy}%`);
					if (CreatedDate !== '') builder.where('CreatedDate', 'like', `%${CreatedDate}%`);
					if (CompletedBy !== '') builder.where('CompletedBy', 'like', `%${CompletedBy}%`);
				})
				.join('InterpretiveSite.Sites as ST', 'AC.SiteID', '=', 'ST.SiteID')
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
		return { count: counter[0].count, body: actions };
	}

	//ASSETS
	async getAssetsBySiteId(SiteID: number) {
		const res = await db
			.select('*')
			.from('InterpretiveSites.Assets')
			.where('InterpretiveSite.Assets.SiteID', SiteID);
		return res;
	}
	async removeAsset(AssetID: number) {
		await db('InterpretiveSite.Documents')
			.where('InterpretiveSite.Documents.AssetID', AssetID)
			.del();

		await db('InterpretiveSite.Maintainer')
			.where('InterpretiveSite.Maintainer.AssetID', AssetID)
			.del();

		return await db('InterpretiveSite.Assets')
			.where('InterpretiveSite.Assets.AssetID', '=', AssetID)
			.del();
	}

	async addAsset(item: any, maintainer: any) {
		const res: any = await db.insert(item).into('InterpretiveSite.Assets').returning('*');
		console.log(res);
		if (res) {
			maintainer.SiteID = res[0].SiteID;
			maintainer.AssetID = res[0].AssetID;
			res.maintainer = await db
				.insert(maintainer)
				.into('InterpretiveSite.Maintainer')
				.returning('*');
		}

		return res;
	}

	async modifyAsset(item: any, maintainers: any, AssetId: number) {
		//maintainers
		const newMaintainers = maintainers
			.filter((x: any) => x.new == true && !x.deleted)
			.map((x: any) => ({ Maintainer: x.Maintainer, AssetID: x.AssetID }));
		if (newMaintainers.length > 0) {
			await db
				.insert(newMaintainers)
				.into('InterpretiveSite.Maintainer')
				.then((rows: any) => {
					return rows;
				});
		}

		const deletedMaintainers = maintainers
			.filter((x: any) => x.deleted == true)
			.map((x: any) => ({ MaintID: x.MaintID }));
		for (const item of deletedMaintainers) {
			await db('InterpretiveSite.Maintainer')
				.where('InterpretiveSite.Maintainer.MaintID', item.MaintID)
				.del();
		}

		return await db('InterpretiveSite.Assets')
			.update(item)
			.where('InterpretiveSite.Assets.AssetID', AssetId)
			.returning('*');
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async doAssetSearch(page: number, limit: number, offset: number, filters: any) {
		let counter = [{ count: 0 }];
		let assets = [''];
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
			sort,
		} = filters;

		if (limit === 0) {
			counter = await db
				.from('InterpretiveSite.Assets as ASS')
				.where((builder) => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if (Category !== '') builder.where('Category', 'like', `%${Category}%`);
					if (Type !== '') builder.where('Type', 'like', `%${Type}%`);
					if (Size !== '') builder.where('Size', 'like', `%${Size}%`);
					if (Description !== '') builder.where('Description', 'like', `%${Description}%`);
					if (SignText !== '') builder.where('SignText', 'like', `%${SignText}%`);
					if (InstallDate !== '') builder.where('InstallDate', 'like', `%${InstallDate}%`);
					if (DecommissionDate !== '')
						builder.where('DecommissionDate', 'like', `%${DecommissionDate}%`);
					if (DecommissionNotes !== '')
						builder.where('DecommissionNotes', 'like', `%${DecommissionNotes}%`);
					if (Status !== '') builder.where('Status', 'like', `%${Status}%`);
				})
				.join('InterpretiveSite.Sites as ST', 'ASS.SiteID', '=', 'ST.SiteID')
				.count('AssetID', { as: 'count' });

			assets = await db
				.select('ASS.*', 'ST.SiteName')
				.from('InterpretiveSite.Assets as ASS')
				.where((builder) => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if (Category !== '') builder.where('Category', 'like', `%${Category}%`);
					if (Type !== '') builder.where('Type', 'like', `%${Type}%`);
					if (Size !== '') builder.where('Size', 'like', `%${Size}%`);
					if (Description !== '') builder.where('Description', 'like', `%${Description}%`);
					if (SignText !== '') builder.where('SignText', 'like', `%${SignText}%`);
					if (InstallDate !== '') builder.where('InstallDate', 'like', `%${InstallDate}%`);
					if (DecommissionDate !== '')
						builder.where('DecommissionDate', 'like', `%${DecommissionDate}%`);
					if (DecommissionNotes !== '')
						builder.where('DecommissionNotes', 'like', `%${DecommissionNotes}%`);
					if (Status !== '') builder.where('Status', 'like', `%${Status}%`);
				})
				.join('InterpretiveSite.Sites as ST', 'ASS.SiteID', '=', 'ST.SiteID')
				.orderBy(`${sortBy}`, `${sort}`);
		} else {
			counter = await db
				.from('InterpretiveSite.Assets as ASS')
				.where((builder) => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if (Category !== '') builder.where('Category', 'like', `%${Category}%`);
					if (Type !== '') builder.where('Type', 'like', `%${Type}%`);
					if (Size !== '') builder.where('Size', 'like', `%${Size}%`);
					if (Description !== '') builder.where('Description', 'like', `%${Description}%`);
					if (SignText !== '') builder.where('SignText', 'like', `%${SignText}%`);
					if (InstallDate !== '') builder.where('InstallDate', 'like', `%${InstallDate}%`);
					if (DecommissionDate !== '')
						builder.where('DecommissionDate', 'like', `%${DecommissionDate}%`);
					if (DecommissionNotes !== '')
						builder.where('DecommissionNotes', 'like', `%${DecommissionNotes}%`);
					if (Status !== '') builder.where('Status', 'like', `%${Status}%`);
				})
				.join('InterpretiveSite.Sites as ST', 'ASS.SiteID', '=', 'ST.SiteID')
				.count('AssetID', { as: 'count' });

			assets = await db
				.select('ASS.*', 'ST.SiteName')
				.from('InterpretiveSite.Assets as ASS')
				.where((builder) => {
					//if(textToMatch !== '') builder.where('SiteName', 'like', `%${textToMatch}%`);
					if (Category !== '') builder.where('Category', 'like', `%${Category}%`);
					if (Type !== '') builder.where('Type', 'like', `%${Type}%`);
					if (Size !== '') builder.where('Size', 'like', `%${Size}%`);
					if (Description !== '') builder.where('Description', 'like', `%${Description}%`);
					if (SignText !== '') builder.where('SignText', 'like', `%${SignText}%`);
					if (InstallDate !== '') builder.where('InstallDate', 'like', `%${InstallDate}%`);
					if (DecommissionDate !== '')
						builder.where('DecommissionDate', 'like', `%${DecommissionDate}%`);
					if (DecommissionNotes !== '')
						builder.where('DecommissionNotes', 'like', `%${DecommissionNotes}%`);
					if (Status !== '') builder.where('Status', 'like', `%${Status}%`);
				})
				.join('InterpretiveSite.Sites as ST', 'ASS.SiteID', '=', 'ST.SiteID')
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}

		return { count: counter[0].count, body: assets };
	}

	async getDocumentsByOwnerID(param: any) {
		const { ActionID = '', InspectID = '', SiteID = '', AssetID = '' } = param;

		const filterColumn = {
			...(ActionID && { ActionID }),
			...(InspectID && { InspectID }),
			...(SiteID && { SiteID }),
			...(AssetID && { AssetID }),
		};

		const [key] = Object.keys(filterColumn);

		const res = await db
			.select(`DocID`, `${key}`, `DocDesc`, `UploadedBy`, `UploadDate`)
			.from('InterpretiveSite.Documents')
			.where(`InterpretiveSite.Documents.${key}`, filterColumn[key]);
		return res;
	}

	async getDocumentsByID(documentId: any) {
		const res = await db
			.select('*')
			.from('InterpretiveSite.Documents')
			.where('InterpretiveSite.Documents.DocID', documentId);
		return res;
	}

	async removeDocumentByID(DocID: number) {
		return await db('InterpretiveSite.Documents')
			.where('InterpretiveSite.Documents.DocID', DocID)
			.del();
	}
}
