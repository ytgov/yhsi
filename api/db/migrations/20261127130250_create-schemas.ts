import type { Knex } from "knex"

import assertEmptyDatabase from "@/db/assert-empty-database"

export async function up(knex: Knex): Promise<void> {
  await assertEmptyDatabase(knex)

  await knex.raw("CREATE SCHEMA [AirCrash]")
  await knex.raw("CREATE SCHEMA [Boat]")
  await knex.raw("CREATE SCHEMA [Burial]")
  await knex.raw("CREATE SCHEMA [InterpretiveSite]")
  await knex.raw("CREATE SCHEMA [Person]")
  await knex.raw("CREATE SCHEMA [Place]")
  await knex.raw("CREATE SCHEMA [Security]")
  await knex.raw("CREATE SCHEMA [YHIS]")
  await knex.raw("CREATE SCHEMA [YRHP]")
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("DROP SCHEMA [YRHP]")
  await knex.raw("DROP SCHEMA [YHIS]")
  await knex.raw("DROP SCHEMA [Security]")
  await knex.raw("DROP SCHEMA [Place]")
  await knex.raw("DROP SCHEMA [Person]")
  await knex.raw("DROP SCHEMA [InterpretiveSite]")
  await knex.raw("DROP SCHEMA [Burial]")
  await knex.raw("DROP SCHEMA [Boat]")
  await knex.raw("DROP SCHEMA [AirCrash]")
}
