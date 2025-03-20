import moment from 'moment';

export const formatDateToTime = (dateString: string): string => {
  const momentObj = moment(dateString, 'DD.MM HH:mm', 'ru')
  return momentObj.format('HH:mm')
}
