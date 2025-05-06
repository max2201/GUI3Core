import _ from 'lodash'
import { unref } from 'vue'
import { convertDateForRequest } from '../utils/Date'
import {
  FilterFieldTypes,
  type IGroupActionInfo,
  type IModuleFilter,
  type IModuleFilterField,
} from '@/core/interface/Auth'
import {
  GetItems,
  GetModuleState,
  AddModuleFilter,
  SetCurrentFilter,
  DeleteSavedFilter,
  AddModuleToFavorites,
  RemoveModuleFromFavorite,
  apiGroupOperations,
  SetFavoriteModuleToTableWidget,
  DelFavoriteModuleFromTableWidget,
} from '@/core/api/modules.api'
import type {
  IModuleGroupDto,
  IModuleDto,
  ILocalStorageModule,
  IModuleSavedFilters,
  IModuleState,
} from '@/core/interface/Module'
import type {
  ITableRow,
  ITableCell,
  ITableCellHead,
  ITableDatasetMeta,
} from '@/core/interface/Table'

const DEFAULT_SORT_LIMIT = 100

export const useModuleStore = defineStore(
  'modules',
  () => {
    const authStore = useAuthStore()
    const configurationStore = useConfigurationStore()
    const dashboardStore = useDashboardStore()
    const sharedModals = useSharedModalsStore()

    // all modules (init data)
    const systemType = ref<number | null>(null)
    const modules = ref<IModuleGroupDto[]>([])

    // dataset (i.e current page holder)
    const moduleDatasetFetching = ref<boolean>(false)
    const currentModuleId = ref<string>('')
    const currentModuleUid = ref<string>('')
    const moduleFilter = ref<IModuleFilter>()
    const moduleSavedFilters = ref<IModuleSavedFilters>()
    const currentSavedFilter = ref<number | string>()
    const moduleGroupActions = ref<IGroupActionInfo[]>([])
    const moduleDataset = ref<ITableRow[]>([]) // строки для вывода
    const moduleDatasetSnapshot = ref<ITableCellHead[]>([]) // снапшот колонок
    const moduleDatasetMeta = ref({
      page: 1,
      count: 0,
      limit: DEFAULT_SORT_LIMIT,
      sort: {
        id: null,
        dir: 'ASC',
      },
      isContextView: false,
    }) as Ref<ITableDatasetMeta>

    // init actions
    const init = async () => {
      resetDataset()
      await getModules()
    }

    // сбор состояния при смене модуля
    watch(
      () => [currentModuleId.value, currentModuleUid.value],
      () => {
        resetDataset()
      },
    )

    const currentId = computed(() => {
      return `${currentModuleId.value}__${currentModuleUid.value}`
    })

    // работа с сохраненными пользовательскими вкладками на устройстве (localStorage)
    const getDBModules = () => {
      let savedModules = [] as ILocalStorageModule[]

      if (localStorage.getItem(LOCALSTORAGE.Modules)) {
        const jsonParsed = JSON.parse(localStorage.getItem(LOCALSTORAGE.Modules) || '')
        savedModules = Array.isArray(jsonParsed) ? jsonParsed : []
      }

      return savedModules
    }

    const getDBModule = () => {
      const savedModules = getDBModules()
      return savedModules.find((x) => x.id === currentId.value)
    }

    // GETTERS
    // возвращает текущий главный модуль
    const currentModules = (id: string) => {
      let returnable = [] as IModuleDto[]

      const module = modules.value.find((x) => x.Id === id)

      if (module && authStore.userModuleNames) {
        returnable = module.Modules.filter((x) => authStore.userModuleNames.includes(x.Id))
      }

      return returnable
    }

    // возвращает текущий под-модуль (страница / таблица)
    const getCurrentModule = (id: string, sid: string) => {
      const modules = currentModules(id)

      return modules.find((x) => x.Id === sid)
    }

    // находит по id модуля в общем массиве
    const findModuleById = (id: string): IModuleDto | null => {
      let module

      modules.value.find((x) => {
        return x.Modules.find((y) => {
          if (y.Id === id) {
            module = y
            return true
          }
        })
      })

      return module || null
    }

    const findModuleIdByBaseObjectType = (type: number) => {
      const module = modules.value.find((x) => {
        return x.Modules.find((y) => y.BaseObjectType === type)
      })

      return module?.Id
    }

    const getFilterDTO = (filter: IModuleFilter | undefined) => {
      const result = {} as { [key: string]: string }

      if (!filter) {
        result['txtSmartFilter'] = ''
        return result
      }

      result['txtSmartFilter'] = filter.SmartFilterValue || ''

      const fields = [...filter.PrimaryFields, ...filter.SecondaryFields]

      fields.forEach((field) => {
        if (field.subItems) {
          field.subItems.forEach((subField) => {
            if (subField.type === FilterFieldTypes.Date) {
              result[subField.id] = convertDateForRequest(subField.currentVal as any)
              return
            }

            result[subField.id] = subField.currentVal
          })

          return
        }

        if (field.type === FilterFieldTypes.Date) {
          result[field.id] = convertDateForRequest(field.currentVal as any)
          return
        }

        result[field.id] = field.currentVal
      })

      return result
    }

    // STATE ACTIONS
    const changeDatasetSorting = (id: string, dir: 'DESC' | 'ASC') => {
      moduleDatasetMeta.value.sort.id = id
      moduleDatasetMeta.value.sort.dir = dir
    }

    // api actions
    const getModules = async () => {
      const { data, error } = await configurationStore.requestConfiguration()

      if (data) {
        authStore.setAuthenticated(true)
        const { SystemType, ModuleGroups } = data
        systemType.value = SystemType
        modules.value = [...ModuleGroups]
      }

      return { data, error }
    }

    const handleModuleState = async (data: IModuleState) => {
      moduleFilter.value = data?.Filter
      moduleSavedFilters.value = data?.ModuleFilterCollection
      currentSavedFilter.value = data?.Filter?.FilterId
      moduleGroupActions.value = data?.AvailableGroupActions
      // Prepare table columns
      const currentModuleData = findModuleById(currentModuleId.value)
      const currentModuleColumns = currentModuleData?.Columns || []

      moduleDatasetSnapshot.value = data.CurrentColumns.map((column) => {
        const moduleColumn = currentModuleColumns.find((c) => c.Id === column.Id)
        let sortDir

        if (moduleColumn) {
          if (moduleColumn.SortedDirection === 1) {
            sortDir = 'DESC'
          } else {
            sortDir = 'ASC'
          }
        }

        return {
          id: column.Id,
          label: column.Title,
          width: column.Width * 1.3,
          sort: moduleColumn ? moduleColumn.SortProperty : undefined,
          sortDir,
        }
      })

      // Prepare table meta for pagination and sort detection
      moduleDatasetMeta.value.page = data.PageNumber
      moduleDatasetMeta.value.count = 0
      moduleDatasetMeta.value.limit = data.PageSize
      moduleDatasetMeta.value.sort.id = data.SortedColumn
      moduleDatasetMeta.value.sort.dir = data.SortedDirection === 1 ? 'DESC' : 'ASC'
      moduleDatasetMeta.value.isContextView = data.AvailableContextView
    }

    const getModuleState = async () => {
      if (!currentModuleId.value) return
      const { data, error } = await GetModuleState({
        ViewId: currentModuleUid.value,
        ModuleId: currentModuleId.value,
      })

      if (!data || error) {
        sharedModals.setModal({
          name: 'notification',
          params: {
            type: 'error',
            title: 'Ошибка при загрузке состояния модуля',
            description: 'Попробуйте позднее или обратитесь в техническую поддержку',
          },
        })

        return
      }

      handleModuleState(data)
    }
    const sendGroupOperation = async (operation: string, ids: string[]) => {
      const { data, error } = await apiGroupOperations(operation, ids)

      if (!data || error) {
        console.log(error)
        sharedModals.setModal({
          name: 'notification',
          params: {
            type: 'error',
            title: error[0].Message || 'Ошибка при выполнении групповой операции',
            description:
              error[0].ExceptionMessage ||
              'Попробуйте позднее или обратитесь в техническую поддержку',
            stackTrace: error[0].StackTrace || null,
          },
        })
      }
      return data
    }

    const getModuleDataset = async () => {
      if (!currentModuleId.value) return

      const request = {
        ModuleId: currentModuleId.value,
        ViewId: currentModuleUid.value,
        PageNumber: moduleDatasetMeta.value.page,
        PageSize: moduleDatasetMeta.value.limit,
        SortColumn: moduleDatasetMeta.value.sort.id,
        SortMode: moduleDatasetMeta.value.sort.dir === 'ASC' ? 0 : 1,
        Filter: getFilterDTO(moduleFilter.value),
      }
      moduleDatasetFetching.value = true
      const { data, error } = await GetItems(request)

      if (!data || error) {
        sharedModals.setModal({
          name: 'notification',
          params: {
            type: 'error',
            title: 'Ошибка при загрузке модуля',
            description:
              'Возможно он еще не подключен. Попробуйте позднее или обратитесь в техническую поддержку',
          },
        })

        resetDataset()
        EventBus.emit(GlobalEvents.ModuleDataChanged)
        moduleDatasetFetching.value = false

        return data
      }

      moduleDatasetMeta.value.count = data.TotalCount

      const { Rows } = data
      const covertDtoToCollumn = [] as ITableRow[]

      // маппинг данных апи в обьекты интерфейса ITable (AtomTable)
      Rows.forEach((row) => {
        const mappedCells = row.Cells.map((cell) => {
          // базовый обьект содержит значения из листа данных и найстройки отображения
          const cellReturnable = {
            value: cell.Value,
            type: cell.CellType,
            presentation: {
              background: cell.BackColor === '#FFFFFF' ? '' : cell.BackColor,
              text: cell.TextColor || '',
            },
          } as ITableCell

          // конвертация ячеек с флагами
          if (cell.CellType === 3 && cell.Value) {
            cellReturnable.value = JSON.parse(cell.Value)
          }

          return cellReturnable
        })

        covertDtoToCollumn.push({
          id: row.Id,
          title: row.Title,
          color: row.Color,
          cells: mappedCells.filter((x) => x.id !== '000x000'),
        })
      })

      // установка стора
      moduleDataset.value = covertDtoToCollumn

      EventBus.emit(GlobalEvents.ModuleDataChanged)
      moduleDatasetFetching.value = false
    }

    const getPageData = async () => {
      await getModuleState()
      await getModuleDataset()
    }

    // сборс
    const resetDataset = () => {
      moduleDatasetFetching.value = false
      moduleDataset.value = []
      moduleDatasetSnapshot.value = []
      moduleDatasetMeta.value.page = 1
      moduleDatasetMeta.value.count = null
      moduleDatasetMeta.value.limit = DEFAULT_SORT_LIMIT
      moduleDatasetMeta.value.sort.id = null
      moduleDatasetMeta.value.sort.dir = 'DESC'
      moduleGroupActions.value = []
      moduleFilter.value = undefined
    }

    const resetFilter = () => {
      moduleFilter.value?.PrimaryFields.map((field) => {
        field.currentVal = field.defaultVal

        if (!field.subItems) {
          return
        }

        field.subItems.forEach((subField) => {
          subField.currentVal = subField.defaultVal
        })
      })

      moduleFilter.value?.SecondaryFields.map((field) => {
        field.currentVal = field.defaultVal

        if (!field.subItems) {
          return
        }

        field.subItems.forEach((subField) => {
          subField.currentVal = subField.defaultVal
        })
      })

      if (moduleFilter.value?.SmartFilterValue) {
        moduleFilter.value.SmartFilterValue = ''
      }
    }

    const saveFilter = async (filterName: string) => {
      const { data, error } = await AddModuleFilter({
        ModuleId: currentModuleId.value,
        ViewId: currentModuleUid.value,
        FilterName: filterName,
        CurrentFilterValues: getFilterDTO(moduleFilter.value),
      })

      if (!data || error) {
        sharedModals.setModal({
          name: 'notification',
          params: {
            type: 'error',
            title: 'Ошибка при сохранении фильтра',
            description: 'Попробуйте позднее или обратитесь в техническую поддержку',
          },
        })

        return
      }

      handleModuleState(data)
      getModuleDataset()
    }

    const setSavedFilter = async (filterId: string | number) => {
      const { data, error } = await SetCurrentFilter({
        ModuleId: currentModuleId.value,
        ViewId: currentModuleUid.value,
        FilterId: filterId,
      })

      if (!data || error) {
        sharedModals.setModal({
          name: 'notification',
          params: {
            type: 'error',
            title: 'Ошибка при выборе фильтра',
            description: 'Попробуйте позднее или обратитесь в техническую поддержку',
          },
        })

        return
      }

      handleModuleState(data)
      getModuleDataset()
    }

    const deleteSavedFilter = async (filterId: string | number) => {
      const { data, error } = await DeleteSavedFilter({
        ModuleId: currentModuleId.value,
        ViewId: currentModuleUid.value,
        FilterId: filterId,
      })

      if (!data || error) {
        sharedModals.setModal({
          name: 'notification',
          params: {
            type: 'error',
            title: 'Ошибка при выборе фильтра',
            description: 'Попробуйте позднее или обратитесь в техническую поддержку',
          },
        })

        return
      }

      handleModuleState(data)
      getModuleDataset()
    }

    const moduleFilterHasChanges = computed(() => {
      if (!moduleFilter.value) return false

      if (moduleFilter.value.PrimaryFields.find((field) => field.currentVal !== field.defaultVal)) {
        return true
      }

      if (
        moduleFilter.value.SecondaryFields.find((field) => field.currentVal !== field.defaultVal)
      ) {
        return true
      }

      const subfields = [
        ...moduleFilter.value.PrimaryFields.filter((field) => field.subItems).reduce(
          (acc, field) => {
            if (!field.subItems) return acc

            acc.push(...field.subItems)
            return acc
          },
          [] as IModuleFilterField[],
        ),
        ...moduleFilter.value.SecondaryFields.filter((field) => field.subItems).reduce(
          (acc, field) => {
            if (!field.subItems) return acc

            acc.push(...field.subItems)
            return acc
          },
          [] as IModuleFilterField[],
        ),
      ]

      if (subfields.find((subField) => subField.currentVal !== subField.defaultVal)) {
        return true
      }

      return false
    })

    const addModuleToFavorites = async (ViewId?: string) => {
      const { data } = await AddModuleToFavorites(unref(currentModuleId), ViewId)

      dashboardStore.updateFavoriteModules(data || [])
    }

    const removeModuleFromFavorite = async (ViewId?: string, ModuleId?: string) => {
      const { data } = await RemoveModuleFromFavorite(
        ModuleId ? ModuleId : unref(currentModuleId),
        ViewId,
      )

      dashboardStore.updateFavoriteModules(data || [])
    }
    const setFavoriteModuleToTableWidget = async (ViewId?: string, ModuleId?: string) => {
      const { data } = await SetFavoriteModuleToTableWidget(
        ModuleId ? ModuleId : unref(currentModuleId),
        ViewId,
      )

      dashboardStore.updateFavoriteModules(data || [])
    }

    const delFavoriteModuleFromTableWidget = async (ViewId?: string, ModuleId?: string) => {
      const { data } = await DelFavoriteModuleFromTableWidget(
        ModuleId ? ModuleId : unref(currentModuleId),
        ViewId,
      )

      dashboardStore.updateFavoriteModules(data || [])
    }

    const toggleFavoriteModule = async (FullViewId: string, ViewId?: string) => {
      const isCurrentlyFavoriteModule = dashboardStore.isFavoriteModule(FullViewId)

      if (isCurrentlyFavoriteModule) {
        removeModuleFromFavorite(ViewId)
      } else {
        addModuleToFavorites(ViewId)
      }
    }

    return {
      init,
      getDBModule,
      // modules
      getModules,
      getPageData,
      modules,
      currentModules,
      getCurrentModule,
      findModuleById,
      // dataset
      getModuleState,
      getModuleDataset,
      moduleDatasetFetching,
      currentModuleId,
      currentModuleUid,
      currentSavedFilter,
      moduleGroupActions,
      moduleDataset,
      moduleDatasetSnapshot,
      moduleDatasetMeta,
      moduleFilter,
      moduleFilterHasChanges,
      moduleSavedFilters,
      changeDatasetSorting,
      sendGroupOperation,
      // filter
      resetDataset,
      saveFilter,
      resetFilter,
      setSavedFilter,
      deleteSavedFilter,
      toggleFavoriteModule,
      removeModuleFromFavorite,
      setFavoriteModuleToTableWidget,
      delFavoriteModuleFromTableWidget,
      getFilterDTO,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useModuleStore, import.meta.hot))
}
