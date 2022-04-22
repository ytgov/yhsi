export * from '../models/date';
export * from '../models/historical-pattern';
export * from '../models/name';
export * from '../models/place';
export * from '../models/place-edit';

export const PLACE_FIELDS = [
	'place.id',
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
	'townSiteMapNumber',
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
];

export const REGISTER_FIELDS = [
	'place.id',
	'primaryName',
	'yHSIId',
	'latitude',
	'longitude',
	'recognitionDate',
	'community.name as communityName',
	'designations',
];

export class Contact {
	id!: number;
	placeId!: number;
	firstName!: string;
	lastName!: string;
	phoneNumber!: string;
	email!: string;
	mailingAddress!: string;
	description!: string;
	contactType!: number;
}

export class Description {
	id!: number;
	placeId!: number;
	descriptionText!: string;
	type!: number;
}

export class WebLink {
	id!: number;
	placeId!: number;
	type!: number;
	address!: string;
}
