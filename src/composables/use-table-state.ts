export interface TableState {
  batchEditing: Ref<Boolean>
  selectedBatchIds: Ref<number[]>
  hoveredRowId: Ref<number | null>
  expandedRowIds: Ref<number[]>
  perPageOptions: Ref<Array<{ label: string; value: number }>>
  toggleBatchEditing: (v: boolean) => void
  toggleSelectedBatchIds: (id: number) => void
  toggleSelectedBatchId: (id: number) => void
  selectedAllBatchIds: (ids: number[]) => void
  setGroupOperation: (name: string) => void
  toggleExpanded: (id: number) => void
  reset: () => void
}

export const useTableState = (): {
  toggleSelectedBatchIds: (id: number) => void
  toggleExpanded: (id: number) => void
  setGroupOperation: (name: string) => void
  reset: () => void
  selectedBatchIds?: any
  toggleSelectedBatchId: (id: number) => void
  expandedRowIds: any
  toggleBatchEditing: (v: boolean) => void
  batchEditing: any
  hoveredRowId: any
  perPageOptions: any
  groupOperation: any
} => {
  const batchEditing = ref(false)
  const selectedBatchIds = ref<number[]>([])
  const hoveredRowId = ref<number | null>(null)
  const expandedRowIds = ref<number[]>([])
  const groupOperation = ref<string>('')
  // filter
  const perPageOptions = computed(() => {
    return [
      { label: 'по 50', value: 50 },
      { label: 'по 100', value: 100 },
      { label: 'по 200', value: 200 },
      { label: 'по 500', value: 500 },
      { label: 'по 1000', value: 1000 },
    ]
  })

  const toggleBatchEditing = (v: boolean) => {
    selectedBatchIds.value = []
    batchEditing.value = v
  }
  const setGroupOperation = (name: string) => {
    groupOperation.value = name
  }
  const toggleSelectedBatchIds = (id: number) => {
    const update = toggleArray(selectedBatchIds.value, id)
    selectedBatchIds.value = update
  }
  const toggleSelectedBatchId = (id: number) => {
    console.log(id)
    if (selectedBatchIds.value.includes(id)) {
      selectedBatchIds.value = []
      return
    }
    selectedBatchIds.value = [id]
  }
  const toggleExpanded = (id: number) => {
    const update = toggleArray(expandedRowIds.value, id)
    expandedRowIds.value = update
  }
  const selectedAllBatchIds = (ids: number[]) => {
    selectedBatchIds.value = ids
  }

  const reset = () => {
    expandedRowIds.value = []
    selectedBatchIds.value = []
    batchEditing.value = false
    hoveredRowId.value = null
    groupOperation.value = ''
  }

  EventBus.on(GlobalEvents.ModuleDataChanged, () => {
    reset()
  })

  return {
    batchEditing,
    selectedBatchIds,
    hoveredRowId,
    expandedRowIds,
    perPageOptions,
    groupOperation,
    toggleBatchEditing,
    toggleSelectedBatchIds,
    toggleExpanded,
    selectedAllBatchIds,
    toggleSelectedBatchId,
    setGroupOperation,
    reset,
  }
}
