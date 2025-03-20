<template>
  <div style="display: flex; flex-direction: column; gap: 20px; align-items: flex-start">
    <span>Кнопки</span>
    <UiSwitch
      label="disabled"
      :value="buttonsDisabled"
      @input="buttonsDisabled = $event"
    ></UiSwitch>
    <UiSwitch label="loading" :value="buttonsLoading" @input="buttonsLoading = $event"></UiSwitch>

    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1 :loading="buttonsLoading" :disabled="buttonsDisabled" custom-color="#B86FE4"
        >custom-colored fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        custom-color="#B86FE4"
        variant="outline"
        >custom-colored outline
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        custom-color="#B86FE4"
        variant="text"
        >custom-colored text
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="primary"
        variant="fill"
        >primary fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="primary"
        variant="outline"
        >primary outline
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="primary"
        variant="text"
        >primary text
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="secondary"
        variant="fill"
        >secondary fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="secondary"
        variant="outline"
        >secondary outline
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="secondary"
        variant="text"
        >secondary text
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1 :loading="buttonsLoading" :disabled="buttonsDisabled" theme="danger" variant="fill"
        >danger fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="danger"
        variant="outline"
        >danger outline
      </UiButton1>
      <UiButton1 :loading="buttonsLoading" :disabled="buttonsDisabled" theme="danger" variant="text"
        >danger text
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="success"
        variant="fill"
        >success fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="success"
        variant="outline"
        >success outline
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="success"
        variant="text"
        >success text
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="transparent"
        variant="fill"
        >transparent fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="transparent"
        variant="outline"
        >transparent outline
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        theme="transparent"
        variant="text"
        >transparent text
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1 :loading="buttonsLoading" :disabled="buttonsDisabled" size="large"
        >large
      </UiButton1>
      <UiButton1 :loading="buttonsLoading" :disabled="buttonsDisabled" size="medium"
        >medium
      </UiButton1>
      <UiButton1 :loading="buttonsLoading" :disabled="buttonsDisabled" size="medium-small"
        >medium-small
      </UiButton1>
      <UiButton1 :loading="buttonsLoading" :disabled="buttonsDisabled" size="small"
        >small
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        variant="fill"
        icon-left="eye"
        icon-right="eye"
        >icons fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        variant="outline"
        icon-left="eye"
        icon-right="eye"
        >icons outline
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        variant="text"
        icon-left="eye"
        icon-right="eye"
        >icons text
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        variant="fill"
        icon-left="eye"
        >icon-left fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        variant="outline"
        icon-left="eye"
        >icon-left outline
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        variant="text"
        icon-left="eye"
        >icon-left text
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        variant="fill"
        icon-right="eye"
        >icon-right fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        variant="outline"
        icon-right="eye"
        >icon-right outline
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        variant="text"
        icon-right="eye"
        >icon-right text
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        variant="fill"
        icon-left="eye"
      />
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        variant="outline"
        icon-left="eye"
      />
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        variant="text"
        icon-left="eye"
      />
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        style="flex: 1"
        variant="fill"
        icon-left="eye"
        icon-right="eye"
        >icons-wide fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        style="flex: 1"
        variant="outline"
        icon-left="eye"
        icon-right="eye"
        >icons-wide outline
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        style="flex: 1"
        variant="text"
        icon-left="eye"
        icon-right="eye"
        >icons-wide text
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        style="flex: 1"
        variant="fill"
        icon-left="eye"
        >icon-left-wide fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        style="flex: 1"
        variant="outline"
        icon-left="eye"
        >icon-left-wide outline
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        style="flex: 1"
        variant="text"
        icon-left="eye"
        >icon-left-wide text
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        style="flex: 1"
        variant="fill"
        icon-right="eye"
        >icon-right-wide fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        style="flex: 1"
        variant="outline"
        icon-right="eye"
        >icon-right-wide outline
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        style="flex: 1"
        variant="text"
        icon-right="eye"
        >icon-right-wide text
      </UiButton1>
    </div>
    <div style="display: flex; gap: 20px; width: 50%; align-items: center">
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        style="flex: 1"
        theme="primary"
        variant="fill"
        >wide primary fill
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        style="flex: 1"
        theme="primary"
        variant="outline"
        >wide primary outline
      </UiButton1>
      <UiButton1
        :loading="buttonsLoading"
        :disabled="buttonsDisabled"
        style="flex: 1"
        theme="primary"
        variant="text"
        >wide primary text
      </UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
const buttonsDisabled = ref(false)
const buttonsLoading = ref(false)
</script>

<style lang="scss" scoped></style>
