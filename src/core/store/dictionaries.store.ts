import type { IAvailableDictionary } from '@/core/interface/Auth'
import { toRaw, unref } from 'vue'

export const useDictionariesStore = defineStore('dictionaries', () => {
  const authStore = useAuthStore()
  const configurationStore = useConfigurationStore()

  const allModules = computed(() => {
    return configurationStore.ModuleGroups.reduce((acc, moduleGroup) => {
      acc.push(...moduleGroup.Modules)
      return acc
    }, [])
  })

  const allModulesById = computed(() => {
    return allModules.value.reduce((acc, module) => {
      if (!acc[module.Id]) {
        acc[module.Id] = module
      }

      return acc
    }, {})
  })

  const dictionariesByBaseObjectType = computed(() => {
    return authStore.user?.AvailableModules.reduce((acc, module) => {
      const baseObjectType = allModulesById.value[unref(module).Id]?.BaseObjectType

      if (!baseObjectType) return acc

      if (!acc[baseObjectType]) {
        acc[baseObjectType] = []
      }

      const moduleDictionariesByCode = module.AvailableDictionaries.reduce((acc, dict) => {
        acc[dict.Code] = dict
        return acc
      }, {})

      Object.assign(acc[baseObjectType], moduleDictionariesByCode)

      return acc
    }, {})
  })

  return {
    dictionariesByBaseObjectType,
  }
})
