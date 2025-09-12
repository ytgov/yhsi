import { isString, pick } from 'lodash';

import {
	HistoricalPattern,
	FirstNationAssociation,
	Name,
	PlainObject,
} from '.';

export class Place {
	id?: number;
	block?: string;
	bordenNumber?: string;
	buildingSize?: string;
	category?: number;
	cIHBNumber?: string;
	communityId?: number;
	conditionComment?: string;
	contributingResources?: string | string[] | null;
	coordinateDetermination?: number;
	currentUseComment?: string;
	designations?: string | string[] | null;
	doorCondition?: number;
	fHBRONumber?: string;
	floorCondition?: number;
	geocode?: string;
	groupYHSI?: string;
	hasPendingChanges?: boolean;
	hectareArea?: string;
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
	nTSMapSheet?: string;
	otherCommunity?: string;
	otherLocality?: string;
	ownerConsent?: number;
	physicalAddress?: string;
	physicalCountry?: string;
	physicalPostalCode?: string;
	physicalProvince?: string;
	planNumber?: string;
	previousAddress?: string;
	primaryName?: string;
	recognitionDate?: Date;
	recognitionDateDisplay?: string;
	records?: string | string[] | null;
	resourceType?: string;
	rollNumber?: string;
	roofCondition?: number;
	showInRegister?: boolean;
	siteCategories?: string | string[] | null;
	siteDistrictNumber?: string;
	siteStatus?: number;
	slideNegativeIndex?: string;
	statute2Id?: number;
	statuteId?: number;
	townSiteMapNumber?: string;
	wallCondition?: number;
	yGBuildingNumber?: string;
	yGReserveNumber?: string;
	yHSIId?: string;
	yHSPastUse?: string;
	yHSThemes?: string;
	zoning?: string;

	// associations
	firstNationAssociations?: FirstNationAssociation[];
	historicalPatterns?: HistoricalPattern[];
	names?: Name[];

	static FIELDS: ReadonlyArray<string> = Object.freeze([
		'id',
		'block',
		'bordenNumber',
		'buildingSize',
		'category',
		'cIHBNumber',
		'communityId',
		'conditionComment',
		'contributingResources',
		'coordinateDetermination',
		'currentUseComment',
		'designations',
		'doorCondition',
		'fHBRONumber',
		'floorCondition',
		'geocode',
		'groupYHSI',
		'hectareArea',
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
		'nTSMapSheet',
		'otherCommunity',
		'otherLocality',
		'ownerConsent',
		'physicalAddress',
		'physicalCountry',
		'physicalPostalCode',
		'physicalProvince',
		'planNumber',
		'previousAddress',
		'primaryName',
		'recognitionDate',
		'records',
		'resourceType',
		'rollNumber',
		'roofCondition',
		'showInRegister',
		'siteCategories',
		'siteDistrictNumber',
		'siteStatus',
		'slideNegativeIndex',
		'statute2Id',
		'statuteId',
		'townSiteMapNumber',
		'wallCondition',
		'yGBuildingNumber',
		'yGReserveNumber',
		'yHSIId',
		'yHSPastUse',
		'yHSThemes',
		'zoning',
	]);

	static COMMA_DELIMITED_ARRAY_COLUMNS: ReadonlyArray<string> = Object.freeze([
		'contributingResources',
		'designations',
		'records',
		'siteCategories',
	]);

	static encodeCommaDelimitedArray(
		value: undefined | null | string | string[]
	): string | null {
		if (
			value === undefined ||
			value === null ||
			value === '' ||
			value.length === 0
		)
			return null;
		if (isString(value)) return value;

		return value.join(',');
	}

	static decodeCommaDelimitedArray(
		value: undefined | null | string | string[]
	): string[] {
		if (value === undefined || value === null || value === '') return [];
		if (Array.isArray(value)) return value;

		return value.split(',');
	}

	static encodeCommaDelimitedArrayColumns(object: PlainObject) {
		Place.COMMA_DELIMITED_ARRAY_COLUMNS.forEach((column) => {
			if (!object.hasOwnProperty(column)) return;

			object[column] = Place.encodeCommaDelimitedArray(object[column]);
		});

		return object;
	}

	static decodeCommaDelimitedArrayColumns(object: PlainObject) {
		if (!object) return object;

		Place.COMMA_DELIMITED_ARRAY_COLUMNS.forEach((column) => {
			if (!object.hasOwnProperty(column)) return;

			object[column] = Place.decodeCommaDelimitedArray(object[column]);
		});

		return object;
	}

	static stripOutNonColumnAttributes(object: PlainObject) {
		return pick(object, Place.FIELDS);
	}
}
