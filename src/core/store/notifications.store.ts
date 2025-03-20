import {
  DeleteNotification,
  GetNotificationsCount,
  GetNotificationsGroup,
  GetNotificationsRows,
  type INotificationsArrayResponse,
} from '@/core/api/notifications.api'
import type { UiNotificationsBar, UiNotificationsGroupItem } from '@/core/interface/Ui'
import { NotificationsConst } from '@/core/constants/Notifications'
import { formatDateString } from '@/core/utils/formatDateString'
import { formatDateToTime } from '@/core/utils/formatDateToTime'
import { DeleteObjectFromArrayOnId } from '@/core/utils/DeleteObjectFromArrayOnId'
import { shortenString } from '@/core/utils/shortenString'
import { buildNotificationCardItem } from '@/core/model/NotificationCard'

export const useNotificationsStore = defineStore('notifications', () => {
  const showNotificationsOnHeader = ref(false)
  const notificationsDataArray = ref<UiNotificationsGroupItem[]>([])
  const notificationsBarArray = ref<any[]>([])
  const notificationsCount = ref<null | number>(null)
  const activeGroupType = ref<null | number>(null)
  const marginRightNotificationsBlock = ref<null | string>(null)
  const headerNotificationsCount = ref<null | number>(null)
  const dashboardNotificationsCount = ref(null)
  const dashboardNotificationsDataArray = ref<any[]>([])
  const dashboardActiveGroup = ref<any[]>([])
  const notificationsRows = ref<any[]>([])
  const rowsCount = ref<null | number>(null)
  const activePage = ref(1)
  const onlyOverdue = ref(false)

  const toggleNotificationsOnHeader = (opened: boolean) => {
    showNotificationsOnHeader.value = opened
  }

  const setNotificationBar = (preparedData: UiNotificationsBar[]) => {
    notificationsBarArray.value = preparedData
  }

  const setNotificationGroup = (preparedData: UiNotificationsGroupItem[]) => {
    notificationsDataArray.value = preparedData
  }

  const setNotificationsDashboardData = (preparedData: UiNotificationsGroupItem[]) => {
    dashboardNotificationsDataArray.value = preparedData
  }

  const preparedNotificationBarData = (data) => {
    return data?.map((item) => {
      return {
        count: item?.Count,
        type: item?.GroupType,
        newCount: item?.NewCount,
        iconType: `iconNotificationBar-${item?.GroupType}`,
      } as UiNotificationsBar
    })
  }

  const preparedNotificationsArrayData = (
    data: INotificationsArrayResponse,
    componentName: string = ''
  ): UiNotificationsGroupItem[] => {
    return data?.Items?.map((item) => {
      return buildNotificationCardItem(item, {
        authorMaxLength: componentName === 'dashboardNotifications' ? 30 : 37,
      })
    })
  }

  const getNotificationsBar = async (): Promise<void> => {
    const { data } = await GetNotificationsCount()
    headerNotificationsCount.value = 0
    data?.forEach((item) => {
      headerNotificationsCount.value += item?.Count
    })
    const preparedData = preparedNotificationBarData(data)
    setNotificationBar(preparedData)
  }

  const getNotificationGroup = async (groupType: number | null, pageNumber: number = 1) => {
    if (groupType === null) {
      return
    }

    activeGroupType.value = groupType
    const { data } = await GetNotificationsGroup({
      PageNumber: pageNumber,
      PageSize: NotificationsConst.RequestViewNotifications,
      Types: [groupType],
    })
    const preparedData = preparedNotificationsArrayData(data)
    notificationsDataArray.value = []
    notificationsCount.value = data?.TotalCount
    setNotificationGroup(preparedData)
  }

  const getNotificationsDashboard = async (
    groupType: Array<number>,
    componentName: string,
    pageNumber: number = 1
  ) => {
    dashboardActiveGroup.value = []
    dashboardActiveGroup.value.push(...groupType)
    const { data } = await GetNotificationsGroup({
      PageNumber: pageNumber,
      PageSize: NotificationsConst.RequestViewNotificationsDashboard,
      Types: [...groupType],
    })
    dashboardNotificationsDataArray.value = []
    const preparedData = preparedNotificationsArrayData(data, componentName)
    dashboardNotificationsCount.value = data?.TotalCount
    setNotificationsDashboardData(preparedData)
  }

  const getNotificationsTable = async (types = [], page = 1, filter = '') => {
    activePage.value = page
    const { data } = await GetNotificationsRows({
      OnlyOverdue: onlyOverdue.value,
      TextFilter: filter,
      PageNumber: page,
      PageSize: 100,
      Types: [...types],
    })

    if (!data) {
      return
    }

    rowsCount.value = 0
    rowsCount.value = data.TotalCount
    notificationsRows.value = data.Rows
  }

  const deleteNotification = async (notificationIds: Array<number>, componentType: string) => {
    const idsDelete = [...notificationIds]
    notificationsDataArray.value = DeleteObjectFromArrayOnId(
      notificationsDataArray.value,
      idsDelete
    )
    dashboardNotificationsDataArray.value = DeleteObjectFromArrayOnId(
      dashboardNotificationsDataArray.value,
      idsDelete
    )
    const { data } = await DeleteNotification({
      LongParamIds: idsDelete,
    })
    const preparedData = preparedNotificationBarData(data)
    setNotificationBar(preparedData)
    if (componentType === 'headerNotifications') {
      await getNotificationGroup(activeGroupType.value)
    }

    ;(headerNotificationsCount.value as number)--
  }

  const closeNotifications = () => {
    document.querySelectorAll('.notificationsBar__item').forEach((item) => {
      item.classList.remove('_active')
    })
    toggleNotificationsOnHeader(false)
  }

  const toggleOnlyOverdue = (bool: boolean) => {
    onlyOverdue.value = bool
  }

  return {
    showNotificationsOnHeader,
    notificationsDataArray,
    toggleNotificationsOnHeader,
    getNotificationsBar,
    notificationsBarArray,
    getNotificationGroup,
    notificationsCount,
    deleteNotification,
    marginRightNotificationsBlock,
    closeNotifications,
    getNotificationsDashboard,
    dashboardNotificationsCount,
    headerNotificationsCount,
    dashboardNotificationsDataArray,
    getNotificationsTable,
    notificationsRows,
    rowsCount,
    activePage,
    toggleOnlyOverdue,
  }
})
