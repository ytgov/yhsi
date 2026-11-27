import * as fs from "fs/promises"
import * as path from "path"

import safeDynamicImport from "@/utils/safe-dynamic-import"
import logger from "@/utils/logger"

const NON_INITIALIZER_REGEX = /^index\.(ts|js)$/

export async function importAndExecuteInitializers() {
  const files = await fs.readdir(__dirname)

  for (const file of files.sort()) {
    if (NON_INITIALIZER_REGEX.test(file)) continue

    const modulePath = path.join(__dirname, file)
    logger.system(`Running initializer: ${modulePath}`)

    try {
      const { default: initializerAction } = await safeDynamicImport(modulePath)
      await initializerAction()
    } catch (error) {
      logger.system(`Failed to run initializer: ${modulePath} -> ${error}`, { error })
      throw error
    }
  }

  return true
}

if (require.main === module) {
  // TODO: add some kind of middleware that 503s? if initialization failed?
  ;(async () => {
    let exitCode = 0

    try {
      await importAndExecuteInitializers()
    } catch {
      logger.system("Failed to complete initialization!")
      exitCode = 1
    }

    // await flushLogger()

    process.exit(exitCode)
  })()
}
