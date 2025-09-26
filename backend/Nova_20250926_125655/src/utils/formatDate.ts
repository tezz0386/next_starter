export const formatDate = (
  date: string | number | Date,
  locale: string = 'en-US'
): string => {
  try {
    const d = new Date(date)
    return d.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return String(date)
  }
}
