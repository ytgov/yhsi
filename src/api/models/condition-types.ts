import { GenericEnum } from './simple-types';

export const CONDITION_TYPES: ReadonlyArray<GenericEnum> = Object.freeze([
	{ value: 0, text: 'Not Applicable' },
	{ value: 3, text: 'Poor' },
	{ value: 1, text: 'Fair' },
	{ value: 2, text: 'Good' },
]);
