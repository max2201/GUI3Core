<template>
  <UiFieldInputWrapper :label="label" :is-required="isRequired">
    <div class="ui-input-disable">
      <UiInput1
        v-bind="$props"
        :disabled="isDisabled"
        v-model="localValue"
      />
      <IconButton
        v-if="!isDisabled"
        :width="32"
        :height="32"
        :additionalClass="['ui-input-disable__button-save']"
        name="checkmark"
        padding="6px"
        outlined
        @click="handlerSaver"
      />
      <IconButton
        v-else
        :width="32"
        :height="32"
        :additionalClass="['ui-input-disable__button-edit']"
        name="pencil"
        padding="6px"
        outlined
        @click="ChangeDisableMode"
      />
    </div>
  </UiFieldInputWrapper>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  label?: string
  disabled?: boolean
  isRequired?: boolean
}>()

const localValue = defineModel<string>('modelValue', {
  default: '',
})

const isDisabled = ref(props.disabled)
const ChangeDisableMode = () => {
  isDisabled.value = !isDisabled.value
}
const handlerSaver = () => {
  if (!isDisabled.value) {
    emit('onSave')
    isDisabled.value = true
  }
}
const emit = defineEmits([
  'onChange',
  'onChangeable',
  'onEnter',
  'onCtrlAltEnter',
  'onCtrlEnter',
  'onSave',
  'onUpdate:modelValue',
])
</script>

<style scoped lang="scss">
.ui-input-disable {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  background-color: var(--color-background);
  border-radius: var(--input-border-radius);
  border: 1px solid var(--color-border);
  user-select: none;
  :deep(.ui-input__input) {
    border: none;
    color: var(--color-font);
    &:hover {
      color: var(--color-font);
    }
  }
  :deep(.ui-input__label) {
    display: none;
  }
  &__button-save {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: var(--color-background);
  }

  &__button-edit {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: var(--color-background);
  }
}
</style>
