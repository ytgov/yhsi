import { GenericStringEnum } from './simple-types';

export const CATEGORY_TYPES: ReadonlyArray<GenericStringEnum> = Object.freeze([
	{ value: 'NoneSelected', text: 'None Selected' },
	{ value: 'Building', text: 'Building' },
	{ value: 'District', text: 'District' },
	{ value: 'Place', text: 'Place' },
	{ value: 'Structure', text: 'Structure' },
]);
