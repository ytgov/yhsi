import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema("YHIS").createTable("MapSheetLookup", (table) => {
    table.integer("Id").notNullable()
    table.string("Map50k", 8).notNullable()
    table.string("Map250k", 8).notNullable()
    table.primary(["Id"], { constraintName: "PK__MapSheet__3214EC0768988A65" })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema("YHIS").dropTable("MapSheetLookup")
}
