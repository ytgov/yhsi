import { toInteger } from 'lodash';

import { PlainObject, UserSiteAccess, SiteAccesType } from '.';

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
		this.create_date = attributes.create_date || attributes.createDate;
		this.email = attributes.email;
		this.expire_date = attributes.expire_date || attributes.expireDate;
		this.expire_date_display =
			attributes.expire_date_display || attributes.expireDateDisplay;
		this.first_name = attributes.first_name || attributes.firstName;
		this.last_login_date =
			attributes.last_login_date || attributes.lastLoginDate;
		this.last_login_date_display =
			attributes.last_login_date_display || attributes.lastLoginDateDisplay;
		this.last_name = attributes.last_name || attributes.lastName;
		this.role_list = attributes.role_list || attributes.roleList;
		this.roles = attributes.roles;
		this.site_access = attributes.site_access || attributes.siteAccess;
		this.status = attributes.status;
	}

	get createDate() {
		return this.create_date;
	}
	set createDate(value: Date) {
		this.create_date = value;
	}

	get expireDate(): Date | undefined {
		return this.expire_date;
	}
	set expireDate(value: Date | undefined) {
		this.expire_date = value;
	}

	get expireDateDisplay(): string | undefined {
		return this.expire_date_display;
	}
	set expireDateDisplay(value: string | undefined) {
		this.expire_date_display = value;
	}

	get firstName() {
		return this.first_name;
	}
	set firstName(value: string) {
		this.first_name = value;
	}

	get lastLoginDate(): Date | undefined {
		return this.last_login_date;
	}
	set lastLoginDate(value: Date | undefined) {
		this.last_login_date = value;
	}

	get lastLoginDateDisplay(): string | undefined {
		return this.last_login_date_display;
	}
	set lastLoginDateDisplay(value: string | undefined) {
		this.last_login_date_display = value;
	}

	get lastName() {
		return this.last_name;
	}
	set lastName(value: string) {
		this.last_name = value;
	}

	get roleList(): string[] {
		return this.roles?.split(',').map((role) => role.trim()) || [];
	}
	set roleList(value: string[]) {
		this.role_list = value;
		this.roles = value.join(',');
	}

	get siteAccess() {
		return this.site_access || [];
	}
	set siteAccess(value: UserSiteAccess[]) {
		this.site_access = value || [];
	}

	// helpers
	get permittedMapSheets(): string[] {
		return this.siteAccess
			.filter((a) => a.accessTypeId == SiteAccesType.MAP_SHEET)
			.map((a) => a.accessText.toString());
	}

	get permittedCommunityIds(): number[] {
		return this.siteAccess
			.filter((a) => a.accessTypeId == SiteAccesType.COMMUNITY)
			.map((a) => toInteger(a.accessText));
	}

	get permittedFirstNationsIds(): number[] {
		return this.siteAccess
			.filter((a) => a.accessTypeId == SiteAccesType.FIRST_NATION)
			.map((a) => toInteger(a.accessText));
	}

	get canAccessAllSites(): boolean {
		return (
			this.siteAccess.filter((a) => a.accessTypeId == SiteAccesType.ALL_SITES)
				.length > 0
		);
	}
}
