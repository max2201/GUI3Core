<template>
  <div :id="formId" class="client-edit-main-form">
    <div class="client-edit-main-form__scroll-wrapper">
      <div class="client-edit-main-form__wrapper">
        <div class="client-edit-main-form__grid">
          <UiLoader v-if="isLoadingUpdate" loading theme="page" />

          <UiSelect1
            :model-value="{ label: 'Физ.лицо', value: 0 }"
            :options="[{ label: 'Физ.лицо', value: 0 }]"
            select-label="Юридический статус"
          />

          <UiSelect1
            :model-value="{ label: 'Сотрудник', value: 0 }"
            :options="[{ label: 'Сотрудник', value: 0 }]"
            select-label="Категория клиента"
          />

          <UiSelect1
            :model-value="{ label: 'Клиент, Партнер', value: 0 }"
            :options="[{ label: 'Клиент, Партнер', value: 0 }]"
            select-label="Роль контрагента"
            :additional-class="['span-2']"
          />

          <UiFIOInput
            :value="form[FormFields.FIO]"
            :dialog-anchor-id="formId"
            name="clientEditFIO"
            label="ФИО"
            class="span-2"
            @change="onChangeField(FormFields.FIO, $event)"
          />

          <UiDatepicker
            :max-date="new Date()"
            :model-value="'15.01.2000'"
            label="Дата рождения"
          />

          <UiSelect1
            :model-value="{ label: 'М', value: 0 }"
            :options="[
              { label: 'М', value: 0 },
              { label: 'Ж', value: 1 },
            ]"
            select-label="Пол"
          />

          <UiSelect1
            :model-value="{ label: 'РФ', value: 0 }"
            :options="[
              { label: 'РФ', value: 0 },
              { label: 'не РФ', value: 1 },
            ]"
            select-label="Гражданство"
          />

          <UiInput1
            v-model="form.CodeWord"
            :id="codeWordID"
            :theme="isCodeWordValid === true ? 'success' : undefined"
            :error="isCodeWordValid === false"
            label="Кодовое слово"
          />

          <div class="foto-input">Для фото</div>

          <UiAddressInput
            :value="form[FormFields.PlaceOfResidence]"
            :dialog-anchor-id="formId"
            name="clientEditPlaceOfResidence"
            label="Адрес фактического места жительства"
            class="span-4"
            @change="onChangeField(FormFields.PlaceOfResidence, $event)"
          />
        </div>

        <div class="block">
          <div class="block-head">
            <span class="block-head-title">Телефоны</span>
            <UiButton1 :icon-size="24" icon-left="plus-circle" size="small"></UiButton1>
          </div>

          <div>
            <div class="telephone-row telephone-row__main">
              <div class="telephone-number">
                952 107-2322
                <UiBadge value="основной" passive primary />
              </div>
              <div class="telephone-description">лишний раз лучше не звонить</div>
            </div>
            <div class="telephone-row">
              <div class="telephone-number">952 555-2322</div>
              <div class="telephone-description">непонятный номер</div>
            </div>
            <div class="telephone-row">
              <div class="telephone-number">901 222-2552</div>
              <div class="telephone-description">вроде его</div>
            </div>
          </div>
        </div>

        <div class="block">
          <div class="block-head">
            <span class="block-head-title">Уведомления и контакты</span>
            <div class="d-flex">
              <UiSwitch1 label="Уведомления" class="mr-3" />
              <UiSwitch1 label="Реклама" />
            </div>
          </div>

          <div class="notification-inputs">
            <UiInput1 label="Телефон для уведомл." />
            <UiInput1 label="Электронная почта" />
            <UiInput1 label="Телеграм" />
            <UiInput1 label="Способ отправки" />
          </div>
        </div>
      </div>
    </div>

    <div class="client-edit-main-form__buttons">
      <UiButton1 v-if="!isLoadingUpdate" theme="secondary" @click="onCancel">Отменить</UiButton1>
      <UiButton1 :loading="isLoadingUpdate" @click="updateClient">Сохранить</UiButton1>
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

const codeWordID = 'codeWordID'

const FormFields = {
  FIO: 'FIO',
  CodeWord: 'CodeWord',
  PlaceOfResidence: 'PlaceOfResidence',
}

const form = reactive({
  CodeWord: '',
  FIO: '',
  PlaceOfResidence: '',
})
const isCodeWordValid = computed(() => undefined)

const onChangeField = (field: string, value: any) => {
  form[field] = value
}

const toast = useToast()

let objectDTO: null | any = null

const getObjectEditDto = async () => {
  const result = await GetObjectDto({
    ObjectId: props.object.BaseObjectId < 0 ? -1 : props.object.BaseObjectId,
    BaseObjectType: props.object.BaseObjectType,
    DtoViewType: DtoObjectViewType.PrimaryEdit,
    ReturnEmptyObject: props.object.BaseObjectId < 0,
    ModuleId: props.object.BaseObjectId < 0 ? 'ClientsModule' : undefined,
  })

  if (!result.data) {
    toast.error('Ошибка при попытке получить данные клиента: ' + result.error)
    return
  }

  objectDTO = result.data
}

let formFields: null | FormField[] = null

const getFormFields = async () => {
  const result = await ClientsGetFormFields()

  if (!result.data) {
    toast.error('Ошибка при попытке получить данные формы: ' + result.error)
    return
  }

  formFields = result.data
}

const prepareEditForm = () => {
  Promise.all([getObjectEditDto(), getFormFields()]).then(() => {
    form.CodeWord = objectDTO.CodeWord
    form.FIO = JSON.stringify(objectDTO.FIO)
    form.PlaceOfResidence = JSON.stringify(objectDTO.PlaceOfResidence)
  })
}

prepareEditForm()

const getVals = () => {
  return (formFields || [])?.reduce((acc, fieldSettings) => {
    acc[fieldSettings.FieldCode] = form[fieldSettings.Mapping]
    return acc
  }, {})
}

const isLoadingUpdate = ref(false)

const updateClient = async () => {
  const ObjectId = props.object.BaseObjectId < 0 ? -1 : props.object.BaseObjectId
  const Vals = getVals()

  isLoadingUpdate.value = true

  const validateResult = await ClientValidate({ Vals })

  if (!validateResult?.data?.TotalOk) {
    toast.error('Ошибка валидации полей.')
    isLoadingUpdate.value = false
    return
  }

  ClientUpdate({ ObjectId, Vals })
    .then((result) => {
      if (!result?.data || result.error) {
        toast.error('Ошибка при загрузке дополнительной информации: ', result.error)
        return
      }

      emits('close', { ...result.data, BaseObjectId: result.data.Id } as IObjectDto)
    })
    .finally(() => {
      isLoadingUpdate.value = false
    })
}

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
    grid-template-rows: 350px 160px 95px;
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

.telephone-row {
  display: grid;
  width: 100%;
  grid-template-columns: 252px auto;
  height: 40px;
  border: var(--border-default);

  &__main {
    background-color: var(--component-blue-background);
  }
}
.telephone-number {
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  border-right: var(--border-default);
  font-weight: var(--font-weight-500);
  gap: 12px;
}
.telephone-description {
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.notification-inputs {
  display: grid;
  grid-template-columns: repeat(4, 152px);
  grid-auto-rows: 52px;
  gap: 16px 12px;
}
</style>
