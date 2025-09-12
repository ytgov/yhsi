import { Knex } from "knex"

import { DB_CONFIG } from "../config"

const config: { [key: string]: Knex.Config } = {
  development: {
    ...DB_CONFIG,
  },
  test: {
    ...DB_CONFIG,
  },
  production: {
    ...DB_CONFIG,
  },
}

export default config
