export function decodeCommaDelimitedArray(
  value: null | string | string[]
): string[] {
  if (value === null || value === '') return [];
  if (Array.isArray(value)) return value;

  return value.split(',');
}

export function encodeCommaDelimitedArray(value: string[]): string | null {
  if (value.length === 0) return null;

  return value.join(',');
}
