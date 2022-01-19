import Knex from 'knex';
import { QueryStatement, SortStatement } from './';
import {
	Association,
	ConstructionPeriod,
	Contact,
	Dates,
	Description,
	FirstNationAssociation,
	FunctionalUse,
	HistoricalPattern,
	Name,
	Ownership,
	Place,
	PLACE_FIELDS,
	PreviousOwnership,
	REGISTER_FIELDS,
	RevisionLog,
	Theme,
	WebLink,
} from '../data';
import { GenericEnum } from './static-service';
import _ from 'lodash';

export class PlaceService {
	private knex: Knex;

	constructor(config: Knex.Config<any>) {
		this.knex = Knex(config);
	}

	async getAll(skip: number, take: number): Promise<Array<Place>> {
		return this.knex('place')
			.select<Place[]>(PLACE_FIELDS)
			.orderBy('id')
			.offset(skip)
			.limit(take);
	}

	async getRegisterAll(): Promise<Array<any>> {
		return this.knex('place')
			.join('community', 'community.id', 'place.communityid')
			.where({ showInRegister: true })
			.select(REGISTER_FIELDS)
			.select(this.knex.raw("'English teaser' as teaserEnglish"))
			.select(this.knex.raw("'French teaser' as teaserFrench"));
	}

	async getById(id: number): Promise<Place | undefined> {
		return this.knex('place')
			.select<Place>(PLACE_FIELDS)
			.where({ id: id })
			.first()
			.catch((err: Error) => {
				console.log('BOMBED', err);
				return undefined;
			});
	}

	async getRegisterById(id: number): Promise<any | undefined> {
		return this.knex('place')
			.join('community', 'community.id', 'place.communityid')
			.select(REGISTER_FIELDS)
			.where({ 'place.id': id })
			.where({ showInRegister: true })
			.first()
			.catch((err: Error) => {
				console.log('BOMBED', err);
				return undefined;
			});
	}

	async getPlaceCount(): Promise<number> {
		return new Promise(async (resolve, reject) => {
			let results = await this.knex<number>('place').count('*', {
				as: 'count',
			});

			if (results) {
				let val = results[0].count as number;
				resolve(val);
			}

			resolve(0);
		});
	}

	async addPlace(item: Place): Promise<Place | undefined> {
		return this.knex('place').insert(item).returning<Place>(PLACE_FIELDS);
	}

	async updatePlace(id: number, item: Place): Promise<Place | undefined> {
		return this.knex('place').where({ id }).update(item);
	}

	async generateIdFor(nTSMapSheet: string): Promise<string> {
		let maxPlace = await this.knex('place')
			.where({ nTSMapSheet })
			.max('yhsiId', { as: 'maxVal' });

		if (maxPlace && maxPlace.length == 1 && maxPlace[0].maxVal) {
			let val = maxPlace[0].maxVal;
			let parts = val.split('/');
			let lastPart = parseInt(parts[2]);

			lastPart++;

			let strVal = lastPart.toString().padStart(3, '0');
			return `${nTSMapSheet}/${strVal}`;
		}

		return `${nTSMapSheet}/001`;
	}

	async getAssociationsFor(id: number): Promise<Association[]> {
		return this.knex('association')
			.where({ placeId: id })
			.select<Association[]>(['id', 'placeId', 'type', 'description']);
	}

	async addAssociation(name: Association) {
		return this.knex('association').insert(name);
	}

	async removeAssociation(id: number) {
		return this.knex('association').where({ id }).delete();
	}

	async getFNAssociationsFor(id: number): Promise<FirstNationAssociation[]> {
		return this.knex('FirstNationAssociation')
			.where({ placeId: id })
			.select<FirstNationAssociation[]>([
				'id',
				'placeId',
				'firstNationId',
				'firstNationAssociationType',
				'comments',
			]);
	}

	async addFNAssociation(name: FirstNationAssociation) {
		return this.knex('FirstNationAssociation').insert(name);
	}

	async removeFNAssociation(id: number) {
		return this.knex('FirstNationAssociation').where({ id }).delete();
	}

	async getNamesFor(id: number) {
		return this.knex('name')
			.where({ placeId: id })
			.select<Name[]>(['id', 'placeId', 'description']);
	}

	async addSecondaryName(name: Name) {
		return this.knex('name').insert(name);
	}

	async removeSecondaryName(id: number) {
		return this.knex('name').where({ id }).delete();
	}

	async getHistoricalPatternsFor(id: number): Promise<HistoricalPattern[]> {
		return this.knex('historicalpattern')
			.where({ placeId: id })
			.select<HistoricalPattern[]>([
				'id',
				'placeId',
				'comments',
				'historicalPatternType',
			]);
	}

	async addHistoricalPattern(name: Name) {
		return this.knex('historicalpattern').insert(name);
	}

	async removeHistoricalPattern(id: number) {
		return this.knex('historicalpattern').where({ id }).delete();
	}

	async getDatesFor(id: number): Promise<Dates[]> {
		return this.knex('dates')
			.where({ placeId: id })
			.select<Dates[]>([
				'id',
				'placeId',
				'type',
				'fromDate',
				'toDate',
				'details',
			]);
	}

	async addDate(name: Dates) {
		return this.knex('dates').insert(name);
	}

	async removeDate(id: number) {
		return this.knex('dates').where({ id }).delete();
	}

	async getConstructionPeriodsFor(id: number): Promise<ConstructionPeriod[]> {
		return this.knex('constructionperiod')
			.where({ placeId: id })
			.select<ConstructionPeriod[]>(['id', 'placeId', 'type']);
	}

	async addConstructionPeriod(name: ConstructionPeriod) {
		return this.knex('constructionperiod').insert(name);
	}

	async removeConstructionPeriod(id: number) {
		return this.knex('constructionperiod').where({ id }).delete();
	}

	async getThemesFor(id: number): Promise<Theme[]> {
		return this.knex('theme')
			.where({ placeId: id })
			.select<Theme[]>(['id', 'placeId', 'placeThemeId']);
	}

	async addTheme(name: Theme) {
		return this.knex('theme').insert(name);
	}

	async removeTheme(id: number) {
		return this.knex('theme').where({ id }).delete();
	}

	async getFunctionUsesFor(id: number): Promise<FunctionalUse[]> {
		return this.knex('FunctionalUse')
			.where({ placeId: id })
			.select<FunctionalUse[]>([
				'id',
				'placeId',
				'functionalTypeId',
				'functionalUseType',
				'description',
			]);
	}

	async addFunctionalUse(name: FunctionalUse) {
		return this.knex('FunctionalUse').insert(name);
	}

	async removeFunctionalUse(id: number) {
		return this.knex('FunctionalUse').where({ id }).delete();
	}

	async getOwnershipsFor(id: number): Promise<Ownership[]> {
		return this.knex('Ownership')
			.where({ placeId: id })
			.select<Ownership[]>(['id', 'placeId', 'ownershipType', 'comments']);
	}

	async addOwnership(name: Ownership) {
		return this.knex('Ownership').insert(name);
	}

	async removeOwnership(id: number) {
		return this.knex('Ownership').where({ id }).delete();
	}

	async getPreviousOwnershipsFor(id: number): Promise<PreviousOwnership[]> {
		return this.knex('PreviousOwnership')
			.where({ placeId: id })
			.select<PreviousOwnership[]>([
				'id',
				'placeId',
				'ownershipNumber',
				'ownershipName',
				'ownershipDate',
			]);
	}

	async addPreviousOwnership(name: PreviousOwnership) {
		return this.knex('PreviousOwnership').insert(name);
	}

	async removePreviousOwnership(id: number) {
		return this.knex('PreviousOwnership').where({ id }).delete();
	}

	async getContactsFor(id: number): Promise<Contact[]> {
		return this.knex('Contact')
			.where({ placeId: id })
			.select<Contact[]>([
				'id',
				'placeId',
				'firstName',
				'lastName',
				'phoneNumber',
				'email',
				'mailingAddress',
				'description',
				'contactType',
			]);
	}

	async addContact(name: Contact) {
		return this.knex('Contact').insert(name);
	}

	async removeContact(id: number) {
		return this.knex('Contact').where({ id }).delete();
	}

	async getRevisionLogFor(id: number): Promise<RevisionLog[]> {
		return this.knex('RevisionLog')
			.where({ placeId: id })
			.select<RevisionLog[]>([
				'id',
				'placeId',
				'revisionLogType',
				'revisionDate',
				'revisedBy',
				'details',
			])
			.orderBy('revisionDate');
	}

	async addRevisionLog(name: RevisionLog) {
		return this.knex('RevisionLog').insert(name);
	}

	async removeRevisionLog(id: number) {
		return this.knex('RevisionLog').where({ id }).delete();
	}

	async getWebLinksFor(id: number): Promise<WebLink[]> {
		return this.knex('WebLink')
			.where({ placeId: id })
			.select<WebLink[]>(['id', 'placeId', 'type', 'address']);
	}

	async addWebLink(name: WebLink) {
		return this.knex('WebLink').insert(name);
	}

	async removeWebLink(id: number) {
		return this.knex('WebLink').where({ id }).delete();
	}

	async getDescriptionsFor(id: number): Promise<Description[]> {
		return this.knex('Description')
			.where({ placeId: id })
			.select<Description[]>(['id', 'placeId', 'descriptionText', 'type']);
	}

	async addDescription(name: Description) {
		return this.knex('Description').insert(name);
	}

	async removeDescription(id: number) {
		return this.knex('Description').where({ id }).delete();
	}

	getAssociationTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'Event' },
			{ value: 2, text: 'Person' },
			{ value: 3, text: 'Organization' },
			{ value: 4, text: 'Architect Designer' },
			{ value: 5, text: 'Builder' },
		];
	}

	getFNAssociationTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'Settlement Lands' },
			{ value: 2, text: 'Traditional Territory' },
		];
	}

	getHistoricalPatterns(): GenericEnum[] {
		return [
			{ value: 1, text: 'Political' },
			{ value: 2, text: 'Economic' },
			{ value: 3, text: 'Social' },
			{ value: 4, text: 'Geographic' },
		];
	}

	getDateTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'Construction' },
			{ value: 2, text: 'Significant Date' },
			{ value: 8, text: 'Construction Circa' },
		];
	}

	getConstructionPeriodTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'Pre 1895' },
			{ value: 2, text: 'From 1896 to 1905' },
			{ value: 3, text: 'From 1906 to 1939' },
			{ value: 4, text: 'From 1940 to 1965' },
			{ value: 5, text: 'Post 1965' },
		];
	}

	getFunctionalUseTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'Current' },
			{ value: 2, text: 'Historic' },
		];
	}

	getOwnershipTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'Private' },
			{ value: 2, text: 'Public Local' },
			{ value: 3, text: 'Public Territorial' },
			{ value: 4, text: 'Settlement Lands' },
			{ value: 5, text: 'Public Federal' },
			{ value: 6, text: 'Not For Profit' },
			{ value: 7, text: 'Crown' },
			{ value: 8, text: 'Unknown' },
			{ value: 17, text: 'Gov Yukon' },
			{ value: 18, text: 'First Nations Reserve' },
			{ value: 19, text: 'Aboriginal Public Lands' },
		];
	}

	getContactTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'Owner' },
			{ value: 2, text: 'Administrator' },
			{ value: 3, text: 'Heritage Planner' },
			{ value: 4, text: 'Other' },
		];
	}

	getRevisionLogTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'Initial Recording' },
			{ value: 2, text: 'Monitoring Visit' },
			{ value: 3, text: 'Research' },
			{ value: 4, text: 'Designation Assessment' },
			{ value: 5, text: 'Record Update' },
		];
	}

	getWebLinkTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'Historic Place' },
			{ value: 2, text: 'Local Government' },
			{ value: 3, text: 'Federal/Provicial/Territorial' },
			{ value: 4, text: 'Other' },
		];
	}

	getDescriptionTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'Additional Information' },
			{ value: 2, text: 'Character Defining Elements' },
			{ value: 3, text: 'Cultural Period' },
			{ value: 4, text: 'Heritage Value' },
			{ value: 5, text: 'Place Description' },
			{ value: 6, text: 'Description of Boundaries' },
			{ value: 8, text: 'Historical Sources Location' },
			{ value: 9, text: 'Renovation Information' },
			{ value: 10, text: 'Construction Style' },
			{ value: 11, text: 'Demolition Information' },
			{ value: 12, text: 'Cultural History' },
			{ value: 13, text: 'Documentation Location' },
			{ value: 27, text: 'Archaeological Collections' },
			{ value: 29, text: 'Building Style' },
			{ value: 30, text: 'YRHP Additional Information' },
		];
	}

	async doSearch(
		query: Array<QueryStatement>,
		sort: Array<SortStatement>,
		page: number,
		page_size: number,
		skip: number,
		take: number
	): Promise<any> {
		return new Promise(async (resolve, reject) => {
			let selectStmt = this.knex('place')
				.distinct()
				.select(PLACE_FIELDS)
				.leftOuterJoin(
					'firstnationassociation',
					'place.id',
					'firstnationassociation.placeid'
				)
				.leftOuterJoin(
					'constructionPeriod',
					'place.id',
					'constructionPeriod.placeid'
				);
			//.leftOuterJoin("revisionLog", "place.id", "revisionLog.placeid")
			//.leftOuterJoin("description", "place.id", "description.placeid");

			if (query && query.length > 0) {
				query.forEach((stmt: any) => {
					switch (stmt.operator) {
						case 'eq': {
							let p = {};
							let m = `{"${stmt.field}": "${stmt.value}"}`;
							Object.assign(p, JSON.parse(m));
							selectStmt.orWhere(p);
							break;
						}
						case 'in': {
							let items = stmt.value.split(',');
							selectStmt.orWhereIn(stmt.field, items);
							break;
						}
						case 'notin': {
							let items = stmt.value.split(',');
							selectStmt.whereNotIn(stmt.field, items);
							break;
						}
						case 'gt': {
							selectStmt.orWhere(stmt.field, '>', stmt.value);
							break;
						}
						case 'gte': {
							selectStmt.orWhere(stmt.field, '>=', stmt.value);
							break;
						}
						case 'lt': {
							selectStmt.orWhere(stmt.field, '<', stmt.value);
							break;
						}
						case 'lte': {
							console.log(`Testing ${stmt.field} for IN on ${stmt.value}`);
							selectStmt.orWhere(stmt.field, '<=', stmt.value);
							break;
						}
						case 'contains': {
							selectStmt.orWhereRaw(
								`LOWER(${stmt.field}) like '%${stmt.value.toLowerCase()}%'`
							);
							break;
						}
						default: {
							console.log(`IGNORING ${stmt.field} on ${stmt.value}`);
						}
					}
				});
			}

			if (sort && sort.length > 0) {
				sort.forEach((stmt) => {
					selectStmt.orderBy(stmt.field, stmt.direction);
				});
			} else {
				selectStmt.orderBy('place.primaryName');
			}

			let fullData = await selectStmt;
			let uniqIds = _.uniq(fullData.map((i: any) => i.id));
			let count = uniqIds.length;
			let page_count = Math.ceil(count / page_size);

			let data = await selectStmt.offset(skip).limit(take);
			let results = {
				data,
				meta: { page, page_size, item_count: count, page_count },
			};

			resolve(results);
		});
	}
}
