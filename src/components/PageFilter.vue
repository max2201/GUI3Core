<template>
  <div class="page-filter" ref="filterRef">
    <div class="page-filter__left-panel">
      <div class="page-filter__search">
        <UiInput1
          clearable
          :model-value="moduleFilter?.SmartFilterValue || ''"
          icon="search"
          icon-position="left"
          placeholder="Поиск..."
          highlight-not-empty
          @update:model-value="onSearch"
        />
      </div>

      <div class="page-filter__toggles">
        <UiButton1
          class="page-filter__filter"
          :class="[
            { '_has-values': moduleFilterHasChanges, 'page-filter__filter--active': filterOpened },
          ]"
          variant="outline"
          icon-left="filter"
          theme="transparent"
          :icon-size="20"
          @click="toggleFilter"
        ></UiButton1>
        <UiButton1
          variant="outline"
          icon-left="close"
          theme="transparent"
          :icon-size="20"
          @click="resetFilter"
        ></UiButton1>
      </div>
    </div>

    <span></span>

    <div class="page-filter__right-panel">
      <template v-if="moduleDatasetMeta.count">
        <div class="page-filter__pagination">
          <UiPagination :value="moduleDatasetMeta" @onChange="paginationSelect" />
        </div>
        <div class="page-filter__perpage">
          <div class="page-filter__perpage-label">Выводить</div>
          <UiSelect1
            :additional-class="['page-filter__perpage-select']"
            :model-value="pageOption"
            :options="perPageOptions"
            @update:model-value="handleSelectPerpage"
          />
        </div>
        <div class="page-filter__total">
          Всего: <span>{{ moduleDatasetMeta.count }}</span>
        </div>
      </template>

      <div class="page-filter__break"></div>

      <div class="page-filter__overlay" :class="[filterOpened && '_visible']" v-if="filterVisible">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import throttle from 'lodash/throttle'
import { onClickOutside } from '@vueuse/core'
import type { ISelect } from '@/core/interface/Ui'
import type { IModuleFilter } from '@/core/interface/Auth'
import type { TableState } from '@/composables/use-table-state'
import { findEventParentWithClass } from '@/core/utils/findEventParentWithClass'
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'

const moduleStore = useModuleStore()
const ui = useUiStore()
const {
  moduleDatasetMeta,
  currentModuleId,
  currentModuleUid,
  moduleFilter,
  moduleFilterHasChanges,
} = storeToRefs(moduleStore)
const { filterOpened } = storeToRefs(ui)

const props = defineProps<{
  fields?: IModuleFilter | null
  tableState?: TableState
}>()

const filterRef = ref(null)
onClickOutside(filterRef, (event): void => {
  const foundParentWithStopClass = findEventParentWithClass(event, StopClickOutsideClasses.filter)

  if (foundParentWithStopClass) {
    return
  }
  ui.setFilter(false)
})

const onSearch = throttle(
  (v: string) => {
    if (moduleFilter.value) {
      moduleFilter.value.SmartFilterValue = v
      moduleStore.getModuleDataset()
    }
  },
  500,
  { leading: false, trailing: true },
)

// perpage
const handleSelectPerpage = async (v: ISelect) => {
  moduleDatasetMeta.value.page = 1
  moduleDatasetMeta.value.limit = +v.value

  await moduleStore.getModuleDataset()
}

// pagination
const paginationSelect = async (page: number) => {
  moduleDatasetMeta.value.page = page

  await moduleStore.getModuleDataset()
}

//filter
const toggleFilter = () => {
  ui.setFilter(!filterOpened.value)
}

const resetFilter = () => {
  moduleStore.resetFilter()
  ui.setFilter(false)
  moduleStore.getModuleDataset()
}

const filterVisible = ref(false)

const updateFilter = () => {
  filterVisible.value = false
  nextTick(() => {
    filterVisible.value = true
  })
}

const perPageOptions = computed(() => props.tableState?.perPageOptions.value || [])
const pageOption = computed(() => {
  return perPageOptions.value.find((option) => option.value === moduleDatasetMeta.value.limit)
})

watch(
  () => [currentModuleId.value, currentModuleUid.value],
  () => {
    updateFilter()
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
.page-filter {
  position: relative;
  display: grid;
  grid-template-columns: minmax(auto, 512px) auto minmax(auto, 512px);
  grid-template-rows: 1fr;
  align-items: center;
  margin: 20px 0 8px;

  &__left-panel {
    display: grid;
    grid-template-columns: auto 64px;
  }

  &__right-panel {
    display: flex;
    align-items: center;
    justify-content: right;
    gap: 20px;
  }

  &__search {
    margin-right: 8px;
    min-width: 240px;
  }

  &__toggles {
    margin-right: auto;
    display: flex;
    align-items: center;
    gap: 4px;

    .svg-icon {
      font-size: var(--font-size-24);
    }
  }

  &__filter {
    &._has-values {
      &::after {
        display: inline-block;
        content: ' ';
        position: absolute;
        z-index: 2;
        top: 3px;
        right: 3px;
        width: 7px;
        height: 7px;
        background: #f8393a;
        border-radius: 50%;
      }
    }

    &--active {
      color: var(--input-hover-background-color) !important;
      border-color: #b6d5ed !important;
      background: var(--component-blue-background);
    }
  }

  &__total {
    display: flex;
    gap: 3px;
    width: max-content;
    padding: 0 0px;
    font-size: var(--font-size-14);

    span {
      font-weight: var(--font-weight-600);
    }
  }

  &__pagination {
  }

  &__perpage {
    display: flex;
    align-items: center;

    &-select {
      min-width: 120px;
    }
  }

  &__perpage-label {
    font-size: var(--font-size-14);
    margin-right: 10px;
  }

  &__break {
    display: none;
  }

  &__overlay {
    position: absolute;
    z-index: 7;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: white;
    box-shadow: var(--box-shadow-large);
    border-radius: 0px 0px 5px 5px;
    opacity: 0;
    pointer-events: none;
    will-change: filter;
    transition:
      opacity 0.25s $ease,
      transform 0.25s $ease;
    transform: translateY(5px);

    &._visible {
      opacity: 1;
      pointer-events: all;
      transform: none;
    }
  }
}

@include r(1280) {
  .page-filter {
    grid-template-columns: minmax(auto, 320px) auto minmax(auto, 512px);
    grid-template-rows: 1fr;

    &__pagination {
      padding-right: 6px;
    }

    &__settings {
      margin-left: 0;
      padding-right: 20px;
    }
  }
}

@include r(1120) {
  .page-filter {
    grid-template-columns: auto;
    grid-template-rows: 1fr 1fr;

    &__pagination {
      padding-right: 6px;
    }

    &__settings {
      margin-left: 0;
      padding-right: 20px;
    }
  }
}

// .page-filter :deep(.input._modified .input__label ) {
//   color: var(--color-red) !important;
// }
// .page-filter :deep(.select._modified .select__label) {
//   color: var(--color-red);
// }
</style>
