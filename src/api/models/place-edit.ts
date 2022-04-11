import { camelCase, mapKeys, pick } from 'lodash';

import { mapKeysDeep, pascalCase } from '../utils/lodash-extensions';
import { PlainObject } from './simple-types';

export class PlaceEdit {
	id?: number;
	placeId?: number;
	editorUserId?: number;
	editDate?: Date;
	primaryName?: string;
	yHSIId?: string;
	jurisdiction?: number;
	statuteId?: number;
	statute2Id?: number;
	recognitionDate?: Date;
	ownerConsent?: number;
	category?: number;
	isPubliclyAccessible?: boolean;
	nTSMapSheet?: string;
	bordenNumber?: string;
	geocode?: string;
	hectareArea?: string;
	latitude?: string;
	longitude?: string;
	locationComment?: string;
	resourceType?: string;
	buildingSize?: string;
	conditionComment?: string;
	currentUseComment?: string;
	yHSPastUse?: string;
	cIHBNumber?: string;
	groupYHSI?: string;
	yGBuildingNumber?: string;
	yGReserveNumber?: string;
	fHBRONumber?: string;
	zoning?: string;
	yownSiteMapNumber?: string;
	siteDistrictNumber?: string;
	planNumber?: string;
	block?: string;
	lot?: string;
	slideNegativeIndex?: string;
	otherCommunity?: string;
	otherLocality?: string;
	previousAddress?: string;
	yHSThemes?: string;
	rollNumber?: string;
	locationContext?: string;
	communityId?: number;
	lAGroup?: string;
	siteStatus?: number;
	floorCondition?: number;
	wallCondition?: number;
	doorCondition?: number;
	roofCondition?: number;
	coordinateDetermination?: number;
	physicalAddress?: string;
	physicalProvince?: string;
	physicalCountry?: string;
	physicalPostalCode?: string;
	mailingAddress?: string;
	mailingProvince?: string;
	mailingCountry?: string;
	mailingPostalCode?: string;
	showInRegister?: boolean;
	siteCategories?: string;
	designations?: string;
	contributingResources?: string;
	records?: string;
	associationJSON?: string;
	constructionPeriodJSON?: string;
	contactJSON?: string;
	contributingResourceJSON?: string;
	datesJSON?: string;
	descriptionJSON?: string;
	firstNationAssociationJSON?: string;
	functionalUseJSON?: string;
	historicalPatternJSON?: string;
	nameJSON?: string;
	previousOwnershipJSON?: string;
	recordJSON?: string;
	revisionLogJSON?: string;
	siteCategoryJSON?: string;
	themeJSON?: string;
	webLinkJSON?: string;
	ownershipJSON?: string;

	static FIELDS: ReadonlyArray<string> = Object.freeze([
		'id',
		'placeId',
		'editorUserId',
		'editDate',
		'primaryName',
		'yHSIId',
		'jurisdiction',
		'statuteId',
		'statute2Id',
		'recognitionDate',
		'ownerConsent',
		'category',
		'isPubliclyAccessible',
		'nTSMapSheet',
		'bordenNumber',
		'geocode',
		'hectareArea',
		'latitude',
		'longitude',
		'locationComment',
		'resourceType',
		'buildingSize',
		'conditionComment',
		'currentUseComment',
		'yHSPastUse',
		'cIHBNumber',
		'groupYHSI',
		'yGBuildingNumber',
		'yGReserveNumber',
		'fHBRONumber',
		'zoning',
		'yownSiteMapNumber',
		'siteDistrictNumber',
		'planNumber',
		'block',
		'lot',
		'slideNegativeIndex',
		'otherCommunity',
		'otherLocality',
		'previousAddress',
		'yHSThemes',
		'rollNumber',
		'locationContext',
		'communityId',
		'lAGroup',
		'siteStatus',
		'floorCondition',
		'wallCondition',
		'doorCondition',
		'roofCondition',
		'coordinateDetermination',
		'physicalAddress',
		'physicalProvince',
		'physicalCountry',
		'physicalPostalCode',
		'mailingAddress',
		'mailingProvince',
		'mailingCountry',
		'mailingPostalCode',
		'showInRegister',
		'siteCategories',
		'designations',
		'contributingResources',
		'records',
		'associationJSON',
		'constructionPeriodJSON',
		'contactJSON',
		'contributingResourceJSON',
		'datesJSON',
		'descriptionJSON',
		'firstNationAssociationJSON',
		'functionalUseJSON',
		'historicalPatternJSON',
		'nameJSON',
		'previousOwnershipJSON',
		'recordJSON',
		'revisionLogJSON',
		'siteCategoryJSON',
		'themeJSON',
		'webLinkJSON',
		'ownershipJSON',
	]);

	static JS_TO_JSON_COLUMN_TRANSLATIONS: { [key: string]: string } =
		Object.freeze({
			names: 'nameJSON',
			historicalPatterns: 'historicalPatternJSON',
		});

	static encodeAndDenormalizeJSONColumns(object: PlainObject) {
		Object.keys(object).forEach((key) => {
			if (PlaceEdit.JS_TO_JSON_COLUMN_TRANSLATIONS[key]) {
				const encodedKey = PlaceEdit.JS_TO_JSON_COLUMN_TRANSLATIONS[key];
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
