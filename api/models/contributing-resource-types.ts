import { GenericStringEnum } from './simple-types';

export const CONTRIBUTING_RESOURCE_TYPES: ReadonlyArray<GenericStringEnum> =
	Object.freeze([
		{ value: 'Archaeological', text: 'Archaeological' },
		{ value: 'Building', text: 'Building' },
		{ value: 'Collection', text: 'Collection' },
		{ value: 'Landscapes', text: 'Landscapes' },
		{ value: 'Structure', text: 'Structure' },
	]);
