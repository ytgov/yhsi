
export * from "./photo-service";
export * from "./place-service";
export * from "./static-service";
export * from "./user-service";
export * from "./ytplace-service";
export * from "./burial-service";
export * from "./boat-service";
export * from "./aircrash-service";
export * from "./photo-batch-service";
export * from "./boat-owner-service";
export * from "./people-service";
<<<<<<< HEAD
export * from "./catalog-service";
=======

>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
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
	ASCENDING = 'asc',
	DESCENDING = 'desc',
}
<<<<<<< HEAD
=======

export function buildDatabaseSort(
	sortBy: Array<string>,
	sortDesc: Array<boolean>
): Array<SortStatement> {
	return sortBy.map((field: string, index: number) => ({
		field,
		direction: sortDesc[index]
			? SortDirection.ASCENDING
			: SortDirection.DESCENDING,
	}));
}
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
