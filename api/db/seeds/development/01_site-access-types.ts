import type { Knex } from "knex"

import { SiteAccesType } from "../../../models/site-access-type"

export async function seed(knex: Knex): Promise<void> {
  const types = [
    { id: SiteAccesType.MAP_SHEET, name: "Map sheet number" },
    { id: SiteAccesType.COMMUNITY, name: "Community" },
    { id: SiteAccesType.FIRST_NATION, name: "First Nation" },
    { id: SiteAccesType.ALL_SITES, name: "All Sites" },
  ]

  const existing = await knex("Security.SiteAccessType").pluck<number[]>("id")
  const missing = types.filter(({ id }) => !existing.includes(id))
  if (missing.length > 0) await knex("Security.SiteAccessType").insert(missing)
}
