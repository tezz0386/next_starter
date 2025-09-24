export const formatDate = (
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions
) => {
  try {
    const date = new Date(value);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(options || {}),
    });
  } catch {
    return String(value);
  }
};
