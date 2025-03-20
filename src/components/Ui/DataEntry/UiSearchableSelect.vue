<template>
  <div
    class="searchable-select"
    :class="[
      { 'has-error': error },
      theme,
      multiple && 'is-multiple',
      value && 'has-value',
      hasModified && '_modified',
    ]"
  >
    <label v-if="selectLabel" :for="id" class="searchable-select__label">
      {{ getLabel }}
    </label>

    <div ref="containerRef" class="searchable-select__wrapper">
      <vue-select
        v-model="valueModel"
        v-bind="$attrs"
        ref="vueselect"
        :id="id"
        :options="options"
        :error="error"
        :placeholder="placeholder"
        :multiple="multiple"
        :closeOnSelect="!multiple"
        :deselectFromDropdown="multiple"
        :label="optionValueKey || optionLabelKey"
        searchable
        @option:selected="setSelected"
        @option:deselected="setDeselected"
        @update:modelValue="onUpdateModelValue"
        @search="onSearch"
      >
        <template #open-indicator="{ attributes }">
          <span v-bind="attributes">
            <SvgIcon :width="24" :height="24" name="chevron-down" />
          </span>
        </template>

        <template #option="item">
          <div class="searchable-select__option">
            <UiCheckbox1 v-if="multiple" :checked="false" />
            {{ item[optionLabelKey] || item.label || item }}
          </div>
        </template>

        <template #selected-option-container="{ option }">
          <div
            class="vs__selected"
            :class="[multiple && 'multiple']"
            @click="onClickSelectedItem(option)"
          >
            {{ option[optionLabelKey] || option.label || option }}
          </div>
        </template>

        <template #no-options="{}">
          <span>Не найдено</span>
        </template>
      </vue-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, unref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { nanoid } from 'nanoid'

// @ts-ignore
import VueSelect from 'vue-select'
import type { ISelect } from '@/core/interface/Ui'

const id = nanoid()

defineComponent(VueSelect)

const emit = defineEmits(['onSelect', 'search'])
const containerRef = ref(null)
const vueselect = ref<any>(null)

const props = defineProps({
  value: {
    type: Object,
    required: false,
    default() {
      return null
    },
  },
  options: {
    type: Array,
    required: true,
    default() {
      return []
    },
  },
  optionValueKey: {
    type: String,
    default: 'label',
  },
  optionLabelKey: {
    type: String,
    default: 'label',
  },
  selectLabel: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
    default: 'Выберите',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    required: false,
  },
  error: {
    type: [String, Array],
    required: false,
  },
  hasModified: {
    type: Boolean,
    default: false,
  },
})

const valueModel = ref(props.value)

watch(
  () => props.value,
  (newValue) => {
    if (!newValue) {
      vueselect.value?.clearSelection()
    }
  },
)

const getLabel = computed(() => {
  return typeof props.error === 'string' ? props.error : props.selectLabel
})

const onUpdateModelValue = (value: any) => {
  if (!value) {
    emit('onSelect')
  }
}

const setSelected = (value: ISelect) => {
  emit('onSelect', value)
}

const setDeselected = (value: ISelect) => {
  console.info('setDeselected', value)
}

const onSearch = (value: string) => {
  emit('search', value)
}
</script>

<style lang="scss" scoped>
.searchable-select {
  position: relative;

  &__label {
    display: block;
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-standart);
    color: var(--color-gray);
    margin-bottom: 6px;
    user-select: none;
    line-height: 1.3;
  }

  &__option {
    display: flex;
    align-items: center;
    .cb {
      flex: 0 0 auto;
      margin-right: 6px;
      min-height: 1px;
    }
  }

  &.has-error {
    .searchable-select__label {
      color: var(--color-red);
    }
  }

  &._modified {
    .searchable-select__label {
      color: var(--color-red);
    }
  }

  :deep(.vs__dropdown-toggle) {
    background-color: white;
    border: 1px solid var(--color-border);
    padding: 0;
    border-radius: var(--input-border-radius);
    transition:
      border 0.25s $ease,
      background-color 0.25s $ease;

    &:hover {
      border-color: var(--color-primary-hover);
    }
  }

  :deep(.vs__selected-options) {
    flex-wrap: nowrap;
    padding-top: 1px;
    padding: 0;
    min-width: 50px;
    min-height: 32px;
    flex-wrap: nowrap;
    white-space: nowrap;
    overflow: hidden;
  }

  :deep(.vs__selected) {
    position: relative;
    color: var(--color-font);
    background: transparent;
    margin: 0;
    padding: 6px 12px;
    border: 0;
    font-size: var(--font-size-14);
    font-weight: var(--font-weight-400);
    line-height: 1.35;
    white-space: nowrap;

    &.multiple {
      padding: 2px 6px;
      margin: 2px 4px;
      background: var(--color-border);
    }

    + .vs__search {
      margin-left: 0px;
    }
  }

  .vs__search,
  .vs__search:focus {
    display: none;
    margin: 0;
    padding: 6px 0 6px 12px;
    font-family: var(--font-base);
    font-size: var(--font-size-14);
    font-style: normal;
    font-weight: var(--font-weight-400);
    line-height: 1.35;
    border: 0;
    color: var(--color-gray);
  }

  :deep(.vs__actions) {
    position: absolute;
    right: 1px;
    top: 5px;
    bottom: 5px;
    padding-left: 5px;
    background: white;
    cursor: pointer;
  }
}
</style>
