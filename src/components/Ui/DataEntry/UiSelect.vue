<template>
  <div
    class="select"
    :class="[
      { 'has-error': error },
      theme,
      multiple && 'is-multiple',
      value && 'has-value',
      hasModified && '_modified',
      searchable && '_searchable',
      disabled && '_disabled',
    ]"
    @click="onClickWrapper"
  >
    <label v-if="selectLabel" class="select__label" :for="id">
      {{ getLabel }}
      <sup v-if="isRequired" class="select__label__sup-star">*</sup>
    </label>

    <div class="select__wrapper" ref="containerRef">
      <vue-select
        ref="vueselect"
        :model-value="valueModel"
        :id="id"
        :options="options"
        :disabled="disabled"
        :error="error"
        :placeholder="placeholder"
        :searchable="searchable"
        :multiple="multiple"
        :close-on-select="!multiple"
        :deselect-from-dropdown="multiple"
        :label="optionLabelKey"
        :create-option="createOption"
        @option:selected="optionSelected"
        @option:deselected="optionDeselected"
      >
        <template #open-indicator="{ attributes }">
          <span v-bind="attributes">
            <SvgIcon name="chevron-down" />
          </span>
        </template>

        <template #option="item">
          <div class="select__option">
            <UiCheckbox v-if="multiple" :checked="false" />
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
          <span> Не найдено</span>
        </template>
      </vue-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { defineComponent, toRaw, unref } from 'vue'
import { onClickOutside } from '@vueuse/core'

// @ts-ignore
import VueSelect from 'vue-select'
import type { ISelect } from '@/core/interface/Ui'

const id = nanoid()

defineComponent(VueSelect)
const emit = defineEmits(['onSelect'])

const containerRef = ref(null)
const vueselect = ref<any>(null)

onClickOutside(containerRef, () => {
  if (vueselect.value.open) {
    vueselect.value.open = false
  }
})

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
  optionLabelKey: {
    type: String,
    default: 'label',
  },
  createOption: {
    type: Function,
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
  disabled: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: false,
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
  isRequired: {
    type: Boolean,
    default: false,
  },
})

// state
const valueModel = ref(toRaw(props.value))

watch(
  () => props.value,
  (newValue) => {
    valueModel.value = toRaw(newValue)

    if (!newValue) {
      vueselect.value?.clearSelection()
    }
  },
)

const getLabel = computed(() => {
  return typeof props.error === 'string' ? props.error : props.selectLabel
})

const optionSelected = (selectedItem: ISelect) => {
  valueModel.value = toRaw(selectedItem)
  emit('onSelect', toRaw(selectedItem))
}

const optionDeselected = (value: ISelect) => {
  if (!Array.isArray(props.value)) {
    return
  }

  if (value?.value) {
    let newArr = props.value
      .filter((item) => {
        return item.value !== unref(value).value
      })
      .map((item) => toRaw(item))

    emit('onSelect', toRaw(newArr))
    return
  }

  let newArr = props.value
    .filter((item) => {
      return item !== value
    })
    .map((item) => toRaw(item))

  emit('onSelect', toRaw(newArr))
}

const onClickSelectedItem = (option: ISelect) => {
  optionDeselected(option)
}

const onClickWrapper = () => {
  console.info('UiSelect -> onClickWrapper')
}
</script>

<style lang="scss" scoped>
.select {
  position: relative;

  &__label {
    display: block;
    line-height: 1.3;
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-standart);
    color: var(--color-gray);
    margin-bottom: 6px;
    user-select: none;
  }

  &__option {
    display: flex;
    align-items: center;
    min-height: 16px;
    .cb {
      flex: 0 0 auto;
      margin-right: 6px;
      min-height: 1px;
    }
  }

  &.has-error {
    .select__label {
      color: var(--color-red);
    }
  }

  &._modified {
    .select__label {
      color: var(--color-primary);
    }
  }
}
</style>

<style lang="scss" scoped>
@import 'vue-select/dist/vue-select.css';

.v-select {
  height: 32px;
}

.select {
  .vs__dropdown-toggle {
    height: 32px;
    background: white;
    border: 1px solid var(--color-border);
    padding: 0;
    border-radius: var(--input-border-radius);
    transition:
      border 0.25s $ease,
      background 0.25s $ease;

    &:hover {
      border-color: var(--color-primary-hover);
    }
  }

  .vs__selected-options {
    padding: 0;
    min-width: 50px;
    height: 32px;
    flex-wrap: nowrap;
    white-space: nowrap;
    overflow: hidden;
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

  &.is-multiple {
    .vs__selected-options {
      flex-wrap: wrap;
      padding-left: 8px;
      padding-top: 2px;
      padding-bottom: 2px;
      min-height: 31px;
    }
  }

  .vs__selected {
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
      margin-left: 0;
    }
  }

  .vs__actions {
    padding-top: 0;
    padding-right: 8px;
  }

  .vs__open-indicator {
    flex: 0 0 auto;
    fill: var(--color-gray) !important;
    font-size: 0;
    .svg-icon {
      font-size: var(--font-size-24);
    }
  }

  .vs__dropdown-menu {
    top: calc(100% + 1px);
    padding: 0;
    background: white;
    border: 0 solid transparent;
    border-radius: 0 0 var(--input-border-radius) var(--input-border-radius);
    box-shadow: 0 4px 15px rgba(105, 78, 75, 0.14);
  }

  .vs__dropdown-option {
    position: relative;
    padding: 12px 14px;
    color: var(--color-font);
    font-family: var(--font-base);
    font-size: var(--font-size-14);
    font-style: normal;
    font-weight: var(--font-weight-400);
    line-height: 1.35;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition:
      background 0.1s $ease,
      color 0.25s $ease;
  }

  .vs__dropdown-option--highlight {
    background: #ecf4fd;
    color: var(--color-font);
  }

  .vs__dropdown-option--selected {
    padding-right: 16px;
    .cb {
      &__icon {
        border-color: var(--color-primary);
        .svg-icon {
          opacity: 1;
          transform: scale(1);
        }
      }
    }
  }

  .vs__no-options {
    padding: 14px 20px;
    font-size: var(--font-size-14);
    text-align: center;
  }

  .vs__clear {
    display: none;
    width: 12px;
    margin-right: 12px;
    font-size: 0;
    .svg-icon {
      font-size: 10px;
    }
    &:hover {
      color: var(--color-primary);
    }
  }

  &.has-error {
    .vs__dropdown-toggle {
      border-color: var(--color-red);
    }
  }

  .vs--open {
    .select {
      .vs__open-indicator {
        transform: none;
      }
      .vs__dropdown-toggle {
        border-color: var(--color-primary-hover);
      }
    }
  }

  .vs--single.vs--open .vs__selected,
  .vs--single.vs--loading .vs__selected {
    position: relative;
  }

  &._searchable {
    .vs__search {
      display: block;
    }

    .vs__selected {
      position: absolute;
      z-index: 10;
    }

    .vs--single.vs--open .vs__selected {
      position: absolute;
    }
  }

  &._disabled {
    pointer-events: none;
  }
}

.select .select__label__sup-star {
  color: var(--color-red);
  font-size: var(--font-size-24);
  top: 7px;
  margin-right: 6px;
}
</style>
