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
				bordenNumber: 'BordenNumber',
				buildingSize: 'BuildingSize',
				category: 'Category',
				communityId: 'CommunityId',
				conditionComment: 'ConditionComment',
				constructionPeriodJSON: 'ConstructionPeriodJSON',
				contributingResources: 'ContributingResources',
				coordinateDetermination: 'CoordinateDetermination',
				currentUseComment: 'CurrentUseComment',
				datesJSON: 'DatesJSON',
				designations: 'Designations',
				doorCondition: 'DoorCondition',
				floorCondition: 'FloorCondition',
				functionalUseJSON: 'FunctionalUseJSON',
				hectareArea: 'HectareArea',
				historicalPatternJSON: 'HistoricalPatternJSON',
				latitude: 'Latitude',
				locationComment: 'LocationComment',
				locationContext: 'LocationContext',
				longitude: 'Longitude',
				nameJSON: 'NameJSON',
				nTSMapSheet: 'NTSMapSheet',
				otherCommunity: 'OtherCommunity',
				otherLocality: 'OtherLocality',
				physicalAddress: 'PhysicalAddress',
				physicalCountry: 'PhysicalCountry',
				physicalPostalCode: 'PhysicalPostalCode',
				physicalProvince: 'PhysicalProvince',
				previousAddress: 'PreviousAddress',
				records: 'Records',
				resourceType: 'ResourceType',
				roofCondition: 'RoofCondition',
				showInRegister: 'ShowInRegister',
				siteCategories: 'SiteCategories',
				siteStatus: 'SiteStatus',
				themeJSON: 'ThemeJSON',
				wallCondition: 'WallCondition',
				yHSPastUse: 'YHSPastUse',
				yHSThemes: 'YHSThemes',
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
