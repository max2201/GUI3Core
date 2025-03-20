import moment from 'moment'
// Делает вчера сегодня завтра или дату
export const formatDateString = (dateString: string): string => {
  const parsedDate = moment(dateString, 'DD.MM HH:mm')
  const today = moment().startOf('day')
  const dateDiff = parsedDate.diff(today, 'days')

  if (dateDiff < 0 && dateDiff >= -1) {
    return dateDiff === -1 ? 'вчера' : parsedDate.format('DD.MM.YYYY')
  } else if (dateDiff === 0) {
    return 'сегодня'
  } else if (dateDiff > 0 && dateDiff <= 1) {
    return dateDiff === 1 ? 'завтра' : parsedDate.format('DD.MM.YYYY')
  } else {
    return parsedDate.format('DD.MM.YYYY')
  }
}
