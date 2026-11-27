/**
 * TODO refactor entire file in favor of winston for logging (https://www.npmjs.com/package/winston)
 *
 * Minimal console-backed logger.
 *
 * Mirrors winston's npm levels (plus a custom "system" level) and its
 * `logger.<level>(message, meta?)` call signature, so this can be swapped for
 * `winston.createLogger({ levels: LOG_LEVELS, ... })` later without touching callers.
 */

export const LOG_LEVELS = {
  error: 0,
  warn: 1,
  system: 2,
  info: 3,
  http: 4,
  verbose: 5,
  debug: 6,
  silly: 7,
} as const

export type LogLevel = keyof typeof LOG_LEVELS
export type LogMeta = Record<string, unknown>
export type LogMethod = (message: string, meta?: LogMeta) => void
export type Logger = Record<LogLevel, LogMethod>

const CONSOLE_METHODS: Record<LogLevel, (...args: unknown[]) => void> = {
  error: console.error,
  warn: console.warn,
  system: console.info,
  info: console.info,
  http: console.log,
  verbose: console.log,
  debug: console.debug,
  silly: console.debug,
}

function isLogLevel(value: unknown): value is LogLevel {
  return typeof value === "string" && value in LOG_LEVELS
}

const LOG_LEVEL: LogLevel = isLogLevel(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : "debug"

function log(level: LogLevel, message: string, meta?: LogMeta): void {
  if (LOG_LEVELS[level] > LOG_LEVELS[LOG_LEVEL]) return

  const line = `${new Date().toISOString()} [${level}]: ${message}`
  const write = CONSOLE_METHODS[level]

  if (meta === undefined) {
    write(line)
  } else {
    write(line, meta)
  }
}

export const logger: Logger = {
  error: (message, meta) => log("error", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  system: (message, meta) => log("system", message, meta),
  info: (message, meta) => log("info", message, meta),
  http: (message, meta) => log("http", message, meta),
  verbose: (message, meta) => log("verbose", message, meta),
  debug: (message, meta) => log("debug", message, meta),
  silly: (message, meta) => log("silly", message, meta),
}

export default logger
