import knex, { Knex } from 'knex';
import moment from 'moment';
import { get, isEmpty, isNull, isUndefined, uniq } from 'lodash';
import { COORDINATE_DETERMINATION_TYPES } from '../models';

import {
	AssociationService,
	ConstructionPeriodService,
	ContactService,
	DateService,
	DescriptionService,
	FirstNationAssociationService,
	FunctionalUseService,
	HistoricalPatternService,
	NameService,
	OwnershipService,
	PhotoService,
	PlaceEditService,
	PreviousOwnershipService,
	RevisionLogService,
	SortStatement,
	StaticService,
	ThemeService,
	WebLinkService,
} from './';
import { PLACE_FIELDS, REGISTER_FIELDS } from '../data';
import { DescriptionTypeEnums, Place, PlainObject, User, UserRoles } from '../models';
import { NotFoundError } from '../utils/validation';

// This function can go away when the back-end serves the
// relationship data as part of the data directly.
// e.g. { data: { names: [{ id: 1, placeId: 1, description: "SomeName" }] } }
// instead of { data: {}, relationships: { names: { data: [{ id: 1, placeId: 1, description: "SomeName" }] } } }
function injectRelationshipData(attributes: PlainObject, relationships: PlainObject) {
	Object.keys(relationships).forEach((key) => {
		if (attributes.hasOwnProperty(key)) {
			console.error('Relationship data conflicts with source data.');
			return;
		}

		attributes[key] = get(relationships, `${key}.data`, []);
	});
}

export class PlaceService {
	private db: Knex;
	private assocationService: AssociationService;
	private constructionPeriodService: ConstructionPeriodService;
	private contactService: ContactService;
	private dateService: DateService;
	private descriptionService: DescriptionService;
	private firstNationAssociationService: FirstNationAssociationService;
	private functionalUseService: FunctionalUseService;
	private historicalPatternService: HistoricalPatternService;
	private nameService: NameService;
	private ownershipService: OwnershipService;
	private photoService: PhotoService;
	private placeEditService: PlaceEditService;
	private previousOwnershipService: PreviousOwnershipService;
	private revisionLogService: RevisionLogService;
	private staticService: StaticService;
	private themeService: ThemeService;
	private webLinkService: WebLinkService;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
		this.assocationService = new AssociationService(config);
		this.constructionPeriodService = new ConstructionPeriodService(config);
		this.contactService = new ContactService(config);
		this.dateService = new DateService(config);
		this.descriptionService = new DescriptionService(config);
		this.firstNationAssociationService = new FirstNationAssociationService(config);
		this.functionalUseService = new FunctionalUseService(config);
		this.historicalPatternService = new HistoricalPatternService();
		this.nameService = new NameService();
		this.ownershipService = new OwnershipService(config);
		this.photoService = new PhotoService(config);
		this.placeEditService = new PlaceEditService();
		this.previousOwnershipService = new PreviousOwnershipService(config);
		this.revisionLogService = new RevisionLogService(config);
		this.staticService = new StaticService(config);
		this.themeService = new ThemeService(config);
		this.webLinkService = new WebLinkService(config);
	}

	async getAll(skip: number, take: number): Promise<Array<Place>> {
		return this.db('place').select<Place[]>(PLACE_FIELDS).orderBy('id').offset(skip).limit(take);
	}

	async getAllWithPhoto(skip: number, take: number): Promise<Array<Place>> {
		const db = this.db;
		return this.db('place')
			.distinct('Place.Id')
			.select<Place[]>([...PLACE_FIELDS, 'PH.ThumbFile', 'PH.caption'])
			.leftJoin('dbo.photo as PH', function () {
				this.on('PH.PlaceId', '=', 'Place.Id')
					/* The new line here */
					.andOn(
						'PH.DateCreated',
						'=',
						db.raw('(select min(PH.DateCreated) from dbo.photo as PH where PH.PlaceId = Place.Id)')
					);
			});
	}

	async getRegisterAll(skip: number, take: number): Promise<Array<any>> {
		const db = this.db;
		return this.db('place')
			.select([...REGISTER_FIELDS, 'PH.ThumbFile', 'PH.caption'])
			.join('community', 'community.id', 'place.communityid')
			.leftJoin('dbo.photo as PH', function () {
				this.on('PH.PlaceId', '=', 'Place.Id')
					/* The new line here */
					.andOn(
						'PH.DateCreated',
						'=',
						db.raw('(select min(PH.DateCreated) from dbo.photo as PH where PH.PlaceId = Place.Id)')
					);
			})
			.where({ showInRegister: true })
			.orderBy('Place.Id')
			.offset(skip)
			.limit(take);
	}

	async getPlaceInRegisterCount(): Promise<number> {
		return new Promise(async (resolve, reject) => {
			let results = await this.db('place')
				.count('*', {
					as: 'count',
				})
				.where({ showInRegister: true });

			if (results) {
				const val = results[0].count as number;
				resolve(val);
			}

			resolve(0);
		});
	}

	async getIdsForUser(user?: User) {
		const selectStatement = this.db('place').select('yHSIId');

		this.scopeSitesToUser(selectStatement, user);

		return selectStatement.then((list) => list);
	}

	async getById(id: number, user?: User): Promise<{ place: Place; relationships: any }> {
		return this.db('place')
			.first(PLACE_FIELDS)
			.where({ 'place.id': id })
			.leftJoin('community', 'community.id', 'place.communityId')
			.select('community.name as communityName')
			.then(Place.decodeCommaDelimitedArrayColumns)
			.then(async (place) => {
				if (!place) {
					return Promise.reject(new NotFoundError(`Could not find Place for id=${id}`));
				}

				place.coordinateDeterminationName =
					Object.values(COORDINATE_DETERMINATION_TYPES).find(
						(i) => i.value == place.coordinateDetermination
					)?.text ?? '';

				place.hasPendingChanges = await this.placeEditService.existsForPlace(id);
				place.associations = await this.assocationService.getFor(id);
				place.constructionPeriods = await this.constructionPeriodService.getFor(id);
				place.contacts = await this.contactService.getFor(id);
				place.dates = await this.dateService.getFor(id);
				place.descriptions = await this.descriptionService.getForPlace(id);
				place.firstNationAssociations = await this.firstNationAssociationService.getFor(id);
				place.functionalUses = await this.functionalUseService.getFor(id);
				place.historicalPatterns = await this.historicalPatternService.getFor(id);
				place.names = await this.nameService.getFor(id);
				place.ownerships = await this.ownershipService.getFor(id);
				place.recognitionDate = isNull(place.recognitionDate)
					? null
					: moment(place.recognitionDate).add(7, 'hours').format('YYYY-MM-DD');
				place.revisionLogs = await this.revisionLogService.getFor(id);
				place.themes = await this.themeService.getFor(id);
				place.previousOwnerships = await this.previousOwnershipService.getFor(id);
				place.webLinks = await this.webLinkService.getForPlace(id);

				const photos = await this.photoService.getAllForPlace(id);

				const relationships = {
					photos: { data: photos },
				};

				return { place, relationships };
			});
	}

	async getRegisterById(id: number): Promise<any | undefined> {
		return this.db('place')
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
			const results = await this.db<number>('place').count('*', {
				as: 'count',
			});

			if (results) {
				const val = results[0].count as number;
				resolve(val);
			}

			resolve(0);
		});
	}

	async addPlace(item: Place, currentUser: User): Promise<Place | undefined> {
		const result = await this.db('place').insert(item).returning<Place[]>('*');

		this.placeEditService.create({
			...item,
			PlaceId: result[0].id,
			editorUserId: currentUser.id,
			editDate: moment().format('YYYY-MM-DD'),
		});

		if (result) return result[0];
	}

	updateRelations(id: number, attributes: PlainObject) {
		return Promise.resolve(attributes).then(async (attrs) => {
			if (Object.prototype.hasOwnProperty.call(attrs, 'associations')) {
				await this.assocationService.upsertFor(id, attrs['associations']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'constructionPeriods')) {
				await this.constructionPeriodService.upsertFor(id, attrs['constructionPeriods']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'contacts')) {
				await this.contactService.upsertFor(id, attrs['contacts']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'dates')) {
				await this.dateService.upsertFor(id, attrs['dates']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'descriptions')) {
				await this.descriptionService.upsertForPlace(id, attrs['descriptions']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'firstNationAssociations')) {
				await this.firstNationAssociationService.upsertFor(id, attrs['firstNationAssociations']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'functionalUses')) {
				await this.functionalUseService.upsertFor(id, attrs['functionalUses']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'historicalPatterns')) {
				await this.historicalPatternService.upsertFor(id, attrs['historicalPatterns']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'names')) {
				await this.nameService.upsertFor(id, attrs['names']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'ownerships')) {
				await this.ownershipService.upsertFor(id, attrs['ownerships']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'previousOwnerships')) {
				await this.previousOwnershipService.upsertFor(id, attrs['previousOwnerships']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'revisionLogs')) {
				await this.revisionLogService.upsertFor(id, attrs['revisionLogs']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'themes')) {
				await this.themeService.upsertFor(id, attrs['themes']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'webLinks')) {
				await this.webLinkService.upsertForPlace(id, attrs['webLinks']);
			}
			return attrs;
		});
	}

	update(id: number, attributes: PlainObject): Promise<Place | undefined> {
		return Promise.resolve(attributes)
			.then((attrs) => this.updateRelations(id, attrs))
			.then(Place.stripOutNonColumnAttributes)
			.then(Place.encodeCommaDelimitedArrayColumns)
			.then((encodedAttributes) => {
				if (isEmpty(encodedAttributes)) return;

				return this.db('place').where({ id }).update(encodedAttributes);
			})
			.then(() => {
				return this.getById(id).then(({ place, relationships }) => {
					injectRelationshipData(place, relationships);
					return place;
				});
			});
	}

	async generateIdFor(nTSMapSheet: string): Promise<string> {
		const places = await this.db('place')
			.whereILike('YHSIId', `${nTSMapSheet}/%`)
			.select('YHSIId')
			.orderBy('yHSIId');

		// Note: The following loop runs in O(999 * n) (or O(n) where n is the number of places)
		// If performance becomes an issue as number of places grows, consider using a Set
		let placeIndex = 1;
		for (; placeIndex <= 999; placeIndex++) {
			const candidateYHSIId = `${nTSMapSheet}/${placeIndex.toString().padStart(3, '0')}`;
			const isMatch = places.find((place) => place.YHSIId == candidateYHSIId);

			if (isUndefined(isMatch)) {
				return `${nTSMapSheet}/${placeIndex.toString().padStart(3, '0')}`;
			}
		}

		throw new Error(
			`Unable to generate YHSIId: ${nTSMapSheet}/001 to ${nTSMapSheet}/999 are currently in use`
		);
	}

	async doSearch(
		scope: Knex.QueryBuilder,
		query: { [key: string]: any },
		sort: Array<SortStatement>,
		page: number,
		itemsPerPage: number,
		skip: number,
		take: number
	): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const selectStatement = scope
				.distinct()
				.select(...PLACE_FIELDS, { status: 'StatusTable.Status' })
				.leftOuterJoin('FirstNationAssociation', 'Place.Id', 'FirstNationAssociation.PlaceId')
				.leftOuterJoin('ConstructionPeriod', 'Place.Id', 'ConstructionPeriod.PlaceId')
				.leftOuterJoin('RevisionLog', 'Place.id', 'RevisionLog.PlaceId')
				.leftOuterJoin('Description', 'Place.id', 'Description.PlaceId')
				.leftOuterJoin('Ownership', 'Place.id', 'Ownership.PlaceId')
				.leftOuterJoin('Name', 'Place.id', 'Name.PlaceId')
				.leftOuterJoin(
					this.db('Place')
						.select({
							PlaceId: 'Place.Id',
							Status: this.db.raw(
								`CASE WHEN PlaceEdit.PlaceId IS NULL THEN 'Editable' ELSE 'Editing' END`
							),
						})
						.as('StatusTable')
						.leftJoin('PlaceEdit', 'PlaceEdit.PlaceId', 'Place.Id'),
					'Place.Id',
					'StatusTable.PlaceId'
				);

			type QueryBuilder = {
				(base: Knex.QueryInterface, value: any): Knex.QueryInterface;
			};

			const SUPPORTED_QUERIES: { [key: string]: QueryBuilder } = Object.freeze({
				search(base: Knex.QueryInterface, value: any) {
					return base.where((builder: any) =>
						builder
							.whereILike('PrimaryName', `%${value}%`)
							.orWhereILike('YHSIId', `%${value}%`)
							.orWhereILike('[Name].[Description]', `%${value}%`)
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
				includingConstructionPeriodValues(base: Knex.QueryInterface, value: any) {
					return base.whereIn('[ConstructionPeriod].[Type]', value);
				},
				excludingConstructionPeriodValues(base: Knex.QueryInterface, value: any) {
					return base.whereNotIn('[ConstructionPeriod].[Type]', value);
				},
				includingSiteStatusIds(base: Knex.QueryInterface, value: any) {
					return base.whereIn('SiteStatus', value);
				},
				excludingSiteStatusIds(base: Knex.QueryInterface, value: any) {
					return base.whereNotIn('SiteStatus', value);
				},
				includingFirstNationIds(base: Knex.QueryInterface, value: any) {
					return base.whereIn('[FirstNationAssociation].[FirstNationId]', value);
				},
				excludingFirstNationIds(base: Knex.QueryInterface, value: any) {
					return base.whereNotIn('[FirstNationAssociation].[FirstNationId]', value);
				},
				includingFirstNationAssociationTypes(base: Knex.QueryInterface, value: any) {
					return base.whereIn('[FirstNationAssociation].[FirstNationAssociationType]', value);
				},
				excludingFirstNationAssociationTypes(base: Knex.QueryInterface, value: any) {
					return base.whereNotIn('[FirstNationAssociation].[FirstNationAssociationType]', value);
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
						.where('[Description].[Type]', DescriptionTypeEnums.ConstructionStyle);
				},
				culturalHistoryContains(base: Knex.QueryInterface, value: any) {
					return base
						.whereILike('[Description].[DescriptionText]', `%${value}%`)
						.where('[Description].[Type]', DescriptionTypeEnums.CulturalHistory);
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

			const fullData = await selectStatement.catch((error: any) => {
				reject(error);
				return [];
			});

			const uniqIds = uniq(fullData.map((i: any) => i.id));
			const count = uniqIds.length;
			const pageCount = Math.ceil(count / itemsPerPage);

			const data = await selectStatement.offset(skip).limit(take).catch(reject);

			const results = {
				data,
				meta: { page, itemsPerPage, itemCount: count, pageCount },
			};

			resolve(results);
		});
	}

	async scopeSitesToUser(query: Knex.QueryInterface, user?: User) {
		// without a user passed in, you see nothing
		if (!user) {
			query.whereRaw('(1=0)');
			return;
		}

		// Administrators see everything
		if (user.role_list && user.role_list.indexOf(UserRoles.ADMINISTRATOR) >= 0) return;

		// If you don't have one of the site roles, you see nothing
		if (user.roles && user.roles.indexOf('Site') == -1) {
			query.whereRaw('(1=0)');
			return;
		}

		if (user.site_access) {
			const mapSheets = user.site_access
				.filter((a) => a.access_type_id == 1)
				.map((a) => a.access_text);
			const communities = user.site_access
				.filter((a) => a.access_type_id == 2)
				.map((a) => a.access_text);
			const firstNations = user.site_access
				.filter((a) => a.access_type_id == 3)
				.map((a) => a.access_text);
			const allAccess = user.site_access.find((a) => a.access_type_id == 4);

			let scope = '(1=0';

			if (allAccess) {
				scope += ' OR 1=1';
			} else {
				if (mapSheets.length > 0) scope += ` OR NTSMapSheet IN ('${mapSheets.join("','")}')`;
				if (communities.length > 0) scope += ` OR CommunityId IN (${communities.join(',')})`;
				if (firstNations.length > 0)
					scope += ` OR [FirstNationAssociation].[FirstNationId] IN (${firstNations.join(',')})`;
			}

			scope += ')';

			query.whereRaw(scope);
		}
	}
}
