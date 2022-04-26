export * from './aircrash-service';
export * from './association-service';
export * from './boat-owner-service';
export * from './boat-service';
export * from './burial-service';
export * from './catalog-service';
export * from './construction-period-service';
export * from './contact-service';
export * from './date-service';
export * from './description-service';
export * from './first-nation-association-service';
export * from './functional-use-service';
export * from './historical-pattern-service';
export * from './name-service';
export * from './ownership-service';
export * from './people-service';
export * from './photo-batch-service';
export * from './photo-service';
export * from './place-edit-service';
export * from './place-service';
export * from './previous-ownership-service';
export * from './revision-log-service';
export * from './static-service';
export * from './statute-service';
export * from './theme-service';
export * from './user-service';
export * from './web-link-service';
export * from './ytplace-service';
export * from './interpretive-site-service';

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
