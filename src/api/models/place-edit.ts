import { pick } from 'lodash';

import { mapKeysDeep, pascalCase } from '../utils/lodash-extensions';
import { ColumnRemaping, PlainObject, Place } from '.';

export class PlaceEdit {
	id?: number;
	placeId?: number;
	associationJSON?: string;
	block?: string;
	bordenNumber?: string;
	buildingSize?: string;
	category?: number;
	cIHBNumber?: string;
	communityId?: number;
	conditionComment?: string;
	constructionPeriodJSON?: string;
	contactJSON?: string;
	contributingResourceJSON?: string;
	contributingResources?: string;
	coordinateDetermination?: number;
	currentUseComment?: string;
	datesJSON?: string;
	descriptionJSON?: string;
	designations?: string;
	doorCondition?: number;
	editDate?: Date;
	editorUserId?: number;
	fHBRONumber?: string;
	firstNationAssociationJSON?: string;
	floorCondition?: number;
	functionalUseJSON?: string;
	geocode?: string;
	groupYHSI?: string;
	hectareArea?: string;
	historicalPatternJSON?: string;
	isPubliclyAccessible?: boolean;
	jurisdiction?: number;
	lAGroup?: string;
	latitude?: string;
	locationComment?: string;
	locationContext?: string;
	longitude?: string;
	lot?: string;
	mailingAddress?: string;
	mailingCountry?: string;
	mailingPostalCode?: string;
	mailingProvince?: string;
	nameJSON?: string;
	nTSMapSheet?: string;
	otherCommunity?: string;
	otherLocality?: string;
	ownerConsent?: number;
	ownershipJSON?: string;
	physicalAddress?: string;
	physicalCountry?: string;
	physicalPostalCode?: string;
	physicalProvince?: string;
	planNumber?: string;
	previousAddress?: string;
	previousOwnershipJSON?: string;
	primaryName?: string;
	recognitionDate?: Date;
	recordJSON?: string;
	records?: string;
	resourceType?: string;
	revisionLogJSON?: string;
	rollNumber?: string;
	roofCondition?: number;
	showInRegister?: boolean;
	siteCategories?: string;
	siteCategoryJSON?: string;
	siteDistrictNumber?: string;
	siteStatus?: number;
	slideNegativeIndex?: string;
	statute2Id?: number;
	statuteId?: number;
	themeJSON?: string;
	wallCondition?: number;
	webLinkJSON?: string;
	yGBuildingNumber?: string;
	yGReserveNumber?: string;
	yHSIId?: string;
	yHSPastUse?: string;
	yHSThemes?: string;
	townSiteMapNumber?: string;
	zoning?: string;
	[key: string]: any;

	private fields: ReadonlyArray<string> = Object.freeze([
		'id',
		'placeId',
		'associationJSON',
		'block',
		'bordenNumber',
		'buildingSize',
		'category',
		'cIHBNumber',
		'communityId',
		'conditionComment',
		'constructionPeriodJSON',
		'contactJSON',
		'contributingResourceJSON',
		'contributingResources',
		'coordinateDetermination',
		'currentUseComment',
		'datesJSON',
		'descriptionJSON',
		'designations',
		'doorCondition',
		'editDate',
		'editorUserId',
		'fHBRONumber',
		'firstNationAssociationJSON',
		'floorCondition',
		'functionalUseJSON',
		'geocode',
		'groupYHSI',
		'hectareArea',
		'historicalPatternJSON',
		'isPubliclyAccessible',
		'jurisdiction',
		'lAGroup',
		'latitude',
		'locationComment',
		'locationContext',
		'longitude',
		'lot',
		'mailingAddress',
		'mailingCountry',
		'mailingPostalCode',
		'mailingProvince',
		'nameJSON',
		'nTSMapSheet',
		'otherCommunity',
		'otherLocality',
		'ownerConsent',
		'ownershipJSON',
		'physicalAddress',
		'physicalCountry',
		'physicalPostalCode',
		'physicalProvince',
		'planNumber',
		'previousAddress',
		'previousOwnershipJSON',
		'primaryName',
		'recognitionDate',
		'recordJSON',
		'records',
		'resourceType',
		'revisionLogJSON',
		'rollNumber',
		'roofCondition',
		'showInRegister',
		'siteCategories',
		'siteCategoryJSON',
		'siteDistrictNumber',
		'siteStatus',
		'slideNegativeIndex',
		'statute2Id',
		'statuteId',
		'themeJSON',
		'wallCondition',
		'webLinkJSON',
		'yGBuildingNumber',
		'yGReserveNumber',
		'yHSIId',
		'yHSPastUse',
		'yHSThemes',
		'townSiteMapNumber',
		'zoning',
	]);

	private associationsColumns: ColumnRemaping = Object.freeze({
		associations: 'associationJSON',
		constructionPeriods: 'constructionPeriodJSON',
		contacts: 'contactJSON',
		dates: 'datesJSON',
		descriptions: 'descriptionJSON',
		firstNationAssociations: 'firstNationAssociationJSON',
		functionalUses: 'functionalUseJSON',
		historicalPatterns: 'historicalPatternJSON',
		names: 'nameJSON',
		ownerships: 'ownershipJSON',
		previousOwnerships: 'previousOwnershipJSON',
		revisionLogs: 'revisionLogJSON',
		themes: 'themeJSON',
		webLinks: 'webLinkJSON',
	});

	private commaDelimitedArrayColumns = Object.freeze([
		'contributingResources',
		'designations',
		'records',
		'siteCategories',
	]);

	constructor(attributes: PlainObject) {
		Object.entries(attributes).forEach(([key, value]) => {
			if (key in this.associationsColumns) {
				const associationName = this.associationsColumns[key];
				this[associationName] = this.pascalCaseAndJsonStringify(value);
			} else if (this.commaDelimitedArrayColumns.includes(key)) {
				this[key] = Place.encodeCommaDelimitedArray(value);
			} else {
				this[key] = value;
			}
		});
	}

	pascalCaseAndJsonStringify(value: PlainObject): string {
		const pascalizedValue = mapKeysDeep(value, pascalCase);
		return JSON.stringify(pascalizedValue);
	}

	toDbObject() {
		const dbObject: PlainObject = {};
		this.fields.forEach((field) => {
			if (field === 'id') {
				// drop the id column
			} else if (this[field] !== undefined) {
				dbObject[field] = this[field];
			}
		});
		return dbObject;
	}
}
