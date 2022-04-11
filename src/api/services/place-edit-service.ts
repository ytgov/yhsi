import knex, { Knex } from 'knex';

import { DB_CONFIG } from '../config';
import { Place, PlaceEdit } from '../models';

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
				placeId: 'PlaceId',
				bordenNumber: 'BordenNumber',
				category: 'Category',
				communityId: 'CommunityId',
				contributingResources: 'ContributingResources',
				coordinateDetermination: 'CoordinateDetermination',
				designations: 'Designations',
				hectareArea: 'HectareArea',
				historicalPatternsJSON: 'HistoricalPatternJSON',
				latitude: 'Latitude',
				locationComment: 'LocationComment',
				locationContext: 'LocationContext',
				longitude: 'Longitude',
				namesJSON: 'NameJSON',
				nTSMapSheet: 'NTSMapSheet',
				otherCommunity: 'OtherCommunity',
				otherLocality: 'OtherLocality',
				physicalAddress: 'PhysicalAddress',
				physicalCountry: 'PhysicalCountry',
				physicalPostalCode: 'PhysicalPostalCode',
				physicalProvince: 'PhysicalProvince',
				previousAddress: 'PreviousAddress',
				// primaryName is in default scope
				records: 'Records',
				showInRegister: 'ShowInRegister',
				siteCategories: 'SiteCategories',
			})
			.where({ 'PlaceEdit.Id': id })
			.then(PlaceEdit.parseAndNormalizeJSONColumns)
			.then(Place.decodeCommaDelimitedArrayColumns)
			.then((place) => {
				return place;
			});
	}

	async buildTableView(page: number, itemsPerPage: number) {
		const offset = this.computeOffset(page, itemsPerPage);
		const totalCount = await this.count(this.defaultScope);

		return this.defaultScope
			.limit(itemsPerPage)
			.offset(offset)
			.orderBy('EditDate', 'desc')
			.then((results) => {
				return {
					results,
					totalCount,
				};
			});
	}

	create(data: PlaceEdit) {
		return Promise.resolve(data)
			.then(PlaceEdit.encodeAndDenormalizeJSONColumns)
			.then(Place.encodeCommaDelimitedArrayColumns)
			.then(PlaceEdit.stripOutNonColumnAttributes)
			.then((normalizedData) => {
				delete normalizedData['id'];

				return this.db('PlaceEdit').insert(normalizedData);
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
