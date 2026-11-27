export async function safeDynamicImport(modulePath: string) {
  // In Vitest, use import() for TypeScript files
  if (process.env.VITEST) {
    try {
      // NOTE: DO NOT REMOVE THE AWAIT HERE!!!
      // Without it, the catch block will not trigger.
      const module = await import(modulePath)
      return module
    } catch {
      // The global-setup.mts uses execSync('npm run ts-node ...') which inherits the VITEST env var.
      // However, it runs in pure Node.js (with ts-node's require hook), where native import()
      // of a .ts file throws ERR_UNKNOWN_FILE_EXTENSION.
      // We can safely fall through to require() here.
    }
  }

  // In Node.js, use require
  const module = await require(modulePath)
  return module
}

export default safeDynamicImport
