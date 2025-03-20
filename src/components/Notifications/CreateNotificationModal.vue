<template>
  <UiModal
    :name="AddNotyModal"
    :stop-classes="[
      StopClickOutsideClasses.windowManager,
      StopClickOutsideClasses.headerTasks,
      StopClickOutsideClasses.headerNotification,
      StopClickOutsideClasses.universalWrapper,
      StopClickOutsideClasses.objectEventsList,
    ]"
    size="normal"
    is-form
    @opened="onOpenedModal"
    @close="clearForm"
  >
    <div
      :class="[
        StopClickOutsideClasses.windowManager,
        StopClickOutsideClasses.headerTasks,
        StopClickOutsideClasses.headerNotification,
        StopClickOutsideClasses.universalWrapper,
        StopClickOutsideClasses.objectEventsList,
      ]"
      class="modal-create-notification"
      @click.stop.prevent
    >
      <UiInput1
        :model-value="creatorName"
        label="Автор напоминания"
        disabled
        readable-disable-mode
      />

      <div class="modal-create-notification__two-columns">
        <div>
          <UiSelect1
            v-model="notyTarget"
            :options="notyTargetOptions"
            select-label="Цель напоминания"
          />
          <UiSelect1
            v-model="selectedFillials"
            :options="fillials"
            select-label="Филиал"
            multiple
          />
          <UiDatepicker
            :min-date="new Date()"
            v-model="selectedDate"
            label="Время напоминания"
            mode="dateTime"
          />
          <UiSelect1
            v-model="selectedEvent"
            :options="notificationEvents"
            select-label="Связано с событием"
          />
        </div>
        <div>
          <UiMultiChecklistInput
            :value="selectedUsers"
            :options="usersList"
            :loading="isLoadingUsers"
            :disable="isDisableSelectUsers"
            label="Пользователи"
            @change="onChangeSelectedUsers"
          />
        </div>
      </div>

      <UiInput1 v-model="textComment" label="Комментарий" type="textarea" />
    </div>

    <template #buttons>
      <div class="modal-create-notification__buttons">
        <div>
          <UiButton1 class="mr-2" theme="secondary" @click="handleClose">Отмена</UiButton1>
        </div>
        <div>
          <UiButton1 :loading="isLoadingCreateNotification" @click="onTryCreateNoty">
            Сохранить
          </UiButton1>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification/dist/index.mjs'
import {
  ValidateNotification,
  SetNotification,
  type ISetNotificationPayload,
} from '@/core/api/notifications.api'
import { AddNotyModal } from '@/core/constants/ModalsNames'
import type { ISelect } from '@/core/interface/Ui'
import UiMultiChecklistInput from '@/components/Ui/DataEntry/UiMultiChecklistInput.vue'
import UiDatepicker from '@/components/Ui/DataEntry/UiDatepicker.vue'
import { StopClickOutsideClasses } from '@/core/constants/StopClickOutsideClasses'
import { useUsersStore } from '@/core/store/users.store'
import { NotificationEventTypes } from '@/core/constants/NotificationEventTypes'
import moment from 'moment/moment'
import { DefaultDatetimeFormat } from '@/core/constants/DefaultDatetimeFormats'

const sharedModals = useSharedModalsStore()
const { modalParams } = storeToRefs(sharedModals)

const handleClose = () => {
  sharedModals.closeModal()
}

const toast = useToast()

const creatorName = ref('')
const targetObjectId = ref()

enum NotyTargets {
  Current = '0',
  Any = '1',
  UserWithRole = '2',
  User = '3',
}

const notyTargetOptions: ISelect[] = [
  {
    value: NotyTargets.Current,
    label: 'Текущий сотрудник',
  },
  {
    value: NotyTargets.Any,
    label: 'Любой сотрудник',
  },
  {
    value: NotyTargets.UserWithRole,
    label: 'Сотрудник с назначенной ролью',
  },
  {
    value: NotyTargets.User,
    label: 'Конкретный сотрудник',
  },
]
const notyTarget = ref(notyTargetOptions[0])

const usersStore = useUsersStore()
const { users, usersByFIO, isLoadingUsers } = storeToRefs(usersStore)

const selectedUsers = ref<string[]>([])
const usersList = ref<string[]>([])
const onChangeSelectedUsers = (value: string[]) => {
  selectedUsers.value = [...value]
}

const selectedFillials = ref<ISelect[]>([])
const fillials = ref<ISelect[]>([])

const selectedDate = ref(new Date())

const notificationEvents: ISelect[] = [
  {
    label: '-',
    value: NotificationEventTypes.Common,
  },
  {
    label: 'Связаться с клиентом',
    value: NotificationEventTypes.ClientRecall,
  },
  {
    label: 'Успешный дозвон клиенту',
    value: NotificationEventTypes.TaskFinished,
  },
]
const selectedEvent = ref<ISelect>(notificationEvents[0])

const textComment = ref('')

const getSelectedUsersIds = () => {
  if (notyTarget.value.value === NotyTargets.Current) {
    return modalParams.value?.creatorId
  }

  if (notyTarget.value.value === NotyTargets.User) {
    let idsString = ''

    selectedUsers.value.forEach((userName) => {
      if (idsString) {
        idsString += ','
      }

      idsString = usersByFIO.value[userName].Id
    })

    return idsString
  }

  return ''
}

const getDdlExecutorTypeValue = () => {
  return notyTarget.value.value
}

const isLoadingCreateNotification = ref(false)

const onTryCreateNoty = async () => {
  const payload: ISetNotificationPayload = {
    ObjectId: -1,
    OperationCode: 'Notifications.SetNotification',
    Vals: {
      txtComment: textComment.value,
      dateNotification: moment(selectedDate.value).format(DefaultDatetimeFormat),
      BaseObjectId: modalParams.value?.selectedObjectID,
      BaseObjectType: modalParams.value?.selectedObjectType,
      ddlExecutorType: getDdlExecutorTypeValue(),
      ctrlDictsRoles: '',
      lstUsers: getSelectedUsersIds(),
      ddlNotificationType: selectedEvent.value.value as NotificationEventTypes,
      ctrlClientInfoPanel: targetObjectId.value,
      ddlFilials: selectedFillials.value.map((item: ISelect) => item.value).join('|'),
    },
  }

  console.log('payload', payload)

  isLoadingCreateNotification.value = true

  const validation = await ValidateNotification(payload).catch(() => {
    isLoadingCreateNotification.value = false
  })

  if (!validation.data?.TotalOk) {
    isLoadingCreateNotification.value = false
    return
  }

  await SetNotification(payload)
    .catch(() => {
      isLoadingCreateNotification.value = false
    })
    .then(() => {
      toast.success('Напоминание создано успешно')
      isLoadingCreateNotification.value = false
      sharedModals.closeModal()
    })
}

const isDisableSelectUsers = computed(() => notyTarget.value.value !== NotyTargets.User)

const updateUsersList = () => {
  usersList.value = []

  users.value.forEach((user) => {
    usersList.value.push(user.FIO)
  })
}

watch(
  () => notyTarget.value,
  (target) => {
    if (target.value === NotyTargets.User) {
      if (users.value.length) {
        updateUsersList()
      } else {
        usersStore.loadUsers().finally(updateUsersList)
      }

      return
    }

    usersList.value = []
  },
)

const onOpenedModal = () => {
  creatorName.value = modalParams.value?.creatorName
  targetObjectId.value = modalParams.value?.selectedObjectID
  fillials.value = modalParams.value?.fillials.map((fillial) => {
    return {
      value: fillial.ID,
      label: fillial.Title,
    }
  })
}

const clearForm = () => {
  isLoadingCreateNotification.value = false
  selectedUsers.value = []
  selectedFillials.value = []
  selectedEvent.value = notificationEvents[0]
  selectedDate.value = new Date()
  textComment.value = ''
}
</script>

<style scoped lang="scss">
.modal-create-notification {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__two-columns {
    display: grid;
    grid-template-columns: 230px 230px;
    gap: 20px;

    > div {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
}

.modal-create-notification__buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
