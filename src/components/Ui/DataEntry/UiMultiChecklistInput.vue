<template>
  <UiFieldInputWrapper :label="label" :is-required="isRequired">
    <div class="ui-multi-checklist-input">
      <div
        :class="[
          'ui-multi-checklist-input__list-wrapper',
          { 'ui-multi-checklist-input__list-wrapper_empty': !checkboxes.length },
        ]"
      >
        <UiLoader v-if="loading" />
        <UiCheckbox1
          v-for="(checkbox, index) in checkboxes"
          :key="index"
          :model-value="checkbox.value"
          :disabled="disabled"
          @update:model-value="onChange(index)"
        >
          {{ checkbox.label }}
        </UiCheckbox1>
        <span v-if="!checkboxes.length" class="no-elements">Нет элементов для выбора</span>
      </div>
    </div>
  </UiFieldInputWrapper>
</template>

<script setup lang="ts">
import UiLoader from '../DataDisplay/UiLoader.vue'

const props = defineProps<{
  value: string[]
  options: string[]
  loading?: boolean
  label?: string
  isRequired?: boolean
  disabled?: boolean
}>()

const emits = defineEmits(['change'])

const checkboxes = computed(() => {
  if (!props.value) return []

  return props.options.map((option) => {
    return {
      label: option,
      value: props.value.includes(option),
    }
  })
})

const onChange = (index: number) => {
  const isChecked = checkboxes.value[index].value

  if (isChecked) {
    const newValues = [...props.value]
    const indexOfValue = newValues.indexOf(checkboxes.value[index].label)
    newValues.splice(indexOfValue, 1)
    emits('change', newValues)
    return
  }

  const newValues = [...props.value, checkboxes.value[index].label]
  emits('change', newValues)
}
</script>

<style lang="scss" scoped>
.ui-multi-checklist-input {
  overflow: hidden;
  display: block;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 3px;
  max-height: 170px;
  overflow-y: auto;
}

.ui-multi-checklist-input__list-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 170px;
  gap: 6px;

  &_empty {
    align-items: center;
    justify-content: center;
  }
}

.no-elements {
  color: var(--color-font-disabled);
}
</style>
