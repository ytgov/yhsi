import { GenericEnum } from './simple-types';

export const REVISION_LOG_TYPES: ReadonlyArray<GenericEnum> = Object.freeze([
	{ value: 1, text: 'Initial Recording' },
	{ value: 2, text: 'Monitoring Visit' },
	{ value: 3, text: 'Research' },
	{ value: 4, text: 'Designation Assessment' },
	{ value: 5, text: 'Record Update' },
]);
