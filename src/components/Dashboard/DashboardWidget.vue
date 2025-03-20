<template>
  <div class="dashboard-widget">
    <UiLoader :loading="loading" theme="page" />
    <h4 class="dashboard-widget__name">
      {{ widget.Name }}
    </h4>

    <div class="dashboard-widget__values" v-if="widget.CurrentValue">
      <div class="dashboard-widget__current-value" :title="widget.CurrentValue.Detailing">
        <span>
          {{ currentValue.value }}
        </span>
        <span v-if="currentValue.rest" class="dashboard-widget__current-value-rest">
          {{ `,${currentValue.rest}` }}
        </span>
        <span v-if="currentValue.measure" class="dashboard-widget__current-value-measure">
          {{ ` ${currentValue.measure}` }}
        </span>
      </div>
      <VDropdown
        v-if="previousValue.value"
        placement="right"
        :distance="5"
        :title="widget.PreviousValue.Detailing"
        :triggers="[]"
        ref="diffDropdownRef"
        :shown="isDiffDropdownOpen"
        :autoHide="false"
      >
        <div
          class="dashboard-widget__previous-value"
          @contextmenu.prevent="isDiffDropdownOpen = true"
        >
          <span>{{ previousValue.value }}</span>
          <span v-if="previousValue.rest" class="dashboard-widget__previous-value-rest">
            {{ `,${previousValue.rest}` }}
          </span>
          <span v-if="previousValue.measure" class="dashboard-widget__previous-value-measure">
            {{ ` ${previousValue.measure}` }}
          </span>
        </div>
        <template #popper>
          <div class="dashboard-widget__dropdown">
            <div class="dashboard-widget__dropdown-header">Представление сравнения</div>
            <ul class="dashboard-widget__dropdown-list">
              <li
                v-close-popper
                class="dashboard-widget__dropdown-list-item"
                :class="{
                  'dashboard-widget__dropdown-list-item--active': key == widget.DiffViewType,
                }"
                v-for="(value, key) in widget.AppliableDiffViewType"
                :key="key"
                @click="setNewDiffViewType(String(key))"
              >
                {{ value }}
              </li>
            </ul>
          </div>
        </template>
      </VDropdown>
    </div>

    <VDropdown
      v-if="widget.GroupDetails?.length"
      placement="right"
      :distance="5"
      :triggers="[]"
      ref="groupingDropdownRef"
      :shown="isGroupingDropdownOpen"
      :autoHide="false"
    >
      <div class="dashboard-widget__fields" @contextmenu.prevent="isGroupingDropdownOpen = true">
        <div
          v-for="(field, index) in widget.GroupDetails"
          :key="index"
          class="dashboard-widget__field"
        >
          <div class="dashboard-widget__field-title" :title="field.Title">
            {{ field.Title }}
          </div>

          <div class="dashboard-widget__field-value">
            {{ field.Value }}
          </div>
        </div>
      </div>
      <template #popper>
        <div class="dashboard-widget__dropdown">
          <div class="dashboard-widget__dropdown-header">Детализация значений (группировка)</div>
          <ul class="dashboard-widget__dropdown-list">
            <li
              class="dashboard-widget__dropdown-list-item"
              :class="{
                'dashboard-widget__dropdown-list-item--active': String(key) == widget.GroupField,
              }"
              v-for="(value, key) in widget.AppliableGrouping"
              :key="key"
              @click="setNewGrouping(String(key))"
              v-close-popper
            >
              {{ value }}
            </li>
          </ul>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<script setup lang="ts">
import type { MetricWidgetDto } from '@/core/interface/Dashboard'
import { SystemColorsValue } from '@/core/constants/SystemColors'
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  widget: MetricWidgetDto
  loading?: boolean
}>()

const emit = defineEmits(['update:grouping', 'update:diffViewType'])

const setNewGrouping = (groupField: string) => {
  emit('update:grouping', groupField)
}
const setNewDiffViewType = (diffViewType: string) => {
  emit('update:diffViewType', diffViewType)
}
const isDiffDropdownOpen = ref(false)
const diffDropdownRef = ref(null)
onClickOutside(diffDropdownRef, () => {
  isDiffDropdownOpen.value = false
})
const isGroupingDropdownOpen = ref(false)
const groupingDropdownRef = ref(null)
onClickOutside(groupingDropdownRef, () => {
  isGroupingDropdownOpen.value = false
})

const currentValue = computed(() => {
  if (props.widget.CurrentValue?.Value) {
    const [value, addition] = props.widget.CurrentValue.Value.split(',')
    if (addition) {
      const [rest, measure] = addition.split(' ')
      return { value: value.trim() || '', rest, measure }
    }
    return { value: value || '' }
  }
  return { value: '' }
})
const previousValue = computed(() => {
  if (props.widget.PreviousValue?.Value) {
    const [value, addition] = props.widget.PreviousValue.Value.split(',')
    if (addition) {
      const [rest, measure] = addition.split(' ')
      return { value: value || '', rest, measure }
    }
    return { value: value || '' }
  }
  return { value: '' }
})

const colors = computed(() => {
  return {
    currentValue:
      props.widget.CurrentValue && !props.widget.PreviousValue
        ? getSystemColor(props.widget.CurrentValue.SystemColor as SystemColorsValue)?.primary || ''
        : '',
    previousValue: props.widget.PreviousValue
      ? getSystemColor(props.widget.PreviousValue.SystemColor as SystemColorsValue)?.primary || ''
      : '',
  }
})
</script>

<style lang="scss" scoped>
.dashboard-widget {
  position: relative;
  display: flex;
  flex-direction: column;
  height: min-content;
  background-color: var(--component-background);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px 0 #273f530f;

  &__dropdown {
    &-header {
      padding: 16px;
      border-bottom: 1px solid var(--color-border);
      font-weight: var(--font-weight-500);
      font-size: var(--font-size-14);
      line-height: 18.2px;
      color: var(--color-font-2);
    }

    &-list {
      padding: 12px 0;
      display: flex;
      flex-direction: column;
      gap: 1px;

      &-item {
        font-weight: var(--font-weight-400);
        font-size: var(--font-size-14);
        line-height: 18.2px;
        color: var(--color-font-2);
        padding: 8px 16px;
        cursor: pointer;

        &:hover {
          background: var(--color-background);
        }

        &--active {
          background: var(--color-bg-active-10alpha);
        }
      }
    }
  }

  &__name {
    color: var(--color-gray);
    margin-bottom: 20px;
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-14);
    line-height: 18.2px;
  }

  &__values {
    display: flex;
    flex-direction: column;
    gap: 3px;
    align-items: flex-start;
  }

  &__current-value {
    font-weight: var(--font-weight-600);
    font-size: 30px;
    line-height: 39px;
    color: v-bind('colors.currentValue');

    &-rest {
      color: var(--color-gray);
      font-size: var(--font-size-24);
      font-weight: var(--font-weight-400);
    }

    &-measure {
      color: var(--color-gray);
      font-weight: var(--font-weight-400);
    }
  }

  &__previous-value {
    cursor: pointer;
    font-weight: var(--font-weight-600);
    font-size: 16px;
    line-height: 20.8px;
    color: v-bind('colors.previousValue');

    &-measure {
      color: var(--color-gray);
      font-weight: var(--font-weight-400);
    }
  }

  &__fields {
    max-height: 118px;
    overflow: hidden;
    overflow-y: auto;
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    cursor: pointer;

    &::-webkit-scrollbar {
      background-color: var(--component-background) !important;
    }

    &::-webkit-scrollbar-track {
      background: var(--component-background) !important;
    }

    &::-webkit-scrollbar-thumb {
      border-color: var(--component-background) !important;
    }
  }

  &__field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    padding: 2px 4px;

    &-title {
      font-family: Inter;
      font-weight: var(--font-weight-400);
      font-size: var(--font-size-14);
      line-height: 18px;
      color: var(--color-font);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    &-value {
      white-space: nowrap;
      font-family: Roboto Mono;
      font-weight: var(--font-weight-500);
      font-size: var(--font-size-14);
      line-height: 18px;
      color: var(--color-font);
    }
  }
}
</style>
