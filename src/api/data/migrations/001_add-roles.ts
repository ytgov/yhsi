import { Knex } from "knex";
import moment from "moment";

exports.up = async function (knex: Knex, Promise: any) {
    await knex.raw("CREATE SCHEMA [Security]");

    await knex.schema.createTable("Security.User", function (t: Knex.CreateTableBuilder) {
        t.increments("id");
        t.string("email", 200).notNullable().unique();
        t.string("first_name", 100).notNullable();
        t.string("last_name", 100).notNullable();
        t.specificType("create_date", "datetime2(0)").notNullable().defaultTo(knex.raw("GETDATE()"), { constraintName: "User_create_date_default" });
        t.specificType("expire_date", "date").nullable();
        t.specificType("last_login_date", "datetime2(0)").nullable();
        t.string("roles", 1000).nullable();
        t.string("status", 50).notNullable();
    });

    await knex.schema.createTable("Security.SiteAccessType", function (t: Knex.CreateTableBuilder) {
        t.integer("id").primary({ constraintName: "pk_SiteAccessType" });
        t.string("name", 100).notNullable().unique();
    });

    await knex.schema.createTable("Security.UserSiteAccess", function (t: Knex.CreateTableBuilder) {
        t.increments("id");
        t.integer("user_id").notNullable();
        t.foreign("user_id").references("id").inTable("Security.User");
        t.integer("access_type_id").notNullable();
        t.foreign("access_type_id").references("id").inTable("Security.SiteAccessType");
        t.string("access_text", 150).notNullable();
    });

    // load in the data from the old tables

    await knex("Security.SiteAccessType").insert([
        { id: 1, name: "Map Sheet" },
        { id: 2, name: "Community" },
        { id: 3, name: "First Nation" }
    ]);

    let existingUsers = await knex.raw("select m.UserId, m.CreateDate, m.IsConfirmed, i.Email, i.FirstName, i.LastName, i.LastLogin, i.Status, u.ExpirationDate, u.id as HSUserId from webpages_Membership m  inner join Ibbit_User i ON m.UserId = i.UserId inner join HSUser u on i.UserId = u.UserId");

    for (let u of existingUsers) {
        let roles = await knex("webpages_UsersInRoles").join("webpages_Roles", "webpages_UsersInRoles.RoleId", "webpages_Roles.RoleId").where({ UserId: u.UserId }).select("RoleName");
        let allRoles = roles.map(r => r.RoleName);
        let isExpired = moment().isAfter(moment(u.ExpirationDate));
        let isCurrent = allRoles.indexOf("BackendUser") >= 0;
        let roleList = allRoles.filter(r => r != "BackendUser").join(", ");

        let newUser = await knex("Security.User").insert({
            email: u.Email.toLowerCase(),
            first_name: u.FirstName,
            last_name: u.LastName,
            create_date: u.CreateDate,
            expire_date: u.ExpirationDate,
            last_login_date: u.LastLogin,
            roles: roleList,
            status: isExpired ? "Expired" : !isCurrent ? "Inactive" : "Active"
        }).returning("*");

        let newUserId = newUser[0].id;

        let access = await knex("HSUserAccess").where({ UserId: u.HSUserId });

        for (let a of access) {
            await knex("Security.UserSiteAccess").insert({ user_id: newUserId, access_type_id: a.AccessType, access_text: a.AccessText });
        }
    }
};

exports.down = async function (knex: Knex, Promise: any) {
    await knex.schema.dropTable("Security.UserSiteAccess")
    await knex.schema.dropTable("Security.SiteAccessType")
    await knex.schema.dropTable("Security.User")

    return knex.raw("DROP SCHEMA [Security]");
};
