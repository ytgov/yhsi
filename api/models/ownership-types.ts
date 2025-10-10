import { GenericEnum } from './simple-types';

export const OWNERSHIP_TYPES: ReadonlyArray<GenericEnum> = Object.freeze([
	{ value: 1, text: 'Private' },
	{ value: 2, text: 'Public Local' },
	{ value: 3, text: 'Public Territorial' },
	{ value: 4, text: 'Settlement Lands' },
	{ value: 5, text: 'Public Federal' },
	{ value: 6, text: 'Not For Profit' },
	{ value: 7, text: 'Crown' },
	{ value: 8, text: 'Unknown' },
	{ value: 17, text: 'Gov Yukon' },
	{ value: 18, text: 'First Nations Reserve' },
	{ value: 19, text: 'Aboriginal Public Lands' },
]);
