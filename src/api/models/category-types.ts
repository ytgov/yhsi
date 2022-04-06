import { GenericEnum } from './simple-types';

export const CATEGORY_TYPES: ReadonlyArray<GenericEnum> = Object.freeze([
	{ value: 0, text: 'None Selected' },
	{ value: 1, text: 'Building' },
	{ value: 2, text: 'District' },
	{ value: 3, text: 'Place' },
	{ value: 4, text: 'Structure' },
]);
