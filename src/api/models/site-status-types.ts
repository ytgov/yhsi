import { GenericEnum } from './simple-types';

export const SITE_STATUS_TYPES: ReadonlyArray<GenericEnum> = Object.freeze([
	{ value: 1, text: 'Standing' },
	{ value: 2, text: 'Demolished' },
	{ value: 3, text: 'Burned' },
	{ value: 4, text: 'Moved' },
	{ value: 5, text: 'Dimantled' },
	{ value: 6, text: 'Reconstruction' },
]);
