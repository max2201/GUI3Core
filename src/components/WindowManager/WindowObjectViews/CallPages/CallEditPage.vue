<template>
  <div class="call-edit-page">
    <ClientInfoRow
      :client-id="objectData?.Client?.BaseObjectId"
      :name="objectData?.Client?.BaseObjectName"
      :phones="objectData?.Phones || []"
      :last-active="objectData?.Client?.BaseObjectDate"
    />

    <div v-if="objectData" class="call-edit-page__content">
      <div class="call-edit-page__content-main">
        <div class="call-edit-page__content-main-row">
          <TypeFieldRenderer :field="objectData?.ClientBalancePanel"></TypeFieldRenderer>
          <TypeFieldRenderer :field="objectData?.ClientDebetPanel"></TypeFieldRenderer>
          <TypeGroupRenderer
            v-for="group in objectData?.PrimaryCurrentClientAccount.Groups"
            :key="`group-${group.Code}`"
            :group="group"
          ></TypeGroupRenderer>
          <TypeGroupRenderer :group="objectData.ClientDiscountGroup"></TypeGroupRenderer>
        </div>
        <div class="call-edit-page__content-main-row">
          <ModeratorCommentEmptyWrapper
            class="call-edit-page__client-comment"
            @add-action="isClientCommentEditing = true"
            :is-empty="!clientComment.Value && !isClientCommentEditing"
          >
            <template #empty-state="{ addAction }">
              <div
                class="call-edit-page__client-comment-content call-edit-page__add-client-comment-button"
              >
                <UiButton1
                  @click="addAction"
                  icon-left="plus-circle"
                  variant="text"
                  :icon-size="20"
                  >{{ clientComment.Title }}</UiButton1
                >
              </div>
            </template>
            <template #filled-state>
              <CommentField
                class="call-edit-page__client-comment-content"
                editable
                :field="clientComment"
                :is-loading="isLoadingClientCommentUpdate"
                @update-comment="clientCommentSave"
                @input-comment="clientCommentInput"
                :initial-value="clientComment.initialValue"
                v-model:is-editing="isClientCommentEditing"
              ></CommentField>
            </template>
          </ModeratorCommentEmptyWrapper>
        </div>
        <div class="call-edit-page__content-main-row">
          <TypeGroupRenderer
            v-for="group in callAdditionalInfo.Groups"
            :key="`group-${group.Code}`"
            class="call-edit-page__linked-object-group"
            :group="group"
            :loading="asyncBlockLoading"
          >
            <template #fields="{ fields }">
              <TypeFieldRenderer
                v-for="field in fields"
                :key="`field-${field.Code}`"
                :field="field"
              ></TypeFieldRenderer>
            </template>
          </TypeGroupRenderer>
        </div>
        <div class="call-edit-page__content-main-row">
          <TypeGroupRenderer
            class="call-edit-page__metrics-group"
            v-for="group in clientMetrics.Groups"
            :key="`group-${group.Code}`"
            :group="group"
            :loading="asyncBlockLoading"
          >
            <template #fields="{ fields }">
              <TypeFieldRenderer
                v-for="field in fields"
                :key="`field-${field.Code}`"
                :field="field"
              ></TypeFieldRenderer>
            </template>
          </TypeGroupRenderer>
        </div>
      </div>
      <div class="call-edit-page__content-side">
        <ConnectionStatus v-if="callInfo" :call-info="callInfo" compact></ConnectionStatus>
        <div class="call-edit-page__content-side-edits-block">
          <UiSelect1
            v-model="objectData.CallSubject.currentVal"
            :options="objectData.CallSubject.values"
            label="Title"
            :reduce="(item) => item.Value"
            :select-label="objectData.CallSubject.title"
          />
          <UiInput1
            v-model="objectData.Comment.currentVal"
            :id="objectData.Comment.id"
            :label="objectData.Comment.title"
            type="textarea"
            readable-disable-mode
          />

          <UiSwitch1
            :model-value="isShowCallbackToClient"
            label="Обратная связь"
            @update:model-value="changeShowCallback"
          />

          <UiNotificationDatePicker
            v-if="isShowCallbackToClient"
            :less-times-options="lessTimesOptions"
            :great-times-options="greatTimesOptions"
            :users="usersForReminder"
            :roles="rolesForReminder"
            @change="onChangeReminder"
          />
        </div>
      </div>
    </div>

    <div class="call-edit-page__actions">
      <UiButton1 size="large" @click="finishEdit">Завершить обработку звонка</UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IObjectDto } from '@/core/interface/Object'
import { CallEditObject } from '@/core/model/CallEditObject'
import ModeratorCommentEmptyWrapper from '@c/Call/ModeratorCommentEmptyWrapper.vue'
import {
  ClientUpdateAdditionalData,
  ClientUpdateAdditionalDataValidate,
} from '@/core/api/clients.api'
import {
  RecipientReminderGroup,
  type RequestReminderPayload,
  TimeReminderGroup,
} from '@/core/interface/Requests'

const props = defineProps<{
  objectId: number
}>()

let object: CallEditObject | undefined
const objectData = ref<IObjectDto | null>(null)

const asyncBlockLoading = ref(false)

const callInfo = computed(() => {
  return objectData.value.CallInfo
})
const callAdditionalInfo = computed(() => {
  return objectData.value.AdditionalInfo
})
const clientMetrics = computed(() => {
  return objectData.value.PrimaryClientMetrics
})
const clientComment = computed(() => {
  return objectData.value.ClientComment
})

const isClientCommentEditing = computed({
  get() {
    return objectData.value.ClientComment.editing
  },
  set(newValue) {
    objectData.value.ClientComment.editing = newValue
  },
})
const isLoadingClientCommentUpdate = ref(false)
const clientCommentValidationError = ref(false)
const clientCommentInput = async (newComment: string) => {
  objectData.value.ClientComment.Value = newComment
}
const clientCommentSave = async () => {
  if (!isLoadingClientCommentUpdate.value) {
    isLoadingClientCommentUpdate.value = true

    const payload = {
      ObjectId: objectData.value?.Client?.BaseObjectId,
      Vals: {
        txtComment: clientComment.value.Value,
      },
    }

    const validation = await ClientUpdateAdditionalDataValidate(payload)

    if (validation.error) {
      console.log('Ошибка валидации')
      isLoadingClientCommentUpdate.value = false
      return
    }

    if (validation.data && !validation.data.TotalOk) {
      isLoadingClientCommentUpdate.value = false
      clientCommentValidationError.value =
        validation.data.Results?.txtComment?.ErrorDesription || 'Ошибкa валидации'
      return
    }

    const { error } = await ClientUpdateAdditionalData(payload)
    if (error) {
      isLoadingClientCommentUpdate.value = false
      console.log(error[0].Message)
      return
    }

    await object.loadData()
    objectData.value = object.getCurrentState()
    isClientCommentEditing.value = false
    isLoadingClientCommentUpdate.value = false
  }
}

const emit = defineEmits(['finish-edit'])

const unloadedAsyncBlockCodes = computed(() => {
  if (!objectData.value) {
    return []
  }

  return Object.entries(objectData.value)
    .filter(([_, prop]) => prop?.DataLoaded === false)
    .map(([key, _]) => key)
})

const loadAsyncBlocksData = async () => {
  asyncBlockLoading.value = true
  const loadPromises = unloadedAsyncBlockCodes.value.map((blockCode) =>
    object.loadAsyncBlockData(blockCode),
  )

  try {
    await Promise.all(loadPromises)
  } catch (error) {
    console.error('Error loading async blocks:', error)
  } finally {
    asyncBlockLoading.value = false
  }
}

watch(
  () => unloadedAsyncBlockCodes.value,
  async (blocks) => {
    if (blocks.length) {
      await loadAsyncBlocksData()
    }
  },
)

const finishEdit = async () => {
  emit('finish-edit')
}

const isShowCallbackToClient = ref(false)

const changeShowCallback = (value: boolean) => {
  isShowCallbackToClient.value = value

  if (!value) {
    object?.setReminder()
  }
}

const lessTimesOptions = computed<ExtendedISelectItem[]>(() => {
  return (
    objectData.value?.TimeReminderField.subItems.find(
      (subitem) => subitem.id === TimeReminderGroup.time_reminder_less_now,
    )?.values || []
  ).map(
    (value) =>
      ({
        label: value.Title,
        value: value.Value,
        subitemKey: value.Key,
      }) as ExtendedISelectItem,
  )
})

const greatTimesOptions = computed<ExtendedISelectItem[]>(() => {
  return (
    objectData.value?.TimeReminderField.subItems.find(
      (subitem) => subitem.id === TimeReminderGroup.time_reminder_great_now,
    )?.values || []
  ).map(
    (value) =>
      ({
        label: value.Title,
        value: value.Value,
        subitemKey: value.Key,
      }) as ExtendedISelectItem,
  )
})

const usersForReminder = computed<ExtendedISelectItem[]>(() => {
  return (
    objectData.value?.RecipientReminderField.subItems.find(
      (subitem) => subitem.id === RecipientReminderGroup.users_reminder,
    )?.values || []
  ).map(
    (value) =>
      ({
        label: value.Title,
        value: value.Value,
        subitemKey: value.Key,
      }) as ExtendedISelectItem,
  )
})

const rolesForReminder = computed<ExtendedISelectItem[]>(() => {
  return (
    objectData.value?.RecipientReminderField.subItems.find(
      (subitem) => subitem.id === RecipientReminderGroup.roles_reminder,
    )?.values || []
  ).map(
    (value) =>
      ({
        label: value.Title,
        value: value.Value,
        subitemKey: value.Key,
      }) as ExtendedISelectItem,
  )
})

const reminder = ref<RequestReminderPayload | null>(null)
const onChangeReminder = (reminderValue: RequestReminderPayload) => {
  reminder.value = reminderValue
  object?.setReminder(reminderValue)
}

const windowStore = useWindowStore()
watch(
  () => props.objectId,
  async (BaseObjectId) => {
    if (BaseObjectId === undefined) {
      object = undefined
      objectData.value = null
      return
    }
    object = windowStore.objectByTabId(BaseObjectId)

    if (!object) {
      object = undefined
      objectData.value = null
      return
    }

    objectData.value = object.getCurrentState()
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.call-edit-page {
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: 60px 1fr 60px;
  overflow: hidden;

  &__metrics-group {
    min-width: 175px;
  }

  &__linked-object-group {
    grid-column: span 2;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 300px;
    grid-template-rows: 1fr;
    overflow: hidden;
    border-top: 1px solid var(--color-border);

    &-side {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      overflow-y: auto;
      border-left: 1px solid var(--color-border);

      > :not(:last-child) {
        border-bottom: 1px solid var(--color-border);
      }

      &-edits-block {
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        background: #f0f5f9;
        flex: 1;
      }
    }

    &-main {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      overflow-y: auto;

      &-row {
        padding: 20px 24px;
        display: grid;
        column-gap: 24px;
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }
    }
  }

  &__client-comment {
    grid-column: span 4;

    &-content {
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      margin: -20px -24px;
      padding: 20px 24px;
      width: auto;
    }
  }

  &__add-client-comment-button {
    :deep(.button__content) {
      color: var(--color-primary);
      gap: 6px;
    }

    :deep(.button.link .button__content) {
      padding: 0 !important;
    }

    :deep(.button:focus) {
      outline-width: 1px;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: var(--color-background);
    border-top: 1px solid var(--color-border);
    padding: 10px 30px;
  }
}
</style>
