import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema("Boat").createTable("Backup", (table) => {
    table.integer("UID")
    table.text("HistoryText")
    table.text("Reference")
  })
  await knex.schema.withSchema("Boat").createTable("Boat", (table) => {
    table.increments("Id", { primaryKey: false })
    table.datetime("ConstructionDate").defaultTo(null)
    table.datetime("ServiceStart").defaultTo(null)
    table.datetime("ServiceEnd").defaultTo(null)
    table.specificType("VesselType", "varchar(64)").defaultTo(null)
    table.specificType("CurrentLocation", "varchar(512)").defaultTo(null)
    table.specificType("Notes", "varchar(4096)").defaultTo(null)
    table.specificType("RegistrationNumber", "varchar(64)").defaultTo(null)
    table.specificType("Name", "varchar(64)").defaultTo(null)
    table.primary(["Id"], { constraintName: "PK__Boat__3214EC07E7E5761C" })
  })
  await knex.schema.withSchema("Boat").createTable("History", (table) => {
    table.integer("UID")
    table.text("HistoryText")
    table.text("Reference")
    table.increments("id", { primaryKey: false })
    table.primary(["id"], { constraintName: "PK__History__3213E83FAE790F4D" })
  })
  await knex.schema.withSchema("Boat").createTable("Owner", (table) => {
    table.increments("Id", { primaryKey: false })
    table.specificType("OwnerName", "varchar(64)").notNullable()
    table.primary(["Id"], { constraintName: "PK__Owner__3214EC07BD1B459E" })
  })
  await knex.schema.withSchema("Boat").createTable("Type", (table) => {
    table.increments("Id", { primaryKey: false })
    table.specificType("Type", "varchar(64)").notNullable()
    table.primary(["Id"], { constraintName: "PK__Type__3214EC0776BB85DB" })
  })
  await knex.schema.withSchema("Boat").createTable("BoatOwner", (table) => {
    table.integer("BoatID").notNullable()
    table.integer("OwnerID").notNullable()
    table.boolean("CurrentOwner").notNullable()
    table.primary(["BoatID", "OwnerID"], { constraintName: "PK__BoatOwne__8C9111E5F5E02C09" })
    table.foreign("BoatID", "BoatId_FK").references("Id").inTable("Boat.Boat")
    table.foreign("OwnerID", "OwnerId_FK").references("Id").inTable("Boat.Owner")
  })
  await knex.schema.withSchema("Boat").createTable("OwnerAlias", (table) => {
    table.increments("Id", { primaryKey: false })
    table.integer("OwnerId").notNullable()
    table.specificType("Alias", "varchar(64)").notNullable()
    table.primary(["Id"], { constraintName: "PK__OwnerAli__3214EC07654D6C6C" })
    table.foreign("OwnerId", "OwnerAlias_FK").references("Id").inTable("Boat.Owner")
  })
  await knex.schema.withSchema("Boat").createTable("OwnerHistory", (table) => {
    table.increments("Id", { primaryKey: false })
    table.integer("OwnerId").notNullable()
    table.specificType("HistoryText", "varchar(4096)").notNullable()
    table.specificType("Reference", "varchar(256)").notNullable()
    table.primary(["Id"], { constraintName: "PK__OwnerHis__3214EC07C47E9BC6" })
    table.foreign("OwnerId", "OwnerHistory_FK").references("Id").inTable("Boat.Owner")
  })
  await knex.schema.withSchema("Boat").createTable("PastNames", (table) => {
    table.increments("Id", { primaryKey: false })
    table.integer("BoatId").notNullable()
    table.specificType("BoatName", "varchar(64)").notNullable()
    table.primary(["Id"], { constraintName: "PK__PastName__3214EC07DD0D47D4" })
    table.foreign("BoatId", "BoadId_FK").references("Id").inTable("Boat.Boat")
  })
  await knex.schema.withSchema("Boat").createTable("Photo", (table) => {
    table.integer("BoatId").notNullable()
    table.specificType("Photo_RowID", "varchar(255)")
    table.increments("Id", { primaryKey: false })
    table.primary(["Id"], { constraintName: "PK__Photo__3214EC076ADE23BB" })
    table.foreign("BoatId", "BoatPhoto_FK").references("Id").inTable("Boat.Boat")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema("Boat").dropTable("Photo")
  await knex.schema.withSchema("Boat").dropTable("PastNames")
  await knex.schema.withSchema("Boat").dropTable("OwnerHistory")
  await knex.schema.withSchema("Boat").dropTable("OwnerAlias")
  await knex.schema.withSchema("Boat").dropTable("BoatOwner")
  await knex.schema.withSchema("Boat").dropTable("Type")
  await knex.schema.withSchema("Boat").dropTable("Owner")
  await knex.schema.withSchema("Boat").dropTable("History")
  await knex.schema.withSchema("Boat").dropTable("Boat")
  await knex.schema.withSchema("Boat").dropTable("Backup")
}
