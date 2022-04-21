import { PlainObject } from '.';

export class UserSiteAccess {
	id: number;
	user_id: number;
	access_type_id: number;
	access_text: string | number;

	access_type_name?: string;
	access_text_name?: string;

	constructor(attributes: PlainObject) {
		this.id = attributes.id;
		this.user_id = attributes.user_id || attributes.userId;
		this.access_type_id = attributes.access_type_id || attributes.accessTypeId;
		this.access_text = attributes.access_text || attributes.accessText;
		this.access_type_name =
			attributes.access_type_name || attributes.accessTypeName;
		this.access_text_name =
			attributes.access_text_name || attributes.accessTextName;
	}

	get userId(): number {
		return this.user_id;
	}
	set userId(value: number) {
		this.user_id = value;
	}

	get accessTypeId(): number {
		return this.access_type_id;
	}
	set accessTypeId(value: number) {
		this.access_type_id = value;
	}

	get accessText(): number | string {
		return this.access_text;
	}
	set accessText(value: number | string) {
		this.access_text = value;
	}

	get accessTypeName(): string {
		return this.access_type_name;
	}
	set accessTypeName(value: string) {
		this.access_type_name = value;
	}

	get accessTextName(): string {
		return this.access_text_name;
	}
	set accessTextName(value: string) {
		this.access_text_name = value;
	}
}
