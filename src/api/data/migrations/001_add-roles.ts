import knex, { Knex } from 'knex';

const NEW_ROLES = ["Airplane Crash Editor", "Boats Editor", "Places Editor", "Burials Editor", "People Editor", "YRHP Editor"]

exports.up = function (knex: Knex, Promise: any) {
    return knex("webpages_Roles").insert(NEW_ROLES.map(r => { return { RoleName: r } }));
};

exports.down = async function (knex: Knex, Promise: any) {
    let newRoles = await knex("webpages_Roles").whereIn("RoleName", NEW_ROLES)

    for (let role of newRoles) {
        await knex("webpages_UsersInRoles").where({ RoleId: role.RoleId }).delete();
    }

    knex("webpages_Roles").whereIn("RoleName", NEW_ROLES).delete()
};
