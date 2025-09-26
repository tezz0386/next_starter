export function formatDate(
  value: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
  return date.toLocaleDateString(undefined, options);
}
