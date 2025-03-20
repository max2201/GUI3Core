export const useFilter = () => {
  const moduleStore = useModuleStore()
  const ui = useUiStore()

  const showAdditionalFields = ref(false)
  const toggleMoreFilters = () => {
    showAdditionalFields.value = !showAdditionalFields.value
  }

  const handleReset = async () => {
    moduleStore.resetFilter()
    await moduleStore.getModuleDataset()
    ui.setFilter(false)
  }

  const handleSubmit = async () => {
    await moduleStore.getModuleDataset()
    ui.setFilter(false)
  }

  return { showAdditionalFields, toggleMoreFilters, handleReset, handleSubmit }
}
