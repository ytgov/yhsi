import knex, { Knex } from 'knex';

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
				.catch((err) => {
					console.error(err);
					resolve(false);
				});
		});
	}

	async getAll(): Promise<any[]> {
		let list = await this.knex("Ibbit_User").join("HSUser", "HSUser.UserId", "Ibbit_User.UserId").select("Ibbit_User.*", "HSUser.ExpirationDate", "HSUser.Id as hsid")

		for (let user of list) {
			user.SiteAccess = await this.knex("HSUserAccess").where({ UserId: user.hsid });
			user.Roles = (await this.getRolesForUser(user.UserId)).map(r => r.RoleId);		
		}

		return list;
	}

	async getOne(filter: any): Promise<any> {
		let user = await this.knex("Ibbit_User").join("HSUser", "HSUser.UserId", "Ibbit_User.UserId").select("Ibbit_User.*", "HSUser.ExpirationDate", "HSUser.Id as hsid").where(filter).first();
		user.Roles = (await this.getRolesForUser(user.UserId)).map(r => r.RoleId);
		user.SiteAccess = await this.knex("HSUserAccess").where({ UserId: user.hsid }).orderBy("AccessType").orderBy("AccessText");

		let allCommunities = await this.knex("Community");
		let allFirstNations = await this.knex("FirstNation")

		for (let access of user.SiteAccess) {
			switch (access.AccessType) {
				case 1:
					access.AccessTypeDescription = "Map sheet number";
					access.AccessTextDescription = access.AccessText;
					break;
				case 2:
					access.AccessTypeDescription = "Community";
					let cm = allCommunities.filter(c => c.Id == access.AccessText)
					if (cm.length > 0)
						access.AccessTextDescription = cm[0].Name;
					break;
				case 3:
					access.AccessTypeDescription = "First Nation";
					access.AccessText = parseInt(access.AccessText);
					let fn = allFirstNations.filter(c => c.Id == access.AccessText)
					if (fn.length > 0)
						access.AccessTextDescription = fn[0].Description;
					break;
			}
		}

		return user;
	}

	async update(id: any, value: any) {
		await this.knex("HSUser").where({ UserId: id })
			.update({ ExpirationDate: value.ExpirationDate })
		delete value.ExpirationDate;

		let newRoles = value.Roles.map((r: any) => { return { "UserId": id, "RoleId": r } });

		await this.knex("webpages_UsersInRoles").where({ UserId: id }).delete();
		await this.knex("webpages_UsersInRoles").insert(newRoles)

		delete value.Roles;

		return this.knex("Ibbit_User").where({ UserId: id }).update(value);
	}

	createAccess(value: any): Promise<any> {
		return this.knex("HSUserAccess").insert(value);
	}

	updateAccess(id: any, value: any): Promise<any> {
		return this.knex("HSUserAccess").where({ id }).update(value);
	}

	deleteAccess(id: any): Promise<any> {
		return this.knex("HSUserAccess").where({ id }).delete()
	}

	getRolesForUser(id: any): Promise<any[]> {
		return this.knex("webpages_UsersInRoles").join("webpages_Roles", "webpages_UsersInRoles.RoleId", "webpages_Roles.RoleId")
			.select("webpages_Roles.*").where({ UserId: id }).distinct();
	}

	getAllRoles(): Promise<any[]> {
		return this.knex("webpages_Roles");
	}
}
