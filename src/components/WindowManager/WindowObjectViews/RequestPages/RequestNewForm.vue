<template>
  <div :id="id" class="request-new-form">
    <div class="request-new-form__header">
      <SvgIcon name="userCreationOperations-add_request" :width="24" :height="24" />
      <span class="ml-2">Создание заявки</span>
    </div>

    <div class="request-new-form__input-wrapper" v-if="objectData">
      <UIObjectMainField
        :field="objectData.FilialField"
        v-model="objectData.FilialField.currentVal"
      ></UIObjectMainField>
      <UIObjectMainField
        :field="objectData.SourceField"
        v-model="objectData.SourceField.currentVal"
        taggable
      ></UIObjectMainField>
      <UIObjectMainField
        :field="objectData.SourceDetailField"
        v-model="objectData.SourceDetailField.currentVal"
      ></UIObjectMainField>
      <UIObjectMainField
        :field="objectData.RequestTypeField"
        v-model="objectData.RequestTypeField.currentVal"
        @update:model-value="onChangeRequestType"
      ></UIObjectMainField>
    </div>
    <div class="request-new-form__contact-wrapper">
      <div class="new-chat-modal__contact">
        <UiSearchableSelect
          :value="newContactForm.contact"
          :options="contacts"
          :loading="isShowContactsLoading"
          :error="newContactForm.error"
          option-label-key="BaseObjectName"
          option-value-key="nameForSelectValue"
          select-label="Контакт"
          @on-select="onSelectContact"
          @search="onSearchContact"
        />
      </div>

      <div class="new-chat-modal__number">
        <UiSelect1
          :model-value="newContactForm.number"
          :options="newContactForm.contactNumbers"
          :disabled="!newContactForm?.contactNumbers?.length"
          select-label="Контактный номер"
          option-label-key=""
          @update:model-value="onSelectNumber"
        />
      </div>
    </div>
    <UIStepsFields
      v-if="objectData.Steps"
      :object="objectData"
      :steps="objectData.Steps as IObjectStep[]"
      v-model="object!.stepsState"
      :objectId="objectId"
      :id="id"
      is-new
      @change="handlerChange"
      :loading="isLoadingSteps"
      :error="invalidFieldsSteps?.ErrorFieldCodes"
      @set-reason-cancel="setReasonCancel"
    >
      <template #result>
        <UIObjectMainField
          :field="objectData.WorkingStateField"
          v-model="objectData.WorkingStateField.currentVal"
        ></UIObjectMainField>
        <UIObjectMainField
          :field="objectData.RefuseStateField"
          v-model="objectData.RefuseStateField.currentVal"
          :parent-field="objectData.WorkingStateField"
        ></UIObjectMainField>
        <UIObjectMainField
          :field="objectData.CommentField"
          v-model="objectData.CommentField.currentVal"
        ></UIObjectMainField>

        <UiNotificationBlock :object="objectData" @on-change="handlerChangeReminder" />
      </template>
    </UIStepsFields>
    <div class="request-new-form__actions">
      <div></div>
      <div class="request-new-form__actions-right">
        <UiLoader v-if="isSaveLoading" loading theme="page" />
        <UiButton :disabled="isSaveLoading || !isAllowSave" @click="onSaveForm">
          Сохранить
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IObjectStep } from '@/core/interface/Object'
import type { IExtendedClientContact, RequestNewContactsPayload } from '@/core/interface/Requests'
import { type IRequestDto } from '@/core/interface/Requests'
import type { RequestObject } from '@/core/model/RequestObject'
import moment from 'moment/moment'
import { GetClientAutoCompleteList, GetClientPhones } from '@/core/api/clients.api'
import { computed, ref, toRaw, unref, watch } from 'vue'
import type { IClientContact } from '@/core/interface/ClientContact'
import { FieldGroupStates } from '@/core/constants/FieldGroupStates'
import { DefaultDatetimeFormat } from '@/core/constants/DefaultDatetimeFormats'
import { RequestGetSteps, RequestMergeToClient } from '@/core/api/requests.api'
import { cloneDeep } from 'lodash'
import { createObjectInstance } from '@/core/services/createObjectInstance'

import { nanoid } from 'nanoid'
import type { ValidateResultSimple } from '@/core/interface/ValidateResult'

const id = nanoid()
const sharedModals = useSharedModalsStore()

// Основная логика
const props = defineProps<{
  objectId: number
}>()
let object: RequestObject | undefined
const objectData = ref<IRequestDto | null>(null)
const windowStore = useWindowStore()
const emits = defineEmits(['close'])

// ---------------------------
// Поля формы
// ---------------------------

const isAllowSave = ref(true)

onMounted(() => {
  isPageMounted.value = true
})
// ---------------------------
// Поля для контактов
// ---------------------------
const contacts = ref<IExtendedClientContact[]>([])
const newContactForm = ref<RequestNewContactsPayload>({
  contact: null,
  number: null,
  contactNumbers: [],
  error: null,
})
const isShowContactsLoading = ref(false)

const isPageMounted = ref(false)

const handlerChange = (value: any) => {
  object.setStepsFormState(value)
}

const handlerChangeReminder = (value: any) => {
  object?.setReminder(value)
}

// ---------------------------
// Поиск / выбор контакта
// ---------------------------
const onSearchContact = (value: string) => {
  if (value.charAt(value.length - 1) == ' ') {
    return
  }
  isShowContactsLoading.value = true
  GetClientAutoCompleteList(value)
    .then(({ data }) => {
      if (!data) return
      contacts.value = data.map((contact) => {
        return {
          ...contact,
          nameForSelectValue: contact.BaseObjectName.split(',').join(' ,') + ' ',
        }
      })
    })
    .finally(() => {
      isShowContactsLoading.value = false
    })
}

const onSelectContact = (value: IClientContact) => {
  newContactForm.value.contact = value || null
  newContactForm.value.error = null
  if (!value) {
    newContactForm.value.number = null
    newContactForm.value.contactNumbers = []
    return
  }
  newContactForm.value.contact.Id = value.Id
  getNewStateSteps(true)

  GetClientPhones(value.Id).then(({ data }) => {
    if (!data) return
    newContactForm.value.contactNumbers = [...data]
    if (newContactForm.value.contactNumbers.length) {
      newContactForm.value.number = newContactForm.value.contactNumbers[0]
    } else {
      newContactForm.value.number = null
    }
  })
  object!.newContactForm = newContactForm
}
const isLoadingSteps = ref(false)
const getNewStateSteps = (isNewContact?: boolean) => {
  isLoadingSteps.value = true
  let stepsString = ''
  if (isNewContact) {
    stepsString = formatAllStepsFields()
  }
  RequestGetSteps({
    objectId: -1,
    Vals: {
      ddlRequestType: objectData.value.RequestTypeField.currentVal,
      infoClient_Client: newContactForm.value.contact?.Id || -1,
      stepsPanel_Groups: stepsString,
    },
  })
    .then(({ data }) => {
      if (!data) return
      ;(object.currentState.Steps = data?.map((step) => {
        return { ...step, editable: step.FieldGroupState !== FieldGroupStates.EditSuccess }
      })),
        (objectData.value = object?.currentState)
      objectData.value!.activeStepTabIndex = 0
    })
    .finally(() => {
      isLoadingSteps.value = false
    })
}

const onSelectNumber = (val: string) => {
  newContactForm.value.number = val
}
const onChangeRequestType = () => {
  getNewStateSteps(false)
}
const setReasonCancel = () => {
  objectData.value.WorkingStateField.currentVal = '20'
}
// Доп. метод: обновить локальные поля

const updateRequestFields = () => {
  if (!objectData.value) {
    return
  }
  newContactForm.value = object?.newContactForm || {
    contact: null,
    number: null,
  }
  objectData.value.RequestTypeField.currentVal =
    objectData.value?.RequestTypeField.currentVal || objectData.value?.RequestTypeField.defaultVal

  objectData.value.FilialField.currentVal =
    objectData.value?.FilialField.currentVal || objectData.value?.FilialField.defaultVal
}
interface InvalidFieldInfo {
  code: string
  reason: string
  title: string
}
interface ObjectWithError {
  id: number
  name: string
  error?: InvalidFieldInfo | null // Поле ошибки может быть `null` или отсутствовать
}
const invalidFields = ref<ObjectWithError[]>([])
const invalidFieldsSteps = ref<ValidateResultSimple>({})

const isSaveLoading = ref(false)
const formatAllStepsFields = () => {
  const Steps = cloneDeep(toRaw(unref(objectData.value?.Steps)))

  if (Steps) {
    Steps.forEach((step) => {
      delete step.editable
      step.Fields.forEach((_, index) => {
        const field = step.Fields[index]
        if (!object.stepsState[field.Code]) {
          return
        }

        if (field.SubFields?.length) {
          field.SubFields = field.SubFields.map((subfield) => {
            return {
              ...subfield,
              Value: object.stepsState[field.Code][subfield.Code],
            }
          })
          const valuesObj = field.SubFields.reduce((acc, sf) => {
            acc[sf.Code] = sf.Value
            return acc
          }, {})
          field.Value = JSON.stringify(valuesObj)
          return
        }
        field.Value = object.stepsState[field.Code]
      })
    })
  }
  return JSON.stringify(Steps)
}
const onSaveForm = async () => {
  if (!object) return

  // Форматируем данные шагов
  const stepsString = formatAllStepsFields()
  isSaveLoading.value = true

  try {
    const validationError = await object.validateSteps(stepsString, true)
    if (validationError?.ErrorFieldCodes.length) {
      handleStepValidationError(validationError)
      return
    }

    try {
      await object.validateCreate(stepsString)
    } catch (creationError) {
      handleCreationError(creationError)
      return
    }

    try {
      const { data, error } = await RequestMergeToClient({
        objectId: -1,
        Vals: {
          ddlRequestType: objectData.value.RequestTypeField.currentVal,
          infoClient_Client: newContactForm.value.contact?.Id || -1,
          infoClient_ClientName: '',
          stepsPanel_Groups: stepsString,
        },
      })
      if (error) {
        sharedModals.setModal({
          name: 'notification',
          params: {
            type: 'error',
            title: error[0]?.Message || 'Ошибка создания заявки',
            description:
              error[0]?.ExceptionMessage ||
              'Попробуйте позднее или обратитесь в техническую поддержку',
            stackTrace: error[0]?.StackTrace || null,
          },
        })
        return
      }
      if (data && Object.keys(data).length !== 0) {
        const changes = await sharedModals.showConfirmMergeModal(data)
        if (changes) {
          object?.setChanges(JSON.stringify(changes))
          await createAndOpenObject(stepsString)
        }
      } else {
        await createAndOpenObject(stepsString)
      }
    } catch (mergeError) {
      object?.setChanges('{}')
      console.error('Ошибка при сохранении формы:', mergeError)
    }
  } catch (error) {
    await handleValidationException(error, stepsString)
  } finally {
    isSaveLoading.value = false
  }
}

const handleStepValidationError = (error) => {
  invalidFieldsSteps.value = error
  isSaveLoading.value = false
  sharedModals.setModal({
    name: 'notification',
    params: {
      type: 'error',
      title: 'Ошибка создания заявки',
      description: error?.ErrorMessage,
    },
  })
}

const handleCreationError = (error) => {
  invalidFields.value = error
  Object.keys(objectData.value).forEach((key) => {
    if (error[objectData.value[key]?.id]) {
      objectData.value[key].error = error[objectData.value[key]?.id]
    }
  })

  newContactForm.value.error = Object.keys(error).some((key) => key === 'infoClient_Client')

  const errorDetails = Object.keys(error).map((key) => {
    delete error[key].code
    return error[key]
  })

  sharedModals.setModal({
    name: 'notification',
    params: {
      type: 'error',
      title: 'Ошибка создания заявки',
      isForm: true,
      tableData: errorDetails,
    },
  })

  console.error('Ошибка валидации', error)
  isSaveLoading.value = false
}

const createAndOpenObject = async (stepsString) => {
  try {
    const result = await object.Create(stepsString)
    await openObject(result)
  } catch (creationError) {
    console.error('Ошибка при создании объекта:', creationError)
  }
}

const handleValidationException = async (error, stepsString) => {
  try {
    const validationResult = await object.ValidateStepsValidate(stepsString)

    sharedModals.setModal({
      name: 'notification',
      params: {
        type: 'error',
        title: error[0]?.Message || 'Ошибка создания заявки',
        description:
          error[0]?.ExceptionMessage || 'Попробуйте позднее или обратитесь в техническую поддержку',
        stackTrace: error[0]?.StackTrace || null,
      },
    })
  } catch (validationError) {
    handleCreationError(validationError)
  }
}

const openObject = async (result) => {
  const object = createObjectInstance(result.Id, result.BaseObjectType)
  await object.loadData()
  windowStore.addTab({
    id: object.id,
    title: object.rawData?.WindowTitle,
    type: object.type,
    data: object.rawData,
    object,
  })
  windowStore.removeTab(props.objectId)
}

watch(
  () => props.objectId,
  (BaseObjectId) => {
    if (BaseObjectId === undefined) return
    object = windowStore.objectByTabId(BaseObjectId) as RequestObject

    if (!object) return
    objectData.value = object.getCurrentState()
    updateRequestFields()
    const stepsState = object.getStepsFormState()
    if (!stepsState) {
      getNewStateSteps()
    }
    object.startEditTime(moment().format(DefaultDatetimeFormat))
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
.request-new-form {
  position: absolute;
  right: 0;
  width: 75%;
  overflow-y: auto;
  background: white;
  height: calc(100% - 89px);
  display: grid;
  grid-auto-rows: 42px 70px auto 1fr 66px;
  /* justify-content: space-between; */
  justify-content: space-evenly;
  padding-bottom: 0px;
  &__header {
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-bg-active);
    color: var(--component-green-color);
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: start;
  }
  &__input-wrapper {
    display: grid;
    grid-template-rows: 48px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 8px;

    align-items: center;
    padding: 12px 16px;
  }
  &__contact-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 12px 16px;
    gap: 8px;
  }
  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-background);
    border-top: 1px solid var(--color-border);
    padding: 10px 30px;
  }
  &__actions-right {
    display: flex;
    gap: 18px;
  }
  &__result {
    padding: 12px 16px;
  }
}

:deep(.new-chat-modal__contact) {
  padding-top: 0px;
}
:deep(.searchable-select__label) {
  margin-bottom: 3px;
}

.new-chat-modal__contact {
  max-width: 400px;
}
</style>
