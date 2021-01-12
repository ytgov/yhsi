
export class Community {
    id!: number;
    name!: string;
}

export class FirstNation {
    id!: number;
    description!: string;
}

export class FunctionalType {
    id!: number;
    description!: string;
}

export class OriginalMedia {
    id!: number;
    type!: string;
}

export class PhotoOwner {
    id?: number;
    name!: string;
    email!: string;
    address!: string;
    telephone!: string;
    contactPerson!: string;
}

export class PhotoProject {
    id?: number;
    name!: string;
    permit!: string;
    year!: string;
    section!: string;
}

export class PlaceTheme {
    id!: number;
    category!: string;
    type!: string;
}

export class Statute {
    id!: number;
    recognitionAuthority!: string;
    recognitionType!: string;
    description!: string;
    allStatute!: string;
}
