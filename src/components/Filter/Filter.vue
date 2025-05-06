<template>
  <div class="filter" v-if="filter">
    <div class="filter-col">
      <h3 class="mb-4">Мои шаблоны</h3>
      <div
        v-for="(key, value) in savedFilters"
        :key="key"
        :class="[
          'saved-filtes__item',
          { 'saved-filtes__item_active': String(currentSavedFilter) === String(value) },
        ]"
        @click="() => handleSetSavedFilter(value)"
      >
        <span>
          {{ key }}
        </span>

        <SvgIcon
          v-if="String(value) !== '-1'"
          class="saved-filtes__item__delete"
          name="close"
          @click="() => handleDeletedSavedFilter(value)"
        />
      </div>
    </div>
    <div class="filter-col row">
      <!-- col -->
      <div class="col filter__col">
        <FilterFields
          :filter="customFilter && localFilterData ? localFilterData : filter"
          :showAdditionalFields="showAdditionalFields"
          @update-filter-values="localFilterData = $event"
        />

        <!-- actions -->
        <FilterActions
          :showAdditional="!!filter.SecondaryFields.length"
          :showAdditionalFields="showAdditionalFields"
          :is-saved-filter="isSavedFilter"
          class="filter__actions"
          @save="handleSave"
          @reset="customFilter ? emitReset() : handleReset()"
          @submit="customFilter ? emitSubmit() : handleSubmit()"
          @toggle-more-filters="toggleMoreFilters"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IModuleFilter } from '@/core/interface/Auth'
import type { IModuleSavedFilters } from '@/core/interface/Module'
import { unref } from 'vue'
import { cloneDeep } from 'lodash'

const props = defineProps<{
  filter?: IModuleFilter | null
  savedFilters?: IModuleSavedFilters | undefined
  customFilter?: boolean
}>()

const { showAdditionalFields, toggleMoreFilters, handleReset, handleSubmit } = useFilter()

const emit = defineEmits([
  'save',
  'set-saved-filter',
  'delete-saved-filter',
  'submit-filter',
  'reset-filter',
])
const ui = useUiStore()

const moduleStore = useModuleStore()
const { currentSavedFilter, moduleFilterHasChanges } = storeToRefs(moduleStore)

const isSavedFilter = computed(() => {
  return String(unref(currentSavedFilter)) !== '-1' && !unref(moduleFilterHasChanges)
})

const localFilterData = ref<IModuleFilter | null | undefined>(null)
watch(
  () => props.filter,
  () => {
    localFilterData.value = cloneDeep(props.filter)
  },
  { deep: true, immediate: true },
)
const emitReset = () => {
  emit('reset-filter')
  ui.setFilter(false)
}
const emitSubmit = () => {
  emit('submit-filter', localFilterData.value)
  ui.setFilter(false)
}

const handleSave = (value: string) => {
  emit('save', value)
  ui.setFilter(false)
}

const handleSetSavedFilter = (filterId: string | number) => {
  emit('set-saved-filter', filterId)
  ui.setFilter(false)
}

const handleDeletedSavedFilter = (filterId: string | number) => {
  emit('delete-saved-filter', filterId)
  ui.setFilter(false)
}
</script>

<style lang="scss" scoped>
.filter {
  padding: 24px 10px 20px;
  display: grid;
  grid-template-columns: 270px auto;

  &__section-title {
    font-weight: var(--font-weight-600);
    font-size: var(--font-size-14);
    line-height: 1.3;
    color: var(--color-font-2);
  }

  .filter-col {
    padding: 0 20px;

    &:not(:last-child) {
      border-right: 1px solid var(--color-border);
    }
  }

  &__col {
    position: relative;
    flex: 1 1 auto;

    &::after {
      display: inline-block;
      content: ' ';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 1px;
      background: var(--color-border);
    }

    &:last-child::after {
      display: none;
    }
  }

  .saved-filtes__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 48px;
    border-bottom: 1px solid var(--color-border);
    padding: 0 1rem;

    &__delete {
      display: none;

      &:hover {
        cursor: pointer;
        color: var(--color-primary-hover);
      }
    }

    &_active {
      background-color: var(--color-primary-selected);

      .saved-filtes__item__delete {
        display: inline;
      }
    }

    &:hover {
      cursor: pointer;
    }

    &:hover .saved-filtes__item__delete {
      display: inline;
    }
  }
}
</style>
