import knex, { Knex } from 'knex';

import { DB_CONFIG } from '../config';
import { Place, PlaceEdit, PlainObject } from '../models';
import PlaceEditSerializer from '../serializers/place-edit-serializer';

interface CountQuery {
	count: number;
}

export class PlaceEditService {
	private db: Knex;
	private _defaultScope: Knex.QueryBuilder;

	constructor() {
		this.db = knex(DB_CONFIG);
		this._defaultScope = this.db
			.select({
				id: 'PlaceEdit.Id',
				placeId: 'PlaceId',
				yHSIId: 'YHSIId',
				primaryName: 'PrimaryName',
				editorId: 'EditorUserId',
				editorEmail: 'Security.User.Email',
				editDate: 'EditDate',
			})
			.from('PlaceEdit')
			.leftOuterJoin(
				'Security.User',
				'Security.User.Id',
				'PlaceEdit.EditorUserId'
			);
	}

	get defaultScope(): Knex.QueryBuilder {
		return this._defaultScope.clone();
	}

	count(scope: Knex.QueryBuilder): Promise<number> {
		return this.db
			.count('PlaceEdit.Id', { as: 'count' })
			.from('PlaceEdit')
			.innerJoin(scope.as('t2'), 't2.Id', 'PlaceEdit.Id')
			.first<CountQuery>()
			.then((r) => r['count']);
	}

	computeOffset(page: number, itemsPerPage: number): number {
		return (page - 1) * itemsPerPage;
	}

	buildDetailedView(id: number) {
		return this.defaultScope
			.first({
				associationJSON: 'AssociationJSON',
				block: 'Block',
				bordenNumber: 'BordenNumber',
				buildingSize: 'BuildingSize',
				category: 'Category',
				cIHBNumber: 'CIHBNumber',
				communityId: 'CommunityId',
				conditionComment: 'ConditionComment',
				constructionPeriodJSON: 'ConstructionPeriodJSON',
				contactJSON: 'ContactJSON',
				contributingResources: 'ContributingResources',
				coordinateDetermination: 'CoordinateDetermination',
				currentUseComment: 'CurrentUseComment',
				datesJSON: 'DatesJSON',
				descriptionJSON: 'DescriptionJSON',
				designations: 'Designations',
				doorCondition: 'DoorCondition',
				fHBRONumber: 'FHBRONumber',
				firstNationAssociationJSON: 'FirstNationAssociationJSON',
				floorCondition: 'FloorCondition',
				functionalUseJSON: 'FunctionalUseJSON',
				groupYHSI: 'GroupYHSI',
				hectareArea: 'HectareArea',
				historicalPatternJSON: 'HistoricalPatternJSON',
				isPubliclyAccessible: 'IsPubliclyAccessible',
				jurisdiction: 'Jurisdiction',
				lAGroup: 'LAGroup',
				latitude: 'Latitude',
				locationComment: 'LocationComment',
				locationContext: 'LocationContext',
				longitude: 'Longitude',
				lot: 'Lot',
				nameJSON: 'NameJSON',
				nTSMapSheet: 'NTSMapSheet',
				otherCommunity: 'OtherCommunity',
				otherLocality: 'OtherLocality',
				ownerConsent: 'OwnerConsent',
				ownershipJSON: 'OwnershipJSON',
				physicalAddress: 'PhysicalAddress',
				physicalCountry: 'PhysicalCountry',
				physicalPostalCode: 'PhysicalPostalCode',
				physicalProvince: 'PhysicalProvince',
				planNumber: 'PlanNumber',
				previousAddress: 'PreviousAddress',
				previousOwnershipJSON: 'PreviousOwnershipJSON',
				recognitionDate: 'RecognitionDate',
				records: 'Records',
				resourceType: 'ResourceType',
				revisionLogJSON: 'RevisionLogJSON',
				roofCondition: 'RoofCondition',
				showInRegister: 'ShowInRegister',
				siteCategories: 'SiteCategories',
				siteDistrictNumber: 'SiteDistrictNumber',
				siteStatus: 'SiteStatus',
				statute2Id: 'Statute2Id',
				statuteId: 'StatuteId',
				themeJSON: 'ThemeJSON',
				townSiteMapNumber: 'TownSiteMapNumber',
				wallCondition: 'WallCondition',
				webLinkJSON: 'WebLinkJSON',
				yGBuildingNumber: 'YGBuildingNumber',
				yGReserveNumber: 'YGReserveNumber',
				yHSPastUse: 'YHSPastUse',
				yHSThemes: 'YHSThemes',
				zoning: 'Zoning',
			})
			.where({ 'PlaceEdit.Id': id })
			.then((attributes) => {
				if (attributes === undefined) return;

				const placeEdit = new PlaceEdit(attributes);
				const placeEditSerializer = new PlaceEditSerializer(placeEdit);
				return placeEditSerializer.detailedView();
			});
	}

	async buildTableView(page: number, itemsPerPage: number) {
		const offset = this.computeOffset(page, itemsPerPage);
		const totalCount = await this.count(this.defaultScope);

		return this.defaultScope
			.limit(itemsPerPage)
			.offset(offset)
			.orderBy('EditDate', 'desc')
			.then((rows) => {
				const serializedResults = rows.map((attributes: PlainObject) => {
					const placeEdit = new PlaceEdit(attributes);
					const placeEditSerializer = new PlaceEditSerializer(placeEdit);
					return placeEditSerializer.tableView();
				});

				return {
					results: serializedResults,
					totalCount,
				};
			});
	}

	create(data: PlainObject) {
		return Promise.resolve(new PlaceEdit(data)).then((placeEdit) => {
			return this.db('PlaceEdit').insert(placeEdit.toDbObject());
		});
	}

	delete(id: number) {
		return this.db.where({ 'PlaceEdit.Id': id }).from('PlaceEdit').delete();
	}

	existsForPlace(id: number) {
		return this.db
			.first('Id')
			.from('PlaceEdit')
			.where({ PlaceId: id })
			.then((result) => {
				if (result) return true;

				return false;
			});
	}
}
