export function formatDate(input: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      ...(options || {}),
    }).format(date);
  } catch {
    return String(date);
  }
}
