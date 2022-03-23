import knex, { Knex } from 'knex';
import { QueryStatement, SortStatement } from './';
import {
	Association,
	CONSTRUCTION_PERIODS,
	ConstructionPeriod,
	Contact,
	Dates,
	Description,
	DESCRIPTION_TYPES,
	DESCRIPTION_TYPE_ENUMS,
	FIRST_NATION_ASSOCIATION_TYPES,
	FirstNationAssociation,
	FunctionalUse,
	HistoricalPattern,
	Name,
	Ownership,
	OWNERSHIP_TYPES,
	Place,
	PLACE_FIELDS,
	PreviousOwnership,
	REGISTER_FIELDS,
	REVISION_LOG_TYPES,
	RevisionLog,
	Theme,
	WebLink,
} from '../data';
import { GenericEnum } from './static-service';
import _ from 'lodash';

export class PlaceService {
	private knex: Knex;

	constructor(config: Knex.Config<any>) {
		this.knex = knex(config);
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
			.catch((err: any) => {
				//console.log('BOMBED', err);
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
			.catch((err: any) => {
				//console.log('BOMBED', err);
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
		return FIRST_NATION_ASSOCIATION_TYPES;
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
		return CONSTRUCTION_PERIODS;
	}

	getFunctionalUseTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'Current' },
			{ value: 2, text: 'Historic' },
		];
	}

	getOwnershipTypes(): GenericEnum[] {
		return OWNERSHIP_TYPES;
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
		return REVISION_LOG_TYPES;
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
		return DESCRIPTION_TYPES;
	}

	async doSearch(
		query: { [key: string]: any },
		sort: Array<SortStatement>,
		page: number,
		itemsPerPage: number,
		skip: number,
		take: number
	): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const selectStatement = this.knex('place')
				.distinct()
				.select(PLACE_FIELDS)
				.leftOuterJoin(
					'FirstNationAssociation',
					'Place.Id',
					'FirstNationAssociation.PlaceId'
				)
				.leftOuterJoin(
					'ConstructionPeriod',
					'Place.Id',
					'ConstructionPeriod.PlaceId'
				)
				.leftOuterJoin('RevisionLog', 'Place.id', 'RevisionLog.PlaceId')
				.leftOuterJoin('Description', 'Place.id', 'Description.PlaceId')
				.leftOuterJoin('Ownership', 'Place.id', 'Ownership.PlaceId');

			type QueryBuilder = {
				(base: Knex.QueryInterface, value: any): Knex.QueryInterface;
			};

			const SUPPORTED_QUERIES: { [key: string]: QueryBuilder } = Object.freeze({
				search(base: Knex.QueryInterface, value: any) {
					return base.where((builder) =>
						builder
							.whereILike('PrimaryName', `%${value}%`)
							.orWhereILike('YHSIId', `%${value}%`)
					);
				},
				includingCommunityIds(base: Knex.QueryInterface, value: any) {
					return base.whereIn('CommunityId', value);
				},
				excludingCommunityIds(base: Knex.QueryInterface, value: any) {
					return base.whereNotIn('CommunityId', value);
				},
				includingNtsMapSheets(base: Knex.QueryInterface, value: any) {
					return base.whereIn('NTSMapSheet', value);
				},
				excludingNtsMapSheets(base: Knex.QueryInterface, value: any) {
					return base.whereNotIn('NTSMapSheet', value);
				},
				includingConstructionPeriodValues(
					base: Knex.QueryInterface,
					value: any
				) {
					return base.whereIn('[ConstructionPeriod].[Type]', value);
				},
				excludingConstructionPeriodValues(
					base: Knex.QueryInterface,
					value: any
				) {
					return base.whereNotIn('[ConstructionPeriod].[Type]', value);
				},
				includingSiteStatusIds(base: Knex.QueryInterface, value: any) {
					return base.whereIn('SiteStatus', value);
				},
				excludingSiteStatusIds(base: Knex.QueryInterface, value: any) {
					return base.whereNotIn('SiteStatus', value);
				},
				includingFirstNationIds(base: Knex.QueryInterface, value: any) {
					return base.whereIn(
						'[FirstNationAssociation].[FirstNationId]',
						value
					);
				},
				excludingFirstNationIds(base: Knex.QueryInterface, value: any) {
					return base.whereNotIn(
						'[FirstNationAssociation].[FirstNationId]',
						value
					);
				},
				includingFirstNationAssociationTypes(
					base: Knex.QueryInterface,
					value: any
				) {
					return base.whereIn(
						'[FirstNationAssociation].[FirstNationAssociationType]',
						value
					);
				},
				excludingFirstNationAssociationTypes(
					base: Knex.QueryInterface,
					value: any
				) {
					return base.whereNotIn(
						'[FirstNationAssociation].[FirstNationAssociationType]',
						value
					);
				},
				includingRevisionTypes(base: Knex.QueryInterface, value: any) {
					return base.whereIn('[RevisionLog].[RevisionLogType]', value);
				},
				excludingRevisionTypes(base: Knex.QueryInterface, value: any) {
					return base.whereNotIn('[RevisionLog].[RevisionLogType]', value);
				},
				revisedByContains(base: Knex.QueryInterface, value: any) {
					return base.whereILike('[RevisionLog].[RevisedBy]', `%${value}%`);
				},
				revisedDateContains(base: Knex.QueryInterface, value: any) {
					return base.whereILike('[RevisionLog].[RevisionDate]', `%${value}%`);
				},
				addressContains(base: Knex.QueryInterface, value: any) {
					return base.whereILike('[Place].[PhysicalAddress]', `%${value}%`);
				},
				constructionStyleContains(base: Knex.QueryInterface, value: any) {
					return base
						.whereILike('[Description].[DescriptionText]', `%${value}%`)
						.where(
							'[Description].[Type]',
							DESCRIPTION_TYPE_ENUMS.CONSTRUCTION_STYLE
						);
				},
				culturalHistoryContains(base: Knex.QueryInterface, value: any) {
					return base
						.whereILike('[Description].[DescriptionText]', `%${value}%`)
						.where(
							'[Description].[Type]',
							DESCRIPTION_TYPE_ENUMS.CULTURAL_HISTORY
						);
				},
				includingOwnershipTypes(base: Knex.QueryInterface, value: any) {
					return base.whereIn('[Ownership].[OwnershipType]', value);
				},
				excludingOwnershipTypes(base: Knex.QueryInterface, value: any) {
					return base.whereNotIn('[Ownership].[OwnershipType]', value);
				},
			});

			Object.entries(query).forEach(([name, value]) => {
				const queryBuilder = SUPPORTED_QUERIES[name];
				if (queryBuilder) {
					queryBuilder(selectStatement, value);
				} else {
					const avaiableQueries = Object.keys(SUPPORTED_QUERIES).join(', ');
					reject(
						new Error(
							`Query "${name}" with "${value}" is not supported; use any of: ${avaiableQueries}`
						)
					);
				}
			});

			if (sort && sort.length > 0) {
				sort.forEach((statement) => {
					selectStatement.orderBy(statement.field, statement.direction);
				});
			} else {
				selectStatement.orderBy('place.primaryName');
			}

			let fullData = await selectStatement.catch((error) => {
				reject(error);
				return [];
			});

			let uniqIds = _.uniq(fullData.map((i: any) => i.id));
			let count = uniqIds.length;
			let pageCount = Math.ceil(count / itemsPerPage);

			let data = await selectStatement.offset(skip).limit(take).catch(reject);
			let results = {
				data,
				meta: { page, itemsPerPage, itemCount: count, pageCount },
			};

			resolve(results);
		});
	}
}
