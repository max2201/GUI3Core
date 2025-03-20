<template>
  <div style="display: flex; flex-direction: column; gap: 20px; align-items: flex-start">
    <span>Переключатели</span>
    <UiSwitch1 label="disabled" v-model="switchDisabled"></UiSwitch1>

    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiSwitch1 :disabled="switchDisabled" v-model="switchValue" />
      <UiSwitch1 :disabled="switchDisabled" v-model="switchValue" label="with label" />
    </div>

    <span>Чекбоксы</span>
    <UiSwitch1 label="disabled" v-model="checkboxDisabled"></UiSwitch1>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiCheckbox1 :disabled="checkboxDisabled" v-model="checkboxValue" text="adad"></UiCheckbox1>
      <UiCheckbox1
        :disabled="checkboxDisabled"
        type="radio"
        :model-value="radioValue === 'a'"
        @update:model-value="radioValue = 'a'"
        text="a"
      ></UiCheckbox1>
      <UiCheckbox1
        :disabled="checkboxDisabled"
        type="radio"
        :model-value="radioValue === 'b'"
        @update:model-value="radioValue = 'b'"
        text="b"
      ></UiCheckbox1>
    </div>
  </div>
</template>

<script setup lang="ts">
const switchDisabled = ref(false)
const switchValue = ref(false)
const checkboxDisabled = ref(false)
const checkboxValue = ref(false)
const radioValue = ref('')
</script>

<style lang="scss" scoped></style>
