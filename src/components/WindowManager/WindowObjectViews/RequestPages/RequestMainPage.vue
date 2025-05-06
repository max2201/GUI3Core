<template>
  <div :id="id" class="request-main-page">
    <UiLoader v-if="loading || isSaveLoading" theme="page" loading />

    <ClientInfoRow
      v-if="objectData"
      :client-id="objectData.Client.BaseObjectId"
      :name="objectData.Client.BaseObjectName"
      :phones="objectData.Phones || []"
      :last-active="objectData.Client.BaseObjectDate"
    />

    <div v-if="objectData" class="request-main-page__content">
      <div class="request-main-page__info">
        <div class="request-main-page__info__wrapper">
          <WidgetCallback
            v-if="notification"
            :notification="notification"
            @close="notification = null"
          />

          <UiLocationTimeForm
            v-if="objectData"
            :location="objectData.ClientLocation"
            :time-string="objectData.ClientTime"
            :anchor-id="id"
            @change="onChangeLocation"
          />

          <div
            v-for="(fieldGroup, blockKey) in objectData.PrimaryBlockGroups?.slice(0, 1)"
            :key="blockKey"
            class="primary-fields-block"
          >
            <div>{{ fieldGroup.Title }}</div>
            <LiteViewField
              v-for="field in fieldGroup.Fields"
              :key="field.Code"
              :field="field"
              ignore-state
            />
          </div>
        </div>
      </div>

      <UIStepsFields
        v-if="objectData.Steps"
        :object="objectData"
        :steps="objectData.Steps as IObjectStep[]"
        v-model="object!.stepsState"
        :objectId="objectId"
        :is-allow-save="isAllowSave"
        :id="id"
        @change="handlerChange"
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
          <UiSelect1
            :model-value="responsibleUsers"
            :options="responsibleUsersOptions"
            multiple
            searchable
            select-label="Ответственный"
            @on-select="onChangeResponsibleUsers"
            @update:model-value="onChangeResponsibleUsers"
          />
          <UIObjectMainField
            :field="objectData.CommentField"
            v-model="objectData.CommentField.currentVal"
          ></UIObjectMainField>

          <UiNotificationBlock :object="objectData" @on-change="handlerChangeReminder" />
        </template>
      </UIStepsFields>
    </div>

    <div class="request-main-page__actions">
      <div></div>
      <div class="request-main-page__actions-right">
        <UiLoader v-if="loadingAccessVerify" loading theme="page" />
        <UiButton1 variant="outline">Создать договор</UiButton1>
        <UiButton1 v-if="isAllowSave" :disabled="isSaveLoading" @click="onSaveForm"
          >Сохранить
        </UiButton1>
        <UiButton1 v-else-if="isAllowEdit" :loading="loadingAccessVerify" @click="onEditObject"
          >Изменить
        </UiButton1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, unref } from 'vue'
import { nanoid } from 'nanoid'
import moment from 'moment'
import type { IObjectStep, IObjectStepField, IUiObjectStepField } from '@/core/interface/Object'
import type { ISelect } from '@/core/interface/Ui'
import {
  RecipientReminderGroup,
  type RequestReminderPayload,
  TimeReminderGroup,
  type IRequestDto,
  type ClientLocation,
} from '@/core/interface/Requests'
import { DefaultDatetimeFormat } from '@/core/constants/DefaultDatetimeFormats'
import { GetLastNotificationForObject } from '@/core/api/modules.api'
import { RequestObject } from '@/core/model/RequestObject'
import type { INotification } from '@/core/interface/Notifications'
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import { cloneDeep } from 'lodash'
import type { ValidateResultSimple } from '@/core/interface/ValidateResult'
import { RequestMergeToClient } from '@/core/api/requests.api'
import { FieldType } from '@/core/constants/FieldType'

const id = 'id_' + nanoid(10)
const sharedModals = useSharedModalsStore()
const props = defineProps<{
  objectId: number
  loading: boolean
  loadingAccessVerify: boolean
  isAllowSave: boolean
  isAllowEdit: boolean
}>()

const windowStore = useWindowStore()

let object: RequestObject | undefined
const objectData = ref<IRequestDto | null>(null)

const emits = defineEmits(['new-vals', 'edit'])

const onEditObject = () => {
  emits('edit')
}
const setReasonCancel = () => {
  objectData.value.WorkingStateField.currentVal = '20'
}
const handlerChange = (value: any) => {
  object.setStepsFormState(value)
}
const handlerChangeReminder = (reminderValue: RequestReminderPayload) => {
  object?.setReminder(reminderValue)
}
const isPageMounted = ref(false)
const formatAllStepsFields = () => {
  const Steps = cloneDeep(toRaw(unref(objectData.value?.Steps)))

  if (Steps) {
    Steps.forEach((step) => {
      //delite key step.editable
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
        if (field.FieldType?.startsWith(FieldType.Complex)) {
          field.ComplexValue = object.stepsState[field.Code]
        } else field.Value = object.stepsState[field.Code]
        return
      })
    })
  }
  console.log(Steps)
  return JSON.stringify(Steps)
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
const isSaveLoading = ref(false)
const invalidFields = ref<ObjectWithError[]>([])
const invalidFieldsSteps = ref<ValidateResultSimple>({})

const onSaveForm = async () => {
  if (!object) return
  let userConfirmed = false
  // Форматируем данные шагов
  const stepsString = formatAllStepsFields()
  isSaveLoading.value = true

  // Проверяем блокировку объекта
  const { data, error } = await object.verifyLockObject()

  if (data && data.VerifySuccessful) {
    // Валидируем шаги
    const validationError = await object.validateSteps(stepsString, false)

    if (validationError?.ErrorFieldCodes.length > 0) {
      // Обрабатываем ошибки валидации
      invalidFieldsSteps.value = validationError
      isSaveLoading.value = false

      userConfirmed = await sharedModals.showActionModal({
        name: 'notification',
        isActions: true,
        params: {
          type: 'error',
          title: 'Ошибка редактирования заявки',
          description: validationError?.ErrorMessage,
        },
      })

      if (!userConfirmed) {
        isSaveLoading.value = false
        return // Останавливаем выполнение, если пользователь не подтвердил
      }
    }

    // Если ошибок нет или пользователь подтвердил, продолжаем
    if (validationError?.ErrorFieldCodes.length === 0 || userConfirmed) {
      await handleFormSave(stepsString)
    }
  } else {
    await handleObjectLock(data)
  }

  if (error) {
    console.error('Ошибка при проверке объекта:', error)
  }

  isSaveLoading.value = false
}

// Обработка блокировки объекта
const handleObjectLock = async (data) => {
  if (!data?.LockingObject) {
    sharedModals.setModal({
      name: 'notification',
      params: {
        type: 'error',
        title: 'Системная ошибка',
        description:
          'Объект был изменён другим пользователем, информация устарела. Переоткройте форму для продолжения.',
      },
    })
    return
  }

  const isUnlocked = await sharedModals.showExistLockModal({
    lockedObjectName: data.LockingObject.LockedObjectName,
    lockDateTime: data.LockingObject.LockDateTime,
    userName: data.LockingObject.UserName,
    isActions: false,
  })

  if (!isUnlocked) {
    isSaveLoading.value = false
  }
}

// Сохранение формы
const handleFormSave = async (stepsString) => {
  try {
    isSaveLoading.value = true
    // Выполняем дополнительную валидацию
    const validationResult = await object?.ValidateRequest(stepsString)
  } catch (validationError) {
    isSaveLoading.value = false
    processValidationErrors(validationError)
    return
  }

  try {
    // Сохраняем данные объекта
    await saveObject(stepsString)
  } catch (saveError) {
    console.error('Ошибка при сохранении объекта:', saveError)
  }
}

// Обработка ошибок валидации
const processValidationErrors = (validationError) => {
  invalidFields.value = validationError

  // Обновляем поля с ошибками
  Object.keys(objectData.value).forEach((key) => {
    if (validationError[objectData.value[key]?.id]) {
      objectData.value[key].error = validationError[objectData.value[key]?.id]
    }
  })

  // Формируем сообщение об ошибках
  const errorDetails = Object.keys(validationError).map((key) => {
    delete validationError[key].code
    return validationError[key]
  })

  sharedModals.setModal({
    name: 'notification',
    params: {
      type: 'error',
      title: 'Ошибка редактирования заявки',
      tableData: errorDetails,
      hasActionCell: false,
      isActiveBatchEditing: false,
    },
  })

  console.error('Ошибка валидации:', validationError)
  isSaveLoading.value = false
}

// Сохранение объекта
const saveObject = async (stepsString) => {
  isSaveLoading.value = true
  const { data, error } = await RequestMergeToClient({
    objectId: props.objectId,
    Vals: {
      infoClient_Client: objectData.value.Client.BaseObjectId,
      infoClient_ClientName: '',
      stepsPanel_Groups: stepsString,
    },
  })
  if (error) {
    sharedModals.setModal({
      name: 'notification',
      params: {
        type: 'error',
        title: error[0]?.Message || 'Ошибка редактировании заявки',
        description:
          error[0]?.ExceptionMessage || 'Попробуйте позднее или обратитесь в техническую поддержку',
        stackTrace: error[0]?.StackTrace || null,
      },
    })
    return
  }
  if (data && Object.keys(data).length > 0) {
    const changes = await sharedModals.showConfirmMergeModal(data)

    if (changes) {
      object?.setChanges(JSON.stringify(changes))
      await updateObject(stepsString)
    } else {
      isSaveLoading.value = false
    }
  } else {
    await updateObject(stepsString)
  }
}

// Обновление объекта
const updateObject = async (stepsString) => {
  isSaveLoading.value = true
  try {
    await object.update(stepsString)
    await object?.loadData()

    // Обновляем состояние объекта
    objectData.value = object?.getCurrentState()
    isSaveLoading.value = false
    loadNotification()
  } catch (updateError) {
    object?.setChanges('{}')
    console.error('Ошибка при обновлении объекта:', updateError)
  }
}

interface ExtendedISelectItem extends ISelect {
  subitemKey: string
}

const responsibleUsers = ref<ExtendedISelectItem[]>([])
const responsibleUsersOptions = computed<ExtendedISelectItem[]>(() => {
  return (objectData.value?.ResponsibleUsersField?.values || []).map((value) => {
    return {
      label: value.Title,
      value: value.Value,
      subitemKey: value.Key,
    } as ExtendedISelectItem
  })
})
const onChangeResponsibleUsers = (items: ExtendedISelectItem[]) => {
  responsibleUsers.value = items
  objectData.value!.ResponsibleUsersField.currentVal = items.map((item) => item.value).join('|')
}

const onChangeLocation = (data: ClientLocation) => {
  objectData.value!.ClientLocation = data

  if (!data.RegionTz) return

  const momentInstance = moment()
  momentInstance.utcOffset(data.RegionTz * 60)

  objectData.value!.ClientTime = momentInstance.format('HH:mm')
}

const updateRequestFields = () => {
  const currentResponsibleUsers =
    objectData.value?.ResponsibleUsersField.currentVal.split('|') || ''

  responsibleUsers.value = responsibleUsersOptions.value.filter((item) =>
    currentResponsibleUsers.includes(String(item.value)),
  )
}

const notification = ref<INotification | null>(null)

const loadNotification = () => {
  if (!object) return

  GetLastNotificationForObject({
    moduleId: BaseObjectType.Requst,
    InputObject: {
      Id: object.id,
      BaseObjectType: object.type,
    },
  })
    .then((result) => {
      if (result.data?.Time) {
        notification.value = result.data
      } else {
        notification.value = null
      }
    })
    .catch(() => {
      notification.value = null
    })
}

watch(
  () => props.objectId,
  (BaseObjectId) => {
    notification.value = null

    if (BaseObjectId === undefined) return

    object = windowStore.objectByTabId(BaseObjectId) as RequestObject

    if (!object) return

    objectData.value = object.getCurrentState()
    updateRequestFields()

    object.startEditTime(moment().format(DefaultDatetimeFormat))

    loadNotification()
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.request-main-page {
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 1fr 60px;
  overflow: hidden;

  &__content {
    display: grid;
    grid-template-columns: 300px 1fr;
    grid-template-rows: 1fr;
    overflow: hidden;
    border-top: 1px solid var(--color-border);
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
}

.primary-fields-block {
  + .primary-fields-block {
    margin-top: 9px;
    padding-top: 9px;
    border-top: 1px solid var(--color-border);
  }
}

.primary-fields-block :deep(.lite-view__field) {
  gap: 4px;
}

.primary-fields-block :deep(.lite-view__field__title) {
  padding-right: 4px;
}

.request-main-page__info {
  display: grid;
  grid-template-columns: 300px;
  grid-template-rows: 1fr auto 50px;
  height: 100%;
  width: 300px;
  overflow: hidden;
  border-right: 1px solid var(--color-border);
}

.request-main-page__info__wrapper > * {
  padding: 20px 24px;
}

.request-main-page__info__status__title {
  color: var(--color-gray);
}

.request-main-page__result {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 24px 24px;
  border-left: 1px solid var(--color-border);
  background-color: var(--color-background);
  overflow: auto;
}

:deep(.v-popper__arrow-container) {
  display: none;
}

:deep(.v-popper__inner) {
  border: none !important;
  border-radius: 0 0 5px 5px !important;
  box-shadow: 0px 4px 20px 0px #061c2838 !important;
}
</style>
