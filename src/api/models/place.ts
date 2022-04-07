import { isString } from 'lodash';

import { HistoricalPattern } from './historical-pattern';
import { Name } from './name';

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
	historicalPatterns?: HistoricalPattern[];
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
	names?: Name[];
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
			object[column] = Place.encodeCommaDelimitedArray(object[column]);
		});

		return object;
	}
}
