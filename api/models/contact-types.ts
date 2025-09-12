import { GenericEnum } from './simple-types';

export const CONTACT_TYPES: ReadonlyArray<GenericEnum> = Object.freeze([
	{ value: 1, text: 'Owner' },
	{ value: 2, text: 'Administrator' },
	{ value: 3, text: 'Heritage Planner' },
	{ value: 4, text: 'Other' },
]);
