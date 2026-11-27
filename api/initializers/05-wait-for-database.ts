import knex, { type Knex } from "knex"

import {
  DB_HEALTH_CHECK_INTERVAL_SECONDS,
  DB_HEALTH_CHECK_RETRIES,
  DB_HEALTH_CHECK_START_PERIOD_SECONDS,
  DB_HEALTH_CHECK_TIMEOUT_SECONDS,
} from "@/config"
import logger from "@/utils/logger"
import sleep from "@/utils/sleep"
import { buildKnexConfig } from "@/db/db-migration-client"
import { isCredentialFailure, isSocketFailure } from "@/utils/db-error-helpers"

// TODO update knex to ^3.1.0
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkHealth(dbMigrationClient: Knex<any, unknown[]>, timeoutSeconds: number) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Connection timeout")), timeoutSeconds * 1000)
    dbMigrationClient
      .raw("SELECT 1")
      .then(() => {
        clearTimeout(timer)
        resolve(null)
      })
      .catch(reject)
  })
}

export async function waitForDatabase({
  intervalSeconds = DB_HEALTH_CHECK_INTERVAL_SECONDS,
  timeoutSeconds = DB_HEALTH_CHECK_TIMEOUT_SECONDS,
  retries = DB_HEALTH_CHECK_RETRIES,
  startPeriodSeconds = DB_HEALTH_CHECK_START_PERIOD_SECONDS,
}: {
  intervalSeconds?: number
  timeoutSeconds?: number
  retries?: number
  startPeriodSeconds?: number
} = {}): Promise<void> {
  await sleep(startPeriodSeconds)

  logger.system("Attempting direct to database connection...")
  const databaseConfig = buildKnexConfig()
  let dbMigrationClient = knex(databaseConfig)
  let isDatabaseSocketReady = false

  for (let i = 0; i < retries; i++) {
    try {
      await checkHealth(dbMigrationClient, timeoutSeconds)
      logger.system("Database connection successful.")
      return
    } catch (error) {
      if (isSocketFailure(error)) {
        logger.system(`Database socket is not ready, retrying... ${error}`, { error })
        await sleep(intervalSeconds)
      } else if (isCredentialFailure(error)) {
        if (isDatabaseSocketReady) {
          logger.system(`Database connection failed due to invalid credentials: ${error}`, {
            error,
          })
          throw error
        } else {
          logger.system(
            "Falling back to database server-level connection (database might not exist)..."
          )
          const serverLevelConfig = buildKnexConfig({ connection: { database: "" } })
          await dbMigrationClient.destroy() // remove?
          dbMigrationClient = knex(serverLevelConfig)
          i -= 1
          isDatabaseSocketReady = true
          continue
        }
      } else {
        logger.system(`Unknown database connection error: ${error}`, { error })
        throw error
      }
    }
  }

  throw new Error(`Failed to connect to the database due to timeout.`)
}

export default waitForDatabase
