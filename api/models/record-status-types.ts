import { GenericEnum } from './simple-types';

export const RECORD_STATUS_TYPES: ReadonlyArray<GenericEnum> = Object.freeze([
	{ value: 1, text: 'Active' },
	{ value: 2, text: 'Archived' },
]);
