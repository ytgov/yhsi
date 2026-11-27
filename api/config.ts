import * as dotenv from "dotenv"

import parseIntWithFallback from "./utils/parse-int-with-fallback"

let dotEnvPath
switch (process.env.NODE_ENV) {
  case "test":
    dotEnvPath = `.env.test`
    break
  case "production":
    dotEnvPath = `.env.production`
    break
  default:
    dotEnvPath = `.env.development`
}
dotenv.config({ path: dotEnvPath })

export const API_PORT = parseInt(process.env.API_PORT || "3000")
export const FRONTEND_URL = process.env.FRONTEND_URL || "localhost:8080"
export const AUTH_REDIRECT = process.env.AUTH_REDIRECT || process.env.FRONTEND_URL || ""
export const NODE_ENV = process.env.NODE_ENV
export const SESSION_SECRET = process.env.SESSION_SECRET || "supersecret"

export const DB_NAME = process.env.DB_NAME || ""
export const DB_USER = process.env.DB_USER || ""
export const DB_PASS = process.env.DB_PASS || ""
export const DB_HOST = process.env.DB_HOST || ""
export const DB_PORT = parseInt(process.env.DB_PORT || "1433")

export const DB_TRUST_SERVER_CERTIFICATE = process.env.DB_TRUST_SERVER_CERTIFICATE === "true"
export const DB_HEALTH_CHECK_INTERVAL_SECONDS = parseIntWithFallback(
  process.env.DB_HEALTH_CHECK_INTERVAL_SECONDS,
  5
)
export const DB_HEALTH_CHECK_TIMEOUT_SECONDS = parseIntWithFallback(
  process.env.DB_HEALTH_CHECK_TIMEOUT_SECONDS,
  10
)
export const DB_HEALTH_CHECK_RETRIES = parseIntWithFallback(process.env.DB_HEALTH_CHECK_RETRIES, 3)
export const DB_HEALTH_CHECK_START_PERIOD_SECONDS = parseIntWithFallback(
  process.env.DB_HEALTH_CHECK_START_PERIOD_SECONDS,
  5
)

export const CLIENT_ID = process.env.CLIENT_ID || ""
export const ISSUER_BASE_URL = process.env.ISSUER_BASE_URL || ""
export const AUTH_DB_CONNECTION = process.env.AUTH_DB_CONNECTION || ""

export const DB_CONFIG = {
  client: "mssql",
  connection: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT,
  },
}

export const GIS_PORTAL_CLIENT_ID = process.env.GIS_PORTAL_CLIENT_ID || ""
export const GIS_PORTAL_CLIENT_SECRET = process.env.GIS_PORTAL_CLIENT_SECRET || ""
export const GIS_FEATURE_USERNAME = process.env.GIS_FEATURE_USERNAME || ""
export const GIS_FEATURE_PASSWORD = process.env.GIS_FEATURE_PASSWORD || ""

// Configure Sentry (GlitchTip) for Monitorings)
export const SENTRY_DSN = process.env.SENTRY_DSN || ""
