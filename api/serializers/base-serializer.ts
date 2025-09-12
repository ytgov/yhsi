import { pick } from 'lodash';

import { PlainObject } from '../models';

interface SerializerFunction<Type> {
	(model: Type): any | undefined;
}

export default abstract class BaseSerializer<Type> {
	model: Type;

	constructor(model: Type) {
		this.model = model;
	}

	fields(fields: string[]): PlainObject {
		return pick(this.model, fields);
	}

	field(field: string, func: SerializerFunction<Type>): PlainObject {
		const value = func(this.model);
		if (value === undefined) return {};

		return { [field]: value };
	}
}
