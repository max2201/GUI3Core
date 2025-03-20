import type { INotification } from '@/core/interface/Notifications'
import type { UiNotificationsBar, UiNotificationsGroupItem } from '@/core/interface/Ui'
import { formatDateString } from '@/core/utils/formatDateString'
import { formatDateToTime } from '@/core/utils/formatDateToTime'
import { shortenString } from '@/core/utils/shortenString'

interface BuildNotificationCardItemOptions {
  authorMaxLength?: number
}

export const buildNotificationCardItem = (
  data: INotification,
  options?: BuildNotificationCardItemOptions
): UiNotificationsGroupItem => {
  return {
    id: data?.Id,
    title: data?.Header,
    day: formatDateString(data?.OnlyTimeString), // Делает вчера сегодня завтра или дату
    time: formatDateToTime(data?.OnlyTimeString), // Достает время
    author: shortenString(data?.UserName, options?.authorMaxLength || 37),
    hintAuthor: data?.UserName,
    client: data?.Client?.BaseObjectName,
    clientData: data?.Client,
    text: shortenString(data?.Comment, 105), // Обрезает строку по числу символов
    hintText: data?.Comment,
    objectType: data?.LinkedObject?.BaseObjectType,
    objectId: data?.LinkedObject?.BaseObjectId,
    valueType: data?.DataValueType,
    notificationType: data?.NotificationType,
    groupType: data?.GroupType,
    quickDeleteAvailable: data?.QuikDeleteAvailable,
  } as UiNotificationsGroupItem
}
