import { GenericEnum } from './simple-types';

export const HISTORICAL_PATTERN_TYPES: ReadonlyArray<GenericEnum> =
	Object.freeze([
		{ value: 1, text: 'Political' },
		{ value: 2, text: 'Economic' },
		{ value: 3, text: 'Social' },
		{ value: 4, text: 'Geographic' },
	]);
