import { GenericEnum } from './simple-types';

export const OWNER_CONSENT_TYPES: ReadonlyArray<GenericEnum> = Object.freeze([
	{ value: 0, text: 'None Selected' },
	{ value: 1, text: 'Consent' },
	{ value: 2, text: 'No Response' },
	{ value: 3, text: 'Objection' },
]);
