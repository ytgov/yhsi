import knex, { Knex } from 'knex';
import moment from 'moment';
import { get, isEmpty, uniq } from 'lodash';

import {
	AssociationService,
	ConstructionPeriodService,
	ContactService,
	DateService,
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
import {
	Description,
	DESCRIPTION_TYPES,
	DESCRIPTION_TYPE_ENUMS,
	PLACE_FIELDS,
	REGISTER_FIELDS,
} from '../data';
import {
	Contact,
	GenericEnum,
	Place,
	PlainObject,
	RevisionLog,
	User,
	UserRoles,
	WebLink,
} from '../models';
import { NotFoundError } from '../utils/validation';

function combine(
	list1: Array<any>,
	list2: Array<any> | ReadonlyArray<any>,
	linker: any,
	linker2: any,
	value: any,
	typeText: any = 'typeText'
): any[] {
	list1.forEach((item) => {
		let match = list2.filter((i) => i[linker] == item[linker2]);

		if (match && match[0]) {
			let add = { [typeText]: match[0][value] };
			item = Object.assign(item, add);
		} else item = Object.assign(item, { [typeText]: null });
	});

	return list1;
}

// This function can go away when the back-end serves the
// relationship data as part of the data directly.
// e.g. { data: { names: [{ id: 1, placeId: 1, description: "SomeName" }] } }
// instead of { data: {}, relationships: { names: { data: [{ id: 1, placeId: 1, description: "SomeName" }] } } }
function injectRelationshipData(
	attributes: PlainObject,
	relationships: PlainObject
) {
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
		this.firstNationAssociationService = new FirstNationAssociationService(
			config
		);
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
		return this.db('place')
			.select<Place[]>(PLACE_FIELDS)
			.orderBy('id')
			.offset(skip)
			.limit(take);
	}

	async getRegisterAll(): Promise<Array<any>> {
		return this.db('place')
			.join('community', 'community.id', 'place.communityid')
			.where({ showInRegister: true })
			.select(REGISTER_FIELDS)
			.select(this.db.raw("'English teaser' as teaserEnglish"))
			.select(this.db.raw("'French teaser' as teaserFrench"));
	}

	async getIdsForUser(user?: User) {
		let selectStatement = this.db('place').select('yHSIId');

		this.scopeSitesToUser(selectStatement, user);

		return selectStatement.then((list) => list);
	}

	async getById(id: number, user?: User) {
		return this.db('place')
			.first(PLACE_FIELDS)
			.where({ id: id })
			.then(Place.decodeCommaDelimitedArrayColumns)
			.then(async (place) => {
				if (!place) {
					return Promise.reject(
						new NotFoundError(`Could not find Place for id=${id}`)
					);
				}

				place.hasPendingChanges = await this.placeEditService.existsForPlace(
					id
				);
				place.associations = await this.assocationService.getFor(id);
				place.constructionPeriods = await this.constructionPeriodService.getFor(
					id
				);
				place.contacts = await this.contactService.getFor(id);
				place.dates = await this.dateService.getFor(id);
				place.firstNationAssociations =
					await this.firstNationAssociationService.getFor(id);
				place.functionalUses = await this.functionalUseService.getFor(id);
				place.historicalPatterns = await this.historicalPatternService.getFor(
					id
				);
				place.names = await this.nameService.getFor(id);
				place.ownerships = await this.ownershipService.getFor(id);
				place.revisionLogs = await this.revisionLogService.getFor(id);
				place.themes = await this.themeService.getFor(id);
				place.previousOwnerships = await this.previousOwnershipService.getFor(
					id
				);
				place.webLinks = await this.webLinkService.getForPlace(id);

				const descriptions = combine(
					await this.getDescriptionsFor(id),
					this.getDescriptionTypes(),
					'value',
					'type',
					'text'
				);

				const photos = await this.photoService.getAllForPlace(id);

				const relationships = {
					photos: { data: photos },
					descriptions: { data: descriptions },
				};

				place.recognitionDate = place.recognitionDate
					? moment(place.recognitionDate).add(7, 'hours').format('YYYY-MM-DD')
					: '';
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
			let results = await this.db<number>('place').count('*', {
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
		return this.db('place').insert(item).returning<Place>(PLACE_FIELDS);
	}

	updateRelations(id: number, attributes: PlainObject) {
		return Promise.resolve(attributes).then(async (attrs) => {
			if (Object.prototype.hasOwnProperty.call(attrs, 'associations')) {
				await this.assocationService.upsertFor(id, attrs['associations']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'constructionPeriods')) {
				await this.constructionPeriodService.upsertFor(
					id,
					attrs['constructionPeriods']
				);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'contacts')) {
				await this.contactService.upsertFor(id, attrs['contacts']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'dates')) {
				await this.dateService.upsertFor(id, attrs['dates']);
			}
			if (
				Object.prototype.hasOwnProperty.call(attrs, 'firstNationAssociations')
			) {
				await this.firstNationAssociationService.upsertFor(
					id,
					attrs['firstNationAssociations']
				);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'functionalUses')) {
				await this.functionalUseService.upsertFor(id, attrs['functionalUses']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'historicalPatterns')) {
				await this.historicalPatternService.upsertFor(
					id,
					attrs['historicalPatterns']
				);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'names')) {
				await this.nameService.upsertFor(id, attrs['names']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'ownerships')) {
				await this.ownershipService.upsertFor(id, attrs['ownerships']);
			}
			if (Object.prototype.hasOwnProperty.call(attrs, 'previousOwnerships')) {
				await this.previousOwnershipService.upsertFor(
					id,
					attrs['previousOwnerships']
				);
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

	updatePlace(id: number, item: Place): Promise<Place | undefined> {
		return this.db('place').where({ id }).update(item);
	}

	async generateIdFor(nTSMapSheet: string): Promise<string> {
		let maxPlace = await this.db('place')
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

	async getContactsFor(id: number): Promise<Contact[]> {
		return this.db('Contact')
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
		return this.db('Contact').insert(name);
	}

	async removeContact(id: number) {
		return this.db('Contact').where({ id }).delete();
	}

	async getRevisionLogFor(id: number): Promise<RevisionLog[]> {
		return this.db('RevisionLog')
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
		return this.db('RevisionLog').insert(name);
	}

	async removeRevisionLog(id: number) {
		return this.db('RevisionLog').where({ id }).delete();
	}

	async getWebLinksFor(id: number): Promise<WebLink[]> {
		return this.db('WebLink')
			.where({ placeId: id })
			.select<WebLink[]>(['id', 'placeId', 'type', 'address']);
	}

	async addWebLink(name: WebLink) {
		return this.db('WebLink').insert(name);
	}

	async removeWebLink(id: number) {
		return this.db('WebLink').where({ id }).delete();
	}

	async getDescriptionsFor(id: number): Promise<Description[]> {
		return this.db('Description')
			.where({ placeId: id })
			.select<Description[]>(['id', 'placeId', 'descriptionText', 'type']);
	}

	async addDescription(name: Description) {
		return this.db('Description').insert(name);
	}

	async removeDescription(id: number) {
		return this.db('Description').where({ id }).delete();
	}

	getDescriptionTypes(): GenericEnum[] {
		return DESCRIPTION_TYPES;
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
				.leftOuterJoin('Ownership', 'Place.id', 'Ownership.PlaceId')
				.leftOuterJoin(
					this.db('Place')
						.select({
							PlaceId: 'Place.Id',
							Status: this.db.raw(
								`CASE WHEN PlaceEdit.PlaceId IS NULL THEN '' ELSE 'Editing' END`
							),
						})
						.as('StatusTable')
						.innerJoin('PlaceEdit', 'PlaceEdit.PlaceId', 'Place.Id'),
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

			let fullData = await selectStatement.catch((error: any) => {
				reject(error);
				return [];
			});

			let uniqIds = uniq(fullData.map((i: any) => i.id));
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

	async scopeSitesToUser(query: Knex.QueryInterface, user?: User) {
		// without a user passed in, you see nothing
		if (!user) {
			query.whereRaw('(1=0)');
			return;
		}

		// Administrators see everything
		if (user.role_list && user.role_list.indexOf(UserRoles.ADMINISTRATOR) >= 0)
			return;

		// If you don't have one of the site roles, you see nothing
		if (user.roles && user.roles.indexOf('Site') == -1) {
			query.whereRaw('(1=0)');
			return;
		}

		if (user.site_access) {
			let mapSheets = user.site_access
				.filter((a) => a.access_type_id == 1)
				.map((a) => a.access_text);
			let communities = user.site_access
				.filter((a) => a.access_type_id == 2)
				.map((a) => a.access_text);
			let firstNations = user.site_access
				.filter((a) => a.access_type_id == 3)
				.map((a) => a.access_text);

			let scope = '(1=0';

			if (mapSheets.length > 0)
				scope += ` OR NTSMapSheet IN ('${mapSheets.join("','")}')`;
			if (communities.length > 0)
				scope += ` OR CommunityId IN (${communities.join(',')})`;
			if (firstNations.length > 0)
				scope += ` OR [FirstNationAssociation].[FirstNationId] IN (${firstNations.join(
					','
				)})`;

			scope += ')';

			query.whereRaw(scope);
		}
	}
}
