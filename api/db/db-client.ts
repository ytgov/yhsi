import knex from "knex"

import { DB_CONFIG, NODE_ENV } from "@/config"

const db = knex(DB_CONFIG)

// TODO: double check this is something we want in production.
db.on("query", (query) => {
  if (NODE_ENV === "production") {
    console.log(`Executing: ${query.sql}`)
  } else {
    const safeBindings = (query.bindings || []).map((b: unknown) =>
      Buffer.isBuffer(b) ? `<Buffer ${b.length} bytes>` : b
    )
    console.log(`Executing (default): ${query.sql} ${JSON.stringify(safeBindings)}`)
  }
})

export default db
