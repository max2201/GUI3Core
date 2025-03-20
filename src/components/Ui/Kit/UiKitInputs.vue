<template>
  <div style="display: flex; flex-direction: column; gap: 20px; align-items: flex-start">
    <span>Инпуты</span>
    <UiSwitch label="disabled" :value="inputsDisabled" @input="inputsDisabled = $event"></UiSwitch>
    <UiSwitch label="loading" :value="inputsLoading" @input="inputsLoading = $event"></UiSwitch>

    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiInput1
        is-required
        clearable
        icon="search"
        size="large"
        disabled
        icon-position="left"
        helper="Дополнительный текст"
        label="label"
        theme="success"
        v-model="inputValue"
      />

      <UiInput1
        is-required
        clearable
        icon="search"
        icon-position="left"
        helper="Дополнительный текст"
        label="label"
        theme="warning"
        v-model="inputValue"
      />
      <UiInput1
        is-required
        clearable
        icon="search"
        icon-position="left"
        helper="Дополнительный текст"
        label="label"
        theme="error"
        v-model="inputValue"
      />
      <UiInput1
        is-required
        clearable
        icon="search"
        icon-position="left"
        helper="Дополнительный текст"
        label="label"
        theme="secondary"
        v-model="inputValue"
      />
      <UiInput1
        clearable
        icon="search"
        icon-position="left"
        helper="Дополнительный текст"
        label="label"
        highlight-not-empty
        v-model="inputValue"
      />
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiInput1 type="textarea" label="label" v-model="inputValue" />
      <UiInput1
        clearable
        type="textarea"
        icon="search"
        helper="фывф"
        label="label"
        icon-position="left"
        v-model="inputValue"
      />
      <UiInput1
        icon-position="right"
        clearable
        icon="search"
        name="password"
        size="large"
        type="password"
        label="Пароль"
        placeholder="Пароль"
        highlight-not-empty
        v-model="inputValue"
      />
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiInput1 label="label" v-model="inputValue" />
      <UiInput1 icon="eye" label="label" v-model="inputValue" />
      <UiInput1 clearable label="label" v-model="inputValue" />
      <UiInput1 label="label" size="large" v-model="inputValue" />
      <UiInput1 icon="eye" label="label" size="large" v-model="inputValue" />
      <UiInput1 clearable label="label" size="large" v-model="inputValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
const inputsDisabled = ref(false)
const inputsLoading = ref(false)

const inputValue = ref('')
</script>

<style lang="scss" scoped></style>
