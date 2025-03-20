import {
  ExecuteCommand,
  GetKanban,
  GetTasks,
  GetTasksCount,
  SetUserAsExecutorForTask,
} from '@/core/api/modules.api'
import { shortenString } from '@/core/utils/shortenString'

export const useTasksStore = defineStore('tasks', () => {
  const showTasksOnHeader = ref(false)
  const countTasksOnHeader = ref(null)
  const totalCount = ref(null)
  const tasksHeaderArray = ref([])
  const desktopKanbanViewCode = ref(sessionStorage.getItem('desktopKanbanViewCode') || null)
  const desktopKanbanArray = ref([])

  const toggleTasksOnHeader = (opened: boolean) => {
    showTasksOnHeader.value = opened
  }

  const closeTasks = () => {
    toggleTasksOnHeader(false)
  }

  const getTasksCountOnHeader = async () => {
    const { data } = await GetTasksCount()

    if (!data) {
      return
    }

    countTasksOnHeader.value = data.Count
  }

  const preparedTasksArrayData = (data, componentName: string = '') => {
    return data?.map((item) => {
      return {
        id: item?.BaseObjectId,
        title: item?.ToolTipHeader?.Value,
        author: item?.AuthorName,
        color: item?.ToolTipHeader?.SystemColor,
        text: shortenString(item?.CommonDescription, 105),
        objectId: item?.PrimaryObject?.BaseObjectId,
        objectType: item?.PrimaryObject?.BaseObjectType,
        objectTitle: item?.PrimaryObject?.BaseObjectName,
      }
    })
  }

  const getTasksOnHeader = async (pageSize, pageNumber) => {
    const { data } = await GetTasks({
      PageSize: pageSize,
      PageNumber: pageNumber,
    })
    tasksHeaderArray.value = []
    tasksHeaderArray.value = preparedTasksArrayData(data)
  }

  const setExecutorForTask = async (objectId, id) => {
    const LongParamIds = [id]
    const { data } = await SetUserAsExecutorForTask({
      LongParamIds,
    })
    await getTasksOnHeader(5, 1)
    countTasksOnHeader.value = data.Count
  }

  const primaryObjectData = (fields) => {
    let returnObj = {}
    fields.find((item) => {
      if (item.Code === 'PrimaryObject') {
        returnObj = {
          objectId: item?.Value?.BaseObjectId,
          objectType: item?.Value?.BaseObjectType,
        }
      } else {
        return
      }
    })
    return returnObj
  }

  const filterFields = (fields) => {
    return fields.filter((item) => item.Code !== 'PrimaryObject')
  }

  const preparedKanbanCardItem = (item) => {
    return {
      taskNumber: item?.BaseObjectId,
      status: item?.StatusField?.Value,
      column: item?.KanbanColumnCode,
      headerTitle: item?.KanbanHeader?.Value,
      commandTitle: item?.KanbanPrimaryCommand?.Title,
      commandCode: item?.KanbanPrimaryCommand?.Code,
      secondaryCommandTitle: item?.KanbanSecondaryCommand?.Title,
      secondaryCommandCode: item?.KanbanSecondaryCommand?.Code,
      primaryObject: primaryObjectData(item?.KanbanFields?.Fields),
      fields: filterFields(item?.KanbanFields?.Fields),
    }
  }

  const preparedKanbanCardData = (items) => {
    return items?.map((item) => {
      return preparedKanbanCardItem(item)
    })
  }

  const preparedKanbanCardsData = (data) => {
    return data?.Columns?.map((item) => {
      return {
        title: item.Title,
        code: item.Code,
        items: preparedKanbanCardData(item.Items),
      }
    })
  }

  const getKanbanDashboard = async (filter = {}) => {
    const { data } = await GetKanban({
      KanbanViewCode: desktopKanbanViewCode.value,
      Filter: filter,
    })
    if (data) {
      totalCount.value = data.TotalCount
      desktopKanbanArray.value = preparedKanbanCardsData(data)
    }
  }

  const getExecuteCommand = async (id, commandCode) => {
    const { data } = await ExecuteCommand({
      KanbanViewCode: desktopKanbanViewCode.value,
      CommandCode: commandCode,
      ObjectId: id,
    })
    let oldItem = null
    let columnCode = null
    desktopKanbanArray.value.forEach((column) => {
      column.items.forEach((item) => {
        if (item.taskNumber === id) {
          oldItem = item
          columnCode = column.code
        }
      })
    })
    if (data?.KanbanColumnCode === oldItem.column) {
      return
    } else {
      desktopKanbanArray.value = desktopKanbanArray.value.map((column) => {
        if (column.code === data?.KanbanColumnCode) {
          column.items.unshift(preparedKanbanCardItem(data))
          return column
        } else if (column.code === columnCode) {
          column.items = column.items.filter((item) => item.taskNumber !== id)
          return column
        } else {
          return column
        }
      })
    }
  }

  return {
    showTasksOnHeader,
    toggleTasksOnHeader,
    closeTasks,
    countTasksOnHeader,
    getTasksCountOnHeader,
    getTasksOnHeader,
    tasksHeaderArray,
    setExecutorForTask,
    desktopKanbanViewCode,
    getKanbanDashboard,
    desktopKanbanArray,
    totalCount,
    getExecuteCommand,
  }
})
