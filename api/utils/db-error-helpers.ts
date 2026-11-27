export function isCredentialFailure(error: unknown): boolean {
  return (
    error instanceof Error &&
    ((error as NodeJS.ErrnoException).code === "ELOGIN" ||
      error.message.includes("Login failed for user"))
  )
}

export function isSocketFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false

  const { code } = error as NodeJS.ErrnoException
  return code === "ESOCKET" || code === "ETIMEOUT"
}
