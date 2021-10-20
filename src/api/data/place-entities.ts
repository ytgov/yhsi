
export const PLACE_FIELDS = ["place.id", "primaryName", "yHSIId", "jurisdiction", "statuteId", "statute2Id",
    "recognitionDate", "ownerConsent", "category", "isPubliclyAccessible", "nTSMapSheet", "bordenNumber",
    "geocode", "hectareArea", "latitude", "longitude", "locationComment", "resourceType", "buildingSize",
    "conditionComment", "currentUseComment", "yHSPastUse", "cIHBNumber", "groupYHSI", "yGBuildingNumber",
    "yGReserveNumber", "fHBRONumber", "zoning", "townSiteMapNumber", "siteDistrictNumber", "planNumber",
    "block", "lot", "slideNegativeIndex", "otherCommunity", "otherLocality", "previousAddress", "yHSThemes",
    "rollNumber", "locationContext", "communityId", "lAGroup", "siteStatus", "floorCondition", "wallCondition",
    "doorCondition", "roofCondition", "coordinateDetermination", "physicalAddress", "physicalProvince",
    "physicalCountry", "physicalPostalCode", "mailingAddress", "mailingProvince", "mailingCountry",
    "mailingPostalCode", "showInRegister", "siteCategories", "designations", "contributingResources", "records"];

export const REGISTER_FIELDS = ["place.id", "primaryName", "yHSIId", "latitude", "longitude",
    "recognitionDate", "community.name as communityName", "designations"];

export class Place {
    id!: number;
    primaryName!: string;
    yHSIId!: string;
    jurisdiction!: number;
    statuteId!: number;
    statute2Id!: number;
    recognitionDate!: Date;
    ownerConsent!: number;
    category!: number;
    isPubliclyAccessible!: boolean;
    nTSMapSheet!: string;
    bordenNumber!: string;
    geocode!: string;
    hectareArea!: string;
    latitude!: string;
    longitude!: string;
    locationComment!: string;
    resourceType!: string;
    buildingSize!: string;
    conditionComment!: string;
    currentUseComment!: string;
    yHSPastUse!: string;
    cIHBNumber!: string;
    groupYHSI!: string;
    yGBuildingNumber!: string;
    yGReserveNumber!: string;
    fHBRONumber!: string;
    zoning!: string;
    townSiteMapNumber!: string;
    siteDistrictNumber!: string;
    planNumber!: string;
    block!: string;
    lot!: string;
    slideNegativeIndex!: string;
    otherCommunity!: string;
    otherLocality!: string;
    previousAddress!: string;
    yHSThemes!: string;
    rollNumber!: string;
    locationContext!: string;
    communityId!: number;
    lAGroup!: string;
    siteStatus!: number;
    floorCondition!: number;
    wallCondition!: number;
    doorCondition!: number;
    roofCondition!: number;
    coordinateDetermination!: number;
    physicalAddress!: string;
    physicalProvince!: string;
    physicalCountry!: string;
    physicalPostalCode!: string;
    mailingAddress!: string;
    mailingProvince!: string;
    mailingCountry!: string;
    mailingPostalCode!: string;
    showInRegister!: boolean;
    siteCategories!: string | string[];
    designations!: string;
    contributingResources!: string;
    records!: string;
}

export class Association {
    id!: number;
    placeId!: number;
    type!: number;
    type_name?: string;
    description!: string;
}

export class ConstructionPeriod {
    id!: number;
    placeId!: number;
    type!: number;
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

export class Dates {
    id!: number;
    placeId!: number;
    type!: number;
    fromDate!: string;
    toDate!: string;
    details!: string;
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

export class HistoricalPattern {
    id!: number;
    placeId!: number;
    comments!: string;
    historicalPatternType!: number;
}

export class Name {
    id!: number;
    placeId!: number;
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

export class PlaceEdit {
    id!: number;
    placeId!: number;
    editorUserId!: number;
    editDate!: Date;
    primaryName!: string;
    yHSIId!: string;
    jurisdiction!: number;
    statuteId!: number;
    statute2Id!: number;
    recognitionDate!: Date;
    ownerConsent!: number;
    category!: number;
    isPubliclyAccessible!: boolean;
    nTSMapSheet!: string;
    bordenNumber!: string;
    geocode!: string;
    hectareArea!: string;
    latitude!: string;
    longitude!: string;
    locationComment!: string;
    resourceType!: string;
    buildingSize!: string;
    conditionComment!: string;
    currentUseComment!: string;
    yHSPastUse!: string;
    cIHBNumber!: string;
    groupYHSI!: string;
    yGBuildingNumber!: string;
    yGReserveNumber!: string;
    fHBRONumber!: string;
    zoning!: string;
    yownSiteMapNumber!: string;
    siteDistrictNumber!: string;
    planNumber!: string;
    block!: string;
    lot!: string;
    slideNegativeIndex!: string;
    otherCommunity!: string;
    otherLocality!: string;
    previousAddress!: string;
    yHSThemes!: string;
    rollNumber!: string;
    locationContext!: string;
    communityId!: number;
    lAGroup!: string;
    siteStatus!: number;
    floorCondition!: number;
    wallCondition!: number;
    doorCondition!: number;
    roofCondition!: number;
    coordinateDetermination!: number;
    physicalAddress!: string;
    physicalProvince!: string;
    physicalCountry!: string;
    physicalPostalCode!: string;
    mailingAddress!: string;
    mailingProvince!: string;
    mailingCountry!: string;
    mailingPostalCode!: string;
    showInRegister!: boolean;
    siteCategories!: string;
    designations!: string;
    contributingResources!: string;
    records!: string;
    associationJSON!: string;
    constructionPeriodJSON!: string;
    contactJSON!: string;
    contributingResourceJSON!: string;
    datesJSON!: string;
    descriptionJSON!: string;
    firstNationAssociationJSON!: string;
    functionalUseJSON!: string;
    historicalPatternJSON!: string;
    nameJSON!: string;
    previousOwnershipJSON!: string;
    recordJSON!: string;
    revisionLogJSON!: string;
    siteCategoryJSON!: string;
    themeJSON!: string;
    webLinkJSON!: string;
    ownershipJSON!: string;
}
