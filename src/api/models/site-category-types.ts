import { GenericStringEnum } from './simple-types';

export const SITE_CATEGORY_TYPES: ReadonlyArray<GenericStringEnum> =
	Object.freeze([
		{ value: 'Architecture', text: 'Architecture' },
		{ value: 'FirstNation', text: 'First Nation' },
		{ value: 'Gravesite', text: 'Gravesite' },
		{ value: 'Industrial', text: 'Industrial' },
		{ value: 'Landscape', text: 'Landscape' },
	]);
