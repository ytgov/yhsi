import { camelCase, mapKeys, pick } from 'lodash';

import { mapKeysDeep, pascalCase } from '../utils/lodash-extensions';
import { PlainObject } from './simple-types';

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

	static FIELDS: ReadonlyArray<string> = Object.freeze([
		'id',
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
		'placeId',
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
		'townSiteMapNumber',
		'wallCondition',
		'webLinkJSON',
		'yGBuildingNumber',
		'yGReserveNumber',
		'yHSIId',
		'yHSPastUse',
		'yHSThemes',
		'zoning',
	]);

	static RELATIONSHIPS_TO_FIELDS: { [key: string]: string } = Object.freeze({
		constructionPeriods: 'constructionPeriodJSON',
		dates: 'datesJSON',
		historicalPatterns: 'historicalPatternJSON',
		names: 'nameJSON',
	});

	static encodeAndDenormalizeJSONColumns(object: PlainObject) {
		Object.keys(object).forEach((key) => {
			if (PlaceEdit.RELATIONSHIPS_TO_FIELDS[key]) {
				const encodedKey = PlaceEdit.RELATIONSHIPS_TO_FIELDS[key];
				const encodedValue = mapKeysDeep(object[key], pascalCase);
				const jsonObjectAsString = JSON.stringify(encodedValue);
				object[encodedKey] = jsonObjectAsString;
				delete object[key];
			}
		});
		return object;
	}

	static parseAndNormalizeJSONColumns(object: PlainObject) {
		Object.keys(object).forEach((key) => {
			if (key.endsWith('JSON')) {
				const cleanedKey = key.replace(/JSON$/, '');
				const objectAsJson = JSON.parse(object[key]);
				object[cleanedKey] = mapKeysDeep(objectAsJson, camelCase);
				delete object[key];
			}
		});
		return object;
	}

	static stripOutNonColumnAttributes(object: PlainObject) {
		return pick(object, PlaceEdit.FIELDS);
	}
}
