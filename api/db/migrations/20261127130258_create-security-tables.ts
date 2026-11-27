import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema("Security").createTable("SiteAccessType", (table) => {
    table.integer("id").notNullable()
    table.string("name", 100).notNullable()
    table.primary(["id"], { constraintName: "pk_SiteAccessType" })
  })
  await knex.schema.withSchema("Security").createTable("User", (table) => {
    table.increments("id", { primaryKey: false })
    table.string("email", 200).notNullable()
    table.string("first_name", 100).notNullable()
    table.string("last_name", 100).notNullable()
    table.specificType("create_date", "datetime2(0)").notNullable().defaultTo(knex.raw("getdate()"))
    table.date("expire_date")
    table.specificType("last_login_date", "datetime2(0)")
    table.string("roles", 1000)
    table.string("status", 50).notNullable()
    table.primary(["id"], { constraintName: "PK__User__3213E83F4B561AA5" })
  })
  await knex.schema.withSchema("Security").createTable("UserSiteAccess", (table) => {
    table.increments("id", { primaryKey: false })
    table.integer("user_id").notNullable()
    table.integer("access_type_id").notNullable()
    table.string("access_text", 150).notNullable()
    table.primary(["id"], { constraintName: "PK__UserSite__3213E83F01A4ED1C" })
    table
      .foreign("access_type_id", "security_usersiteaccess_access_type_id_foreign")
      .references("id")
      .inTable("Security.SiteAccessType")
    table
      .foreign("user_id", "security_usersiteaccess_user_id_foreign")
      .references("id")
      .inTable("Security.User")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema("Security").dropTable("UserSiteAccess")
  await knex.schema.withSchema("Security").dropTable("User")
  await knex.schema.withSchema("Security").dropTable("SiteAccessType")
}
