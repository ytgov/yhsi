import knex, { Knex } from "knex";
import { User } from "../models";

export class UserService {
	private knex: Knex;

	constructor(config: Knex.Config<any>) {
		this.knex = knex(config);
	}

	isConnected(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.knex
				.raw("SELECT 'Connected' as [working]")
				.then((data: Array<any>) => {
					if (data && data.length == 1) {
						resolve(data[0].working === 'Connected');
					}

					resolve(false);
				})
				.catch((err: any) => {
					console.error(err);
					resolve(false);
				});
		});
	}

	async getByEmail(email: string): Promise<User | undefined> {
		let user = await this.knex("Security.User").where({ email }).first();

		if (user)
			return this.loadDetails(user);

		return undefined;
	}

	async getById(id: number): Promise<User | undefined> {
		let user = await this.knex("Security.User").where({ id }).first();

		if (user)
			return this.loadDetails(user);

		return undefined;
	}

	async getAll(): Promise<User[]> {
		let list = await this.knex("Security.User");

		for (let user of list) {
			await this.loadDetails(user);
		}

		return list;
	}

	async loadDetails(user: User): Promise<User> {
		if (user.roles)
			user.role_list = user.roles.split(", ");
		else
			user.role_list = [];

		user.site_access = await this.knex("Security.UserSiteAccess").where({ user_id: user.id }).orderBy("access_type_id").orderBy("access_text");

		let allCommunities = await this.knex("Community");
		let allFirstNations = await this.knex("FirstNation")

		for (let access of user.site_access) {
			switch (access.access_type_id) {
				case 1:
					access.access_type_name = "Map sheet number";
					access.access_text_name = access.access_text.toString();
					break;
				case 2:
					access.access_type_name = "Community";
					access.access_text = parseInt(access.access_text.toString());
					let cm = allCommunities.filter((c: any) => c.Id == access.access_text)
					if (cm.length > 0)
						access.access_text_name = cm[0].Name;
					break;
				case 3:
					access.access_type_name = "First Nation";
					access.access_text = parseInt(access.access_text.toString());
					let fn = allFirstNations.filter((c: any) => c.Id == access.access_text)
					if (fn.length > 0)
						access.access_text_name = fn[0].Description;
					break;
			}
		}

		return user;
	}

	async update(id: any, value: any) {
		if (value.role_list)
			value.roles = value.role_list.join(", ");
		else
			value.roles = "";

		delete value.role_list;
		await this.knex("Security.User").where({ id }).update(value);
	}

	async create(email: string, first_name: string, last_name: string): Promise<User[]> {
		email = email.toLocaleLowerCase();
		console.log("-- Creating User account for " + email);
		return this.knex("Security.User").insert({ email, first_name, last_name, last_login_date: new Date(), status: "Pending" }).returning("*")
	}

	async updateLoginDate(user: User): Promise<any> {
		return this.knex("Security.User").where({ id: user.id }).update({ last_login_date: new Date() });
	}

	createAccess(value: any): Promise<any> {
		return this.knex("Security.UserSiteAccess").insert(value);
	}

	updateAccess(id: any, value: any): Promise<any> {
		return this.knex("Security.UserSiteAccess").where({ id }).update(value);
	}

	deleteAccess(id: any): Promise<any> {
		return this.knex("Security.UserSiteAccess").where({ id }).delete()
	}
}
