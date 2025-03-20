<template>
  <div style="display: flex; flex-direction: column; gap: 20px; align-items: flex-start">
    <span>Селекты</span>

    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiSelect1
        clearable
        searchable
        v-model="addObjectForm"
        :options="flagsSelectItems"
      ></UiSelect1>
      {{ addObjectForm }}
      <UiSelect1 disabled></UiSelect1>
      <UiDateSimpleInput></UiDateSimpleInput>
      <UiDatepicker></UiDatepicker>
    </div>
  </div>
</template>

<script setup lang="ts">
const addObjectForm = ref()
const flagsSelectItems = computed(() => {
  return [
    {
      value: 1,
      label: 'aasdadada',
    },
    {
      value: 2,
      label: 'b',
    },
    {
      value: 3,
      label: 'c',
    },
  ]
})
</script>

<style lang="scss" scoped></style>
