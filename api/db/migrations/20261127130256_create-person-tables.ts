import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema("Person").createTable("History", (table) => {
    table.increments("PersonHistID", { primaryKey: false })
    table.integer("PersonID")
    table.integer("SeqID").notNullable()
    table.text("HistoryText")
    table.specificType("Reference", "varchar(1024)")
    table.integer("Restricted")
    table.primary(["PersonHistID"], { constraintName: "PK__HistoryN__BFE776F33EAFABEF" })
  })
  await knex.schema.withSchema("Person").createTable("Person", (table) => {
    table.increments("PersonID", { primaryKey: false })
    table.specificType("Surname", "varchar(256)")
    table.specificType("GivenName", "varchar(256)")
    table.integer("BirthYear")
    table.specificType("BirthAccuracy", "varchar(8)")
    table.integer("DeathYear")
    table.specificType("DeathAccuracy", "varchar(8)")
    table.specificType("Notes", "text").defaultTo(null)
    table.primary(["PersonID"], { constraintName: "PK__PersonTe__AA2FFB85B6E5CB31" })
  })
  await knex.schema.withSchema("Person").createTable("Photo", (table) => {
    table.integer("PersonID").notNullable()
    table.specificType("PhotoID", "varchar(255)")
    table
      .foreign("PersonID", "FK__Photo__PersonID__37C5420D")
      .references("PersonID")
      .inTable("Person.Person")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema("Person").dropTable("Photo")
  await knex.schema.withSchema("Person").dropTable("Person")
  await knex.schema.withSchema("Person").dropTable("History")
}
