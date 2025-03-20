export const useUiStore = defineStore('ui', {
  state: () => {
    return {
      sidebarOpened: false,
      filterOpened: false,
      mobileMenuOffset: 0,
      modal: [] as string[],
      modalParams: null as {
        [key: string]: any
      } | null,
    }
  },
  actions: {
    setSidebar(opened: boolean) {
      this.sidebarOpened = opened
    },
    setFilter(opened: boolean) {
      this.filterOpened = opened
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
}
