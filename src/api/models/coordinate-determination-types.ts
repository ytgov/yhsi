import { GenericEnum } from './simple-types';

export const COORDINATE_DETERMINATION_TYPES: ReadonlyArray<GenericEnum> =
	Object.freeze([
		{ value: 4, text: 'Digital Maps' },
		{ value: 5, text: 'Geocoding' },
		{ value: 1, text: 'GPS' },
		{ value: 2, text: 'Paper Maps' },
		{ value: 3, text: 'Unknown' },
	]);
