export default function parseIntWithFallback(value: string | undefined, fallback: number): number {
  const parsed = parseInt(value ?? "", 10)
  return isNaN(parsed) ? fallback : parsed
}
