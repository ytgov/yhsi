export * from '../models/construction-period';
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

export const CONSTRUCTION_PERIODS = [
	{ value: 1, text: 'Pre 1895' },
	{ value: 2, text: 'From 1896 to 1905' },
	{ value: 3, text: 'From 1906 to 1939' },
	{ value: 4, text: 'From 1940 to 1965' },
	{ value: 5, text: 'Post 1965' },
];

export class Association {
	id!: number;
	placeId!: number;
	type!: number;
	type_name?: string;
	description!: string;
}

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

export class FirstNationAssociation {
	id!: number;
	placeId!: number;
	firstNationId!: number;
	firstNationAssociationType!: number;
	comments!: string;
}

export class FunctionalUse {
	id!: number;
	placeId!: number;
	functionalTypeId!: number;
	functionalUseType!: number;
	description!: string;
}

export class Ownership {
	id!: number;
	placeId!: number;
	ownershipType!: number;
	comments!: string;
}

export class PreviousOwnership {
	id!: number;
	placeId!: number;
	ownershipNumber!: string;
	ownershipName!: string;
	ownershipDate!: string;
}

export class RevisionLog {
	id!: number;
	placeId!: number;
	revisionLogType!: number;
	revisionDate!: Date;
	revisedBy!: string;
	details!: string;
}

export class Theme {
	id!: number;
	placeId!: number;
	placeThemeId!: number;
}

export class WebLink {
	id!: number;
	placeId!: number;
	type!: number;
	address!: string;
}
