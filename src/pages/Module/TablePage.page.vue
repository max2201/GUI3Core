<template>
  <div class="table-page">
    <div class="table-page__wrapper">
      <div class="table-page__body">
        <PageFilter :filter="filterFields" :table-state="localTableState">
          <Filter
            :filter="moduleFilter"
            :saved-filters="moduleSavedFilters"
            @save="handleSaveFilter"
            @set-saved-filter="handleSetSavedFilter"
            @delete-saved-filter="handleDeleteSavedFilter"
          />
        </PageFilter>

        <Table
          v-if="moduleDatasetSnapshot.length"
          :table-state="localTableState"
          :dataset-snapshot="moduleDatasetSnapshot"
          :dataset-meta="moduleDatasetMeta"
          :dataset="moduleDataset"
          :available-group-actions="moduleGroupActions"
          :has-action-cell="true"
          sticky-cell
          @click-header-cell="sortColumn"
          @dblclick-row="openWindowManger"
          @click-group-action="handleGroupAction"
        />
        <UiLoader :loading="moduleDatasetFetching" theme="page" />
      </div>

      <div class="table-page__sidepanel">
        <component :is="ModuleCompontent?.sidepanel" v-if="ModuleCompontent?.sidepanel" />
        <TableSidebar v-else />
        <div class="dev-fps" :class="[fps < 30 && '_warn']">{{ fps }}</div>
      </div>
    </div>

    <modal-group-operation :object="groupActionResult"></modal-group-operation>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { useFps } from '@vueuse/core'
import type { IModuleDto, IModuleGroupOperations } from '@/core/interface/Module'
import { useModuleLoader } from '@/composables/module-loader'
import type { ITableCellHead } from '@/core/interface/Table'
import { useTableState } from '@/composables/use-table-state'
import { createObjectInstance } from '@/core/services/createObjectInstance'
import { GroupOperationResult } from '@/core/constants/ModalsNames'

const props = defineProps<{ module: IModuleDto }>()

const moduleStore = useModuleStore()
const authStore = useAuthStore()
const {
  moduleDatasetSnapshot,
  moduleDataset,
  moduleDatasetMeta,
  moduleDatasetFetching,
  moduleFilter,
  moduleSavedFilters,
  moduleGroupActions,
} = storeToRefs(moduleStore)

const groupActionResult = ref<IModuleGroupOperations>()
const fps = useFps()

const { routeModuleId, routeModuleUid, ModuleCompontent } = useModuleLoader()

const filterFields = computed(() => {
  const currentModule = authStore.getUserModule(routeModuleId.value, routeModuleUid.value)
  return currentModule?.Filter
})

const currentModule = computed(() => {
  return authStore.getUserModule(routeModuleId.value, routeModuleUid.value)
})

const handleSaveFilter = (filterName: string) => {
  moduleStore.saveFilter(filterName)
}

const handleSetSavedFilter = (filterId: string | number) => {
  moduleStore.setSavedFilter(filterId)
}

const handleDeleteSavedFilter = (filterId: string | number) => {
  moduleStore.deleteSavedFilter(filterId)
}
const handleGroupAction = async (IsCodeConfirmation: boolean) => {
  if (IsCodeConfirmation) {
    const isConfirmed = await sharedModals.confirmByCode()
    if (isConfirmed) {
      await handleConfirmCodeGroupAction()
    } else return
  } else {
    await handleConfirmCodeGroupAction()
  }
}
const handleConfirmCodeGroupAction = async () => {
  const data = await moduleStore.sendGroupOperation(
    localTableState.groupOperation.value,
    localTableState.selectedBatchIds.value,
  )
  if (data) {
    groupActionResult.value = data
    sharedModals.setModal({
      name: GroupOperationResult,
    })
    await moduleStore.getModuleDataset()
  }
}

onMounted(() => {
  moduleStore.getPageData()
})

const route = useRoute()

const localTableState = useTableState()

watch(
  () => currentModule.value,
  (newModule) => {
    _.defer(() => {
      const { id, sid } = route.params
      const foundModule = moduleStore.getCurrentModule(id as string, sid as string)
      if (foundModule && foundModule.IsTableModule) {
        moduleStore.getPageData()
        localTableState.reset()
      }
    })
  },
)

const sharedModals = useSharedModalsStore()
const windowStore = useWindowStore()

const openWindowManger = async (item: any) => {
  const currentModule = moduleStore.findModuleById(routeModuleId.value) as IModuleDto

  const object = createObjectInstance(item.id, currentModule.BaseObjectType)
  await object.loadData()
  windowStore.addTab({
    id: object.id,
    title: object.rawData?.WindowTitle,
    type: object.type,
    data: object.rawData,
    object,
  })
}

const sortColumn = async (item: ITableCellHead) => {
  if (!item.sort) {
    return
  }

  const direction =
    moduleDatasetMeta.value.sort.id === item.id
      ? moduleDatasetMeta.value.sort.dir === 'ASC'
        ? 'DESC'
        : 'ASC'
      : item.sortDir || moduleDatasetMeta.value.sort.dir

  moduleStore.changeDatasetSorting(item.id, direction)

  await moduleStore.getModuleDataset()
}
</script>

<style lang="scss" scoped>
.table-page {
  position: relative;
  display: grid;
  grid-template-columns: calc(100vw - 60px);
  grid-template-rows: 1fr;
  overflow: auto;

  &__wrapper {
    display: grid;
    grid-template-columns: calc(100vw - 130px) 70px;
    grid-template-rows: 1fr;
    overflow: auto;
  }

  &__body {
    position: relative;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 70px auto;
    overflow: auto;
    padding: 0 20px;
  }

  &__sidepanel {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 5;
    bottom: 0;
    min-width: var(--sidepanel-width);
  }
}

@include r(1120) {
  .table-page__body {
    grid-template-rows: 102px auto;
  }
}

.dev-fps {
  position: fixed;
  bottom: 16px;
  right: 16px;
  padding: 4px 6px;
  font-size: var(--font-size-14);
  font-weight: 700;
  color: white;
  background: var(--color-font);
  opacity: 0.9;
  border-radius: 0.25em;

  &._warn {
    background: var(--color-red);
  }
}
</style>
