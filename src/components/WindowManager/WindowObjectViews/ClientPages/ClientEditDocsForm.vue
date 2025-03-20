<template>
  <div :id="formId" class="client-edit-main-form">
    <div class="client-edit-main-form__scroll-wrapper">
      <div class="client-edit-main-form__wrapper">
        <div class="client-edit-main-form__grid">
          <UiLoader v-if="isLoadingUpdate" loading theme="page" />

          <UiSelect1
            :model-value="{ label: 'Физ.лицо', value: 0 }"
            :options="[{ label: 'Физ.лицо', value: 0 }]"
            select-label="Основной документ"
            :additional-class="['span-2']"
          />

          <div class="span-2"></div>

          <UiInput1 label="Серия" />
          <UiInput1 label="Номер" />
          <UiDatepicker :model-value="''" label="Дата регистрации" />
          <UiInput1 label="Код подразделения" />
          <UiInput1 label="Кем выдан" :additional-class="['span-2']" />
          <UiInput1 label="ИНН" />
          <UiInput1 label="СНИЛС" />
          <UiInput1 label="Место рождения" :additional-class="['span-2']" />
          <UiInput1 label="Код ОКСМ" />
          <UiInput1 label="Код ОКАТО" />
        </div>

        <div class="block">
          <UiSwitch1 label="Прописка совпадает с адресом фактического проживания" />
        </div>

        <div class="block">
          <div class="block-head">
            <span class="block-head-title">Дополнительная информация</span>
          </div>

          <div>
            <UiInput1 label="Кем выдан" class="span-4 mb-2" />
            <UiInput1 label="ИНН" class="span-4 mb-2" />
            <UiInput1 label="СНИЛС" class="span-4 mb-2" />
          </div>
        </div>
      </div>
    </div>

    <div class="client-edit-main-form__buttons">
      <UiButton1 v-if="!isLoadingUpdate" theme="secondary" @click="onCancel">Отменить</UiButton1>
      <UiButton1 :loading="isLoadingUpdate">Сохранить</UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, unref } from 'vue'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { ClientValidate, ClientUpdate, ClientsGetFormFields } from '@/core/api/clients.api'
import { GetObjectDto } from '@/core/api/object.api'
import type { IObjectDto } from '@/core/interface/Object'
import type { FormField } from '@/core/interface/FormField'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { customAlphabet } from 'nanoid'
import UiTabs from '@/components/Ui/DataDisplay/UiTabs.vue'
import UiDatepicker from '@/components/Ui/DataEntry/UiDatepicker.vue'
import IconButton from '@/components/Ui/DataDisplay/IconButton.vue'
import UiBadge from '@/components/Ui/DataDisplay/UiBadge.vue'
import UiSwitch from '@/components/Ui/DataEntry/UiSwitch.vue'

const nanoid = customAlphabet('abcdef', 10)
const formId = ref(nanoid(10))

const props = defineProps<{
  object: IObjectDto
}>()

const emits = defineEmits(['close'])

const isLoadingUpdate = ref(false)

const onCancel = () => {
  emits('close')
}
</script>

<style scoped lang="scss">
@import './clientEditForm.scss';

.client-edit-main-form {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 56px;
  overflow: auto;

  &__scroll-wrapper {
    display: grid;
    grid-template-columns: 1fr;
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__wrapper {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 290px 16px 200px;
    gap: 28px;
  }

  &__grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 152px);
    grid-auto-rows: 52px;
    gap: 16px 12px;
    align-items: baseline;
    padding: 20px 12px 0 20px;
  }

  &__buttons {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: right;
    padding: 0 20px;
    background-color: var(--color-background);
    border-top: var(--border-default);
  }
}

.foto-input {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 3 / 5;
  grid-row: 2 / 5;
  background-color: var(--component-gray-background);
  color: var(--color-gray);
}
</style>
