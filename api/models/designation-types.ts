import { GenericStringEnum } from './simple-types'

export const DESIGNATION_TYPES: ReadonlyArray<GenericStringEnum> = Object.freeze([
	{ value: 'Federal', text: 'Federal' },
	{ value: 'Municipal', text: 'Municipal' },
	{ value: 'Territorial', text: 'Territorial' },
	{ value: 'World', text: 'World' },
	{ value: 'NotDesignated', text: 'Not Designated' },
]);
