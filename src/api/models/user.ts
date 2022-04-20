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
		this.email = attributes.email;
		this.first_name = attributes.first_name;
		this.last_name = attributes.last_name;
		this.create_date = attributes.create_date;
		this.expire_date = attributes.expire_date;
		this.last_login_date = attributes.last_login_date;
		this.status = attributes.status;
		this.roles = attributes.roles;
		this.expire_date_display = attributes.expire_date_display;
		this.last_login_date_display = attributes.last_login_date_display;
		this.role_list = attributes.role_list;
		this.site_access = attributes.site_access;
	}
}
