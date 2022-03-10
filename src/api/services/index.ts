
export * from "./photo-service";
export * from "./place-service";
export * from "./static-service";
export * from "./user-service";
export * from "./ytplace-service";
export * from "./burial-service";
export * from "./boat-service";
export * from "./aircrash-service";
export interface QueryStatement {
    field: string;
    operator: string;
    value: any;
}

export interface SortStatement {
    field: string;
    direction: SortDirection;
}

export enum SortDirection {
    ASCENDING = "asc",
    DESCENDING = "desc"
}
