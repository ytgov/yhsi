import { PlainObject, UserSiteAccess } from '.';

export class User {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	create_date: Date;
	expire_date?: Date;
	last_login_date?: Date;
	status: string;
	roles: string;

	expire_date_display?: string;
	last_login_date_display?: string;
	role_list?: string[];
	site_access?: UserSiteAccess[];

	constructor(attributes: PlainObject) {
		this.id = attributes.id;
		this.create_date = attributes.create_date;
		this.email = attributes.email;
		this.expire_date = attributes.expire_date;
		this.expire_date_display = attributes.expire_date_display;
		this.first_name = attributes.first_name;
		this.last_login_date = attributes.last_login_date;
		this.last_login_date_display = attributes.last_login_date_display;
		this.last_name = attributes.last_name;
		this.role_list = attributes.role_list;
		this.roles = attributes.roles;
		this.site_access = attributes.site_access;
		this.status = attributes.status;
	}

	get createDate() {
		return this.create_date;
	}
	get expireDate() {
		return this.expire_date;
	}
	get expireDateDisplay() {
		return this.expire_date_display;
	}
	get firstName() {
		return this.first_name;
	}
	get lastLoginDate() {
		return this.last_login_date;
	}
	get lastLoginDateDisplay() {
		return this.last_login_date_display;
	}
	get lastName() {
		return this.last_name;
	}

	get roleList() {
		return this.role_list || [];
	}

	get siteAccess() {
		return this.site_access || [];
	}
}
