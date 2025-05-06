import { AddObjectToFavorites, DelObjectFromFavorites } from '../api/object.api'
import type { FavoriteModule, FavoriteObject } from '../interface/Auth'
import type { IObjectDto } from '../interface/Object'
import type { Layout } from 'grid-layout-plus'

interface DashboardStoreState {
  FavoritesModules: FavoriteModule[]
  FavoritesObjects: FavoriteObject[]
}

interface DashboardStoreInitPayload {
  FavoritesModules: FavoriteModule[]
  FavoritesObjects: FavoriteObject[]
  DashboardLayout?: Layout
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): {
    showNotifications: boolean
    FavoritesModules: FavoriteModule[]
    FavoritesObjects: any[]
  } => {
    return {
      FavoritesModules: [],
      FavoritesObjects: [],
      showNotifications: false,
    }
  },
  getters: {
    isFavoriteModule: (state) => {
      return (FullViewId: string) => {
        return Boolean(
          state.FavoritesModules.find((favModuleID) => favModuleID.FullViewId === FullViewId),
        )
      }
    },
    favoriteObjects(state) {
      return state.FavoritesObjects
    },
  },
  actions: {
    init({ FavoritesModules, FavoritesObjects, DashboardLayout }: DashboardStoreInitPayload) {
      this.FavoritesModules = FavoritesModules
      this.FavoritesObjects = FavoritesObjects.reverse()
      if (DashboardLayout !== null) {
        localStorage.setItem(LOCALSTORAGE.DashboardLayout, JSON.stringify(DashboardLayout))
      }

      this.saveDashboardSettingsToLS()
    },
    reset() {
      this.FavoritesModules = []
      this.FavoritesObjects = []
    },
    saveDashboardSettingsToLS() {
      localStorage.setItem(LOCALSTORAGE.FavoritesModules, JSON.stringify(this.FavoritesModules))
      localStorage.setItem(LOCALSTORAGE.FavoriteObjects, JSON.stringify(this.FavoritesObjects))
    },
    loadDashboardSettingsFromLS() {
      const favModulesValue = localStorage.getItem(LOCALSTORAGE.FavoritesModules)

      if (favModulesValue) {
        try {
          const FavoritesModules = JSON.parse(favModulesValue)
          this.FavoritesModules = FavoritesModules
        } catch (e) {
          console.error(e)
        }
      }

      const favObjectsValue = localStorage.getItem(LOCALSTORAGE.FavoriteObjects)

      if (favObjectsValue) {
        try {
          const FavoriteObjects: FavoriteObject[] = JSON.parse(favObjectsValue)
          this.FavoritesObjects = FavoriteObjects.reverse()
        } catch (e) {
          console.error(e)
        }
      }
    },
    updateFavoriteModules(newFavoriteModules: FavoriteModule[]) {
      this.FavoritesModules = [...newFavoriteModules]
      this.saveDashboardSettingsToLS()
    },
    updateFavoriteObjects(newFavoriteObjects: FavoriteObject[]) {
      this.FavoritesObjects = [...newFavoriteObjects].reverse()
      this.saveDashboardSettingsToLS()
    },
    async addObjectToFavorites(moduleId: string, object: IObjectDto) {
      const { data } = await AddObjectToFavorites(moduleId, {
        Id: object.BaseObjectId,
        BaseObjectType: object.BaseObjectType,
        BaseObjectName: object.BaseObjectName,
        BaseObjectDate: object.BaseObjectDate,
      })

      if (data) {
        this.updateFavoriteObjects(data)
      }
    },
    async removeObjectFromFavorites(moduleId: string, objectId: number) {
      const favObject = this.FavoritesObjects.find((o) => o.Object.Id === objectId)

      if (!favObject) return

      const { data } = await DelObjectFromFavorites(moduleId, {
        Id: favObject.Object.Id,
        BaseObjectType: favObject.Object.BaseObjectType,
        BaseObjectName: favObject.Object.BaseObjectName,
        BaseObjectDate: favObject.Object.BaseObjectDate,
      })

      if (data) {
        this.updateFavoriteObjects(data)
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDashboardStore, import.meta.hot))
}
