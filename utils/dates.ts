// ISOString format: YYYY-MM-DDTHH:mm:ss.sssZ
const getDateFromISOString = (date: Date) => {
  return date.toISOString().split('T')[0]
}

/**
 * Get today date
 * @returns  date in formatted string YYYY-MM-DD
 */
export const getToday = () => {
  return getDateFromISOString(new Date())
}

/**
 * Get week ago date
 * @returns date in formatted string YYYY-MM-DD
 */
export const getWeekAgo = () => {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return getDateFromISOString(date)
}

/**
 * Get month ago date
 * @returns date in formatted string YYYY-MM-DD
 */
export const getMonthAgo = () => {
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  return getDateFromISOString(date)
}

