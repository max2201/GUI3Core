import type {
  Dictionary,
  IEnumDictionaries,
  VirtualDictionaries,
} from '@/core/interface/Configuration'
import type { IModuleDto, IModuleGroupDto } from '@/core/interface/Module'
import { GetConfiguration } from '@/core/api/configuration.api'
import { useUploadFilesStore } from '@/core/store/uploadFiles.store'
import { BaseObjectType } from '../constants/BaseObjectType'
import { NotificationsModuleId } from '@/core/constants/ModuleId'

interface ConfigurationStoreState {
  BaseObjectsColors: { [key: string]: string }
  Dictionaries: Dictionary[]
  VirtualDictionaries: VirtualDictionaries
  EnumDictionaries: IEnumDictionaries
  SystemColors: { [key: string]: string }
  SystemType: number | null
  ModuleGroups: IModuleGroupDto[]
  NotificationsTableSetting: Array<any>
}

interface ConfigurationStoreInitPayload {
  BaseObjectsColors: { [key: string]: string }
  Dictionaries: Dictionary[]
  VirtualDictionaries: VirtualDictionaries
  EnumDictionaries: IEnumDictionaries
  SystemColors: { [key: string]: string }
  SystemType: number
  ModuleGroups: IModuleGroupDto[]
}

interface ExtendedModule extends IModuleDto {
  moduleGroupID: string
  moduleGroupTitle: string
}

export const useConfigurationStore = defineStore('configuration', {
  state: (): ConfigurationStoreState => {
    return {
      BaseObjectsColors: {},
      Dictionaries: [],
      VirtualDictionaries: {},
      EnumDictionaries: {},
      SystemColors: {},
      SystemType: null,
      ModuleGroups: [],
      NotificationsTableSetting: [],
    }
  },
  getters: {
    modules: (state) => {
      return state.ModuleGroups.reduce((acc, moduleGroup) => {
        const modules = moduleGroup.Modules.map((moduleDTO) => {
          return {
            ...moduleDTO,
            moduleGroupID: moduleGroup.Id,
            moduleGroupTitle: moduleGroup.Title,
          }
        })

        acc.push(...modules)
        return acc
      }, [] as ExtendedModule[])
    },

    moduleIdByObjectType(state) {
      return (type: BaseObjectType) => {
        return this.modules.find((moduleItem) => moduleItem.BaseObjectType === type)?.Id
      }
    },
  },
  actions: {
    async requestConfiguration() {
      const uploadFilesStore = useUploadFilesStore()
      const { data, error } = await GetConfiguration()

      if (data) {
        this.NotificationsTableSetting = data.TableSettings.filter(
          (item) => item.ModuleId === NotificationsModuleId,
        )

        uploadFilesStore.setFileFolders(data.FileFolders)
        sessionStorage.setItem('docServerUrl', data.DocServerUrl)
        sessionStorage.setItem('regKey', data.RegKey)

        data.ModuleGroups.forEach((item) => {
          if (item.Id === 'desktop') {
            item.Modules.forEach((module) => {
              if (module.Id === 'KanbanTasks') {
                sessionStorage.setItem(
                  'desktopKanbanViewCode',
                  module?.KanbanViews[0]?.KanbanViewCode,
                )
              }
            })
          }
        })

        this.init({
          BaseObjectsColors: data.BaseObjectsColors,
          Dictionaries: data.Dictionaries,
          VirtualDictionaries: data.VirtualDictionaries,
          EnumDictionaries: data.EnumDictionaries,
          SystemColors: data.SystemColors,
          SystemType: data.SystemType,
          ModuleGroups: data.ModuleGroups,
        })
      }

      return { data, error }
    },
    init({
      BaseObjectsColors,
      Dictionaries,
      VirtualDictionaries,
      EnumDictionaries,
      SystemColors,
      SystemType,
      ModuleGroups,
    }: ConfigurationStoreInitPayload) {
      this.BaseObjectsColors = BaseObjectsColors
      this.Dictionaries = Dictionaries
      this.VirtualDictionaries = VirtualDictionaries
      this.EnumDictionaries = EnumDictionaries
      this.SystemColors = SystemColors
      this.SystemType = SystemType
      this.ModuleGroups = ModuleGroups

      this.saveConfigurationInLS()
    },
    reset() {
      this.BaseObjectsColors = {}
      this.Dictionaries = []
      this.VirtualDictionaries = {}
      this.SystemColors = {}
    },
    saveConfigurationInLS() {
      try {
        localStorage.setItem(
          LOCALSTORAGE.Configuration,
          JSON.stringify({
            BaseObjectsColors: this.BaseObjectsColors,
            Dictionaries: this.Dictionaries,
            VirtualDictionaries: this.VirtualDictionaries,
            EnumDictionaries: this.EnumDictionaries,
            SystemColors: this.SystemColors,
            ModuleGroups: this.ModuleGroups,
            SystemType: this.SystemType,
          }),
        )
      } catch (e) {
        console.error('Cant save configuration in LocalStorage\n\n', e)
      }
    },
    loadConfigurationFromLS() {
      const configurationValue = localStorage.getItem(LOCALSTORAGE.Configuration)

      if (!configurationValue) return false

      try {
        const configuration = JSON.parse(configurationValue)

        this.init({
          BaseObjectsColors: configuration.BaseObjectsColors,
          Dictionaries: configuration.Dictionaries,
          VirtualDictionaries: configuration.VirtualDictionaries,
          EnumDictionaries: configuration.EnumDictionaries,
          SystemColors: configuration.SystemColors,
          SystemType: configuration.SystemType,
          ModuleGroups: configuration.ModuleGroups,
        })

        return true
      } catch (e) {
        console.error(e)
        return false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useConfigurationStore, import.meta.hot))
}
