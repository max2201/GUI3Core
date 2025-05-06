import { AuthLogin, AuthRecover, AuthLogout, ChangeUserFilial } from '@/core/api/auth.api'
import type { IUserProfileDto } from '@/core/interface/Auth'
import type { ILoginPayload, IRecoverPayload } from '@/core/api/auth.api'
import { unref } from 'vue'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const moduleStore = useModuleStore()
    const dashboardStore = useDashboardStore()
    const configurationStore = useConfigurationStore()

    const user = ref(null) as Ref<IUserProfileDto | null>

    const isAuthenticated = ref(false)
    const setAuthenticated = (value: boolean) => {
      isAuthenticated.value = value
    }

    const isHasUserData = computed(() => {
      return user.value !== null
    })

    const userModuleNames = computed(() => {
      const moduleDto = user.value?.AvailableModules
      return moduleDto ? moduleDto.map((x) => x.Id) : []
    })

    // Возвращает с учетом вкеладок (массив)
    const userModules = computed(() => {
      return user.value?.AvailableModules.filter((x) => x.Id === moduleStore.currentModuleId)
    })

    const userAvailableCreationOperations = computed(() => {
      return user.value?.AvailableCreationOperations || []
    })

    // Возвращает конкретный модуль (обьект)
    const getUserModule = (id: string, viewId?: string) => {
      const userModules = unref(user)?.AvailableModules.filter((x) => x.Id === id)

      if (viewId && userModules?.length) {
        const guiModule = userModules.find((x) => x.ViewId === viewId)

        return guiModule || userModules[0]
      } else if (userModules?.length) {
        return userModules[0]
      }

      return null
    }

    async function login(req: ILoginPayload) {
      const { data, error } = await AuthLogin(req)

      if (!data?.UserProfile) {
        const customError = { message: 'Ошибка авторизации' }

        return { data, error: customError }
      }

      isAuthenticated.value = true
      user.value = { ...data.UserProfile }

      localStorage.removeItem(LOCALSTORAGE.Modules)
      localStorage.removeItem(LOCALSTORAGE.Configuration)
      localStorage.removeItem(LOCALSTORAGE.FavoritesModules)
      localStorage.removeItem(LOCALSTORAGE.DashboardLayout)

      await moduleStore.init()
      dashboardStore.init({
        FavoritesModules: data.UserProfile?.AdditionalSettings?.FavoritesModulesNew || [],
        FavoritesObjects: data.UserProfile?.AdditionalSettings?.FavoritesObjects || [],
        DashboardLayout: data.UserProfile?.AdditionalSettings?.LayoutItems || null,
      })

      return { data, error }
    }

    async function recover(req: IRecoverPayload) {
      // eslint-disable-next-line prefer-const
      let { data, error } = await AuthRecover(req)

      if (data?.UserProfile) {
        user.value = { ...data.UserProfile }
      } else {
        error = {
          message: 'Ошибка авторизации',
        }
      }

      if (error) {
        useCatchError({ error })
      }

      return { data, error }
    }

    const clear = () => {
      user.value = null
      isAuthenticated.value = false
      // @ts-ignore
      moduleStore.resetDataset()
      dashboardStore.reset()
      configurationStore.reset()
    }

    async function logout() {
      const { data, error } = await AuthLogout()

      clear()
      router.push('/auth')

      return { data, error }
    }

    async function changeFilial(id: number) {
      const CurrentFilial = user.value?.AviableFilials.find((x) => x.ID === id)
      if (!user.value || !CurrentFilial) {
        return {
          data: null,
          error: 'Не найдено',
        }
      }

      const { data, error } = await ChangeUserFilial({ LongParamValue: id })

      if (data) {
        user.value.CurrentFilial = CurrentFilial?.ID
        user.value.CurrentFilialTitle = CurrentFilial?.Title
      }

      return { data, error }
    }

    return {
      user,
      userModuleNames,
      userModules,
      getUserModule,
      userAvailableCreationOperations,
      isHasUserData,
      isAuthenticated,
      setAuthenticated,
      login,
      recover,
      clear,
      logout,
      changeFilial,
    }
  },
  {
    persist: {
      pick: ['user'],
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
