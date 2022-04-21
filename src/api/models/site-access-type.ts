import { PlainObject } from '.';

export class SiteAccesType {
	id: number;
	name: string;

	constructor(attributes: PlainObject) {
		this.id = attributes.id;
		this.name = attributes.name;
	}

	static get MAP_SHEET(): number {
		return 1;
	}
	static get COMMUNITY(): number {
		return 2;
	}
	static get FIRST_NATION(): number {
		return 3;
	}
}
