
export const YTPLACE_FIELDS = ["id", "name", "locationDesc", "latitude", "longitude", "mapSheet", "notes", "accuracy"];

export class YtPlace {
id!: number;
name!: string;
locationDesc!: string;
latitude!: number;
longitude!: number;
mapSheet!: string;
notes!: string;
accuracy!: string;
}

export class PlaceType {
    placeId!: number;
    placeTypeLookupId!: number;
}

export class PlaceTypeLookup {
    id!: number;
    placeType!: string;
}

export class FirstNationName {
    id!: number;
    placeId!: number;
    fnName!: string;
    fnLanguage!: string;
    fnDesription!: string;
}

export class AlternateName {
    id!: number;
    placeId!: number;
    alternateName!: string;
}

export class PlaceHistory {
    id!: number;
    placeId!: number;
    historyText!: string;
    reference!: string;
    restricted!: number;
}

export class PlacePhoto {
    id!: number;
    placeId!: number;
    photoRowId!: number;
}

export class FnAssociation {
    placeId!: number;
    firstNationId!: number;
    fnAssociationType!: number;
}
