import { format } from 'date-fns'

export const convertDateForRequest = (date: Date | String) => {
  if (!date || !(date instanceof Date)) {
    return date
  }
  return format(date, 'dd.MM.yyyy')
}
