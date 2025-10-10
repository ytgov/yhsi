import { GenericEnum } from './simple-types';

export const CONSTRUCTION_PERIOD_TYPES: ReadonlyArray<GenericEnum> =
	Object.freeze([
		{ value: 1, text: 'Pre 1895' },
		{ value: 2, text: 'From 1896 to 1905' },
		{ value: 3, text: 'From 1906 to 1939' },
		{ value: 4, text: 'From 1940 to 1965' },
		{ value: 5, text: 'Post 1965' },
	]);
