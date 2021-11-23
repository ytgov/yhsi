
export const YTPLACE_FIELDS = ["place.id", "name", "locationDesc", "latitude", "longitude", "mapSheet", "notes"];

export class YtPlace {
id!: number;
name!: string;
locationDesc!: string;
latitude!: number;
longitude!: number;
mapSheet!: string;
notes!: string;
}

export class PlaceType {
    placeId!: number;
    placeTypeLookupId!: string;
}

export class PlaceTypeLookup {
    id!: number;
    placeType!: string;
}

export class FirstNationName {
    id!: number;
    placeid!: number;
    fnName!: string;
    fnLanguage!: string;
    fnDescription!: string;
}

export class AlternateName {
    id!: number;
    placeid!: number;
    alternateName!: string;
}

export class PlaceHistory {
    id!: number;
    placeid!: number;
    historyText!: string;
    reference!: string;
    restricted!: number;
}

export class PlacePhoto {
    id!: number;
    placeid!: number;
    photoRowId!: number;
}

export class FnAssociation {
    placeid!: number;
    firstNationId!: number;
    fnAssocationType!: string;
}
