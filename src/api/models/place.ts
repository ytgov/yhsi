export interface PlaceUpdate {
	// can not update Id or YHSIId
	block?: string;
	bordenNumber?: string;
	buildingSize?: string;
	category?: number;
	cIHBNumber?: string;
	communityId?: number;
	conditionComment?: string;
	contributingResources?: string | string[];
	coordinateDetermination?: number;
	currentUseComment?: string;
	designations?: string | string[];
	doorCondition?: number;
	fHBRONumber?: string;
	floorCondition?: number;
	geocode?: string;
	groupYHSI?: string;
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
	records?: string | string[];
	resourceType?: string;
	rollNumber?: string;
	roofCondition?: number;
	showInRegister?: boolean;
	siteCategories?: string | string[];
	siteDistrictNumber?: string;
	siteStatus?: number;
	slideNegativeIndex?: string;
	statute2Id?: number;
	statuteId?: number;
	townSiteMapNumber?: string;
	wallCondition?: number;
	yGBuildingNumber?: string;
	yGReserveNumber?: string;
	yHSPastUse?: string;
	yHSThemes?: string;
	zoning?: string;
}

export function decodeCommaDelimitedArray(
	value: null | string | string[]
): string[] {
	if (value === null || value === '') return [];
	if (Array.isArray(value)) return value;

	return value.split(',');
}

export function encodeCommaDelimitedArray(value: string[]): string | null {
	if (value.length === 0) return null;

	return value.join(',');
}
