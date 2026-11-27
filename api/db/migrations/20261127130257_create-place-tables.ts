import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema("Place").createTable("Place", (table) => {
    table.specificType("Name", "varchar(255)").notNullable()
    table.specificType("LocationDesc", "varchar(512)")
    table.specificType("Latitude", "real")
    table.specificType("Longitude", "real")
    table.specificType("MapSheet", "varchar(25)")
    table.specificType("Notes", "varchar(512)")
    table.specificType("Accuracy", "varchar(30)")
    table.increments("Id", { primaryKey: false })
    table.primary(["Id"], { constraintName: "PK__Place__3214EC0728EFBE21" })
  })
  await knex.schema.withSchema("Place").createTable("PlaceTypeLookup", (table) => {
    table.specificType("PlaceType", "varchar(140)")
    table.increments("Id", { primaryKey: false })
    table.primary(["Id"], { constraintName: "PK__PlaceTyp__3214EC0728DB345B" })
  })
  await knex.schema.withSchema("Place").createTable("AlternateName", (table) => {
    table.integer("PlaceID").notNullable()
    table.specificType("AlternateName", "varchar(255)").notNullable()
    table.increments("Id", { primaryKey: false })
    table.primary(["Id"], { constraintName: "PK__Alternat__3214EC0722C106A5" })
    table
      .foreign("PlaceID", "FK__Alternate__Place__269AB60B")
      .references("Id")
      .inTable("Place.Place")
    table
      .foreign("PlaceID", "FK__Alternate__Place__2CDD9F46")
      .references("Id")
      .inTable("Place.Place")
  })
  await knex.schema.withSchema("Place").createTable("FirstNationName", (table) => {
    table.integer("PlaceId").notNullable()
    table.specificType("FNName", "varchar(64)").notNullable()
    table.specificType("FNLanguage", "varchar(128)").defaultTo(null)
    table.specificType("FNDesription", "varchar(255)")
    table.increments("Id", { primaryKey: false })
    table.primary(["Id"], { constraintName: "PK__FirstNat__3214EC076302D5B8" })
    table
      .foreign("PlaceId", "FK__FirstNati__Place__278EDA44")
      .references("Id")
      .inTable("Place.Place")
    table
      .foreign("PlaceId", "FK__FirstNati__Place__2DD1C37F")
      .references("Id")
      .inTable("Place.Place")
  })
  await knex.schema.withSchema("Place").createTable("FNAssociation", (table) => {
    table.integer("PlaceId").notNullable()
    table.integer("FirstNationId").notNullable()
    table.integer("FNAssociationType")
    table
      .foreign("PlaceId", "FK__FNAssocia__Place__2882FE7D")
      .references("Id")
      .inTable("Place.Place")
    table
      .foreign("PlaceId", "FK__FNAssocia__Place__2EC5E7B8")
      .references("Id")
      .inTable("Place.Place")
  })
  await knex.schema.withSchema("Place").createTable("Photo", (table) => {
    table.integer("PlaceID")
    table.string("Photo_RowID", 255).notNullable()
    table.increments("Id", { primaryKey: false })
    table.primary(["Id"], { constraintName: "PK__Photo__3214EC07A1A629AD" })
    table.foreign("PlaceID", "FK__Photo__PlaceID__25A691D2").references("Id").inTable("Place.Place")
    table.foreign("PlaceID", "FK__Photo__PlaceID__2BE97B0D").references("Id").inTable("Place.Place")
  })
  await knex.schema.withSchema("Place").createTable("PlaceHistory", (table) => {
    table.integer("PlaceId").notNullable()
    table.specificType("HistoryText", "varchar(max)").notNullable()
    table.specificType("Reference", "varchar(2048)").defaultTo(null)
    table.integer("Restricted")
    table.increments("Id", { primaryKey: false })
    table.primary(["Id"], { constraintName: "PK__PlaceHis__3214EC07C4DEAE17" })
    table
      .foreign("PlaceId", "FK__PlaceHist__Place__297722B6")
      .references("Id")
      .inTable("Place.Place")
    table
      .foreign("PlaceId", "FK__PlaceHist__Place__2FBA0BF1")
      .references("Id")
      .inTable("Place.Place")
  })
  await knex.schema.withSchema("Place").createTable("PlaceType", (table) => {
    table.integer("PlaceId").notNullable()
    table.integer("PlaceTypeLookupId")
    table
      .foreign("PlaceId", "FK__PlaceType__Place__2A6B46EF")
      .references("Id")
      .inTable("Place.Place")
    table
      .foreign("PlaceTypeLookupId", "FK__PlaceType__Place__2AF556D4")
      .references("Id")
      .inTable("Place.PlaceTypeLookup")
    table
      .foreign("PlaceId", "FK__PlaceType__Place__30AE302A")
      .references("Id")
      .inTable("Place.Place")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema("Place").dropTable("PlaceType")
  await knex.schema.withSchema("Place").dropTable("PlaceHistory")
  await knex.schema.withSchema("Place").dropTable("Photo")
  await knex.schema.withSchema("Place").dropTable("FNAssociation")
  await knex.schema.withSchema("Place").dropTable("FirstNationName")
  await knex.schema.withSchema("Place").dropTable("AlternateName")
  await knex.schema.withSchema("Place").dropTable("PlaceTypeLookup")
  await knex.schema.withSchema("Place").dropTable("Place")
}
