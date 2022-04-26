import { GenericEnum } from './simple-types';

export const ASSOCIATION_TYPES: ReadonlyArray<GenericEnum> = Object.freeze([
	{ value: 1, text: 'Event' },
	{ value: 2, text: 'Person' },
	{ value: 3, text: 'Organization' },
	{ value: 4, text: 'Architect Designer' },
	{ value: 5, text: 'Builder' },
]);
