import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
CREATE PROCEDURE [dbo].[GetAirCrash]

AS

    SELEct yacsinumber, crashdate, aircrafttype, aircraftregistration, nation, militarycivilian
         , crashlocation, remainsonsite, extentofremainsonsite, otherlocationsofremains, pilot, fatalities
         , descriptionofcrashevent, comments, significanceofaircraft, sources, photographs, inyukon, soulsonboard
         , injuries, accuracy, aircraftcaption, aircraftaftercrashcaption, location from AirCrash.AirCrash
`)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("DROP PROCEDURE [dbo].[GetAirCrash]")
}
