<template>
  <UiInfinityTabs
    divided
    dark
    :tabs="navSections"
    :active-tab-id="activeContentTab"
    @tab-click="onChangeActiveContentTab"
    hide-overload
  />
  <template v-if="objectId >= 0">
    <RequestMainPage
      v-show="activeContentTab === 0"
      :object-id="objectId"
      :loading="loading || isSaveLoading"
      :loading-access-verify="isLoadingVerifyLocking || isLoadingLocking"
      :is-allow-save="isUserHasEditAccess && isObjectLockedForCurrentUser"
      :is-allow-edit="isUserHasEditAccess"
      @edit="onEditObject"
      @new-vals="onUpdateVals"
    />
    <template v-if="activeContentTab === 1">
      <UploadFilesContainer :object="object" />
    </template>
    <RequestAdditionalPage
      v-show="activeContentTab === 2"
      :object-id="objectId"
      :loading="loading || isSaveLoading"
      :loading-access-verify="isLoadingVerifyLocking"
      :is-allow-save="isUserHasEditAccess && isObjectLockedForCurrentUser"
      :is-allow-edit="isUserHasEditAccess"
      @edit="onEditObject"
      @new-vals="onUpdateVals"
    />
    <template v-if="activeContentTab === 3">
      <RequestTablePage
        :object="objectData"
        :table-key="RequestAdditionalTables.ClientActivitiesContracts"
        table-name="Договора"
      />
    </template>
    <template v-if="activeContentTab === 4">
      <RequestTablePage
        :object="objectData"
        :table-key="RequestAdditionalTables.ClientActivitiesRequests"
        table-name="Заявки"
      />
    </template>
    <template v-if="activeContentTab === 5">
      <RequestTablePage
        :object="objectData"
        :table-key="RequestAdditionalTables.TelephonyModule"
        table-name="Последние звонки"
      />
    </template>
  </template>
  <RequestNewPage v-else :object-id="objectId" :loading="loading" />
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'
import type { IObjectDto } from '@/core/interface/Object'
import { RequestsUpdate, RequestValidate, type RequestValidateVals } from '@/core/api/requests.api'
import type { LockingObject } from '@/core/interface/LockingObject'

const toast = useToast()
const sharedModals = useSharedModalsStore()

const props = defineProps<{
  objectId: number
  loading: boolean
}>()

const windowStore = useWindowStore()

let object: RequestObject
const objectData = ref<IRequestDto | null>(null)

const emits = defineEmits(['update-object'])

const isObjectLockedForCurrentUser = ref(false)
const isLoadingVerifyLocking = ref(false)
const lockingObject = ref<null | LockingObject>(null)

const onEditObject = async () => {
  isLoadingVerifyLocking.value = true
  const { data, error } = await object.verifyLockObject()
  isObjectLockedForCurrentUser.value = false
  if (data && !error) {
    if (!data?.VerifySuccessful) {
      const isUnlocked = await sharedModals.showExistLockModal({
        lockedObjectName: data!.LockingObject!.LockedObjectName,
        lockDateTime: data!.LockingObject!.LockDateTime,
        userName: data!.LockingObject!.UserName,
        isActions: true,
      })

      if (isUnlocked) {
        lockingObject.value = null
        await tryLockObject(true)
      } else {
        isObjectLockedForCurrentUser.value = false
      }
    } else {
      isObjectLockedForCurrentUser.value = true
    }
  } else {
    console.error('VerifyLock, no data or error', error)
  }
  isLoadingVerifyLocking.value = false
}

const isLoadingLocking = ref(false)

const tryLockObject = async (isForceLock = false, isView) => {
  isObjectLockedForCurrentUser.value = false
  isLoadingLocking.value = true
  const { data, error } = await object.lockObject(isForceLock)
  if (data && !error) {
    if (data.SelfLockingSuccessful) {
      isObjectLockedForCurrentUser.value = true
    } else if (data.Error) {
      isObjectLockedForCurrentUser.value = false
    } else if (!isView) {
      const isUnlocked = await sharedModals.showExistLockModal({
        lockedObjectName: data!.LockingObject!.LockedObjectName,
        lockDateTime: data!.LockingObject!.LockDateTime,
        userName: data!.LockingObject!.UserName,
        isActions: true,
      })
      if (isUnlocked) {
        lockingObject.value = null
        isObjectLockedForCurrentUser.value = true
        await tryLockObject(true)
      } else {
        isObjectLockedForCurrentUser.value = false
      }
    }
  } else {
    isUserHasEditAccess.value = true
    lockingObject.value = null
    isObjectLockedForCurrentUser.value = false
  }
  isLoadingLocking.value = false
}

const isLoadingTryEdit = ref(true)
const isUserHasEditAccess = ref(false)

const checkEditAccess = () => {
  return new Promise((resolve, reject) => {
    isLoadingTryEdit.value = true

    object
      .checkAccess()
      .then(() => {
        isUserHasEditAccess.value = true
        resolve()
      })
      .finally(() => {
        isLoadingTryEdit.value = true
      })
  })
}

const checkLockAndAccess = () => {
  checkEditAccess().then(() => {
    tryLockObject(false, true)
  })
}

const activeContentTab = ref(0)

const navSections = computed(() => {
  if (props.objectId <= -1) {
    return [{ id: 0, title: 'Создание заявки', label: 'Создание заявки' }]
  }

  return [
    { id: 0, title: 'Основные свойства' },
    { id: 1, title: 'Документы' },
    { id: 2, title: 'Дополнительно' },
    { id: 3, title: 'Договора' },
    { id: 4, title: 'Заявки' },
    { id: 5, title: 'Последние звонки' },
  ]
})

const onChangeActiveContentTab = ({ id }: { id: number }) => {
  activeContentTab.value = id
  windowStore.setContentTab(id)
}

const onUpdateObject = (object: IObjectDto) => {
  emits('update-object', object)
}

const isSaveLoading = ref(false)
const onUpdateVals = async (Vals: RequestValidateVals) => {
  isSaveLoading.value = true
  const { data: lockData, error: lockError } = await object.verifyLockObject()
  if (lockData && !lockError) {
    if (!lockData?.VerifySuccessful) {
      lockingObject.value = lockData?.LockingObject || null
      isObjectLockedForCurrentUser.value = false
      isSaveLoading.value = false
      return
    }
  } else {
    console.error('VerifyLock, no data or error', error)
    isObjectLockedForCurrentUser.value = true
  }

  const ObjectId = props.objectId
  const BaseObjectType = objectData.value.BaseObjectType

  const { data, error } = await RequestValidate({
    ObjectId,
    Vals,
  })

  if (!data || error) {
    console.error('RequestMainPage -> RequestsValidate, error or no data', error)
    isSaveLoading.value = false
    return
  }

  if (!data.TotalOk) {
    console.error('Error when validate', data)
    Object.values(data.Results).forEach((errorField) => {
      if (errorField.ErrorCode === -1) return
      if (errorField.ErrorCode === 1 && !errorField.IsRequired) return

      console.log(
        errorField.FieldCode,
        '\n',
        errorField.FieldTitle,
        ':',
        errorField.ErrorCode,
        '\n',
        errorField.Value,
        '\n',
        errorField.ErrorDesription,
        '\n',
      )
    })
    isSaveLoading.value = false
    return
  }

  const { data: updateData, error: updateError } = await RequestsUpdate({
    ObjectId,
    BaseObjectType,
    Vals,
  })

  if (!updateData || updateError) {
    console.error('RequestMainPage -> RequestsUpdate, error or no data', updateError)
    isSaveLoading.value = false
    return
  }

  isSaveLoading.value = false
}

enum RequestAdditionalTables {
  ClientActivitiesContracts = 'formtable_XL.Base.Modules.DtoFactory.Clients.ClientDtoFactory_clientActivities_ClientActivitiesContracts',
  ClientActivitiesRequests = 'formtable_XL.Base.Modules.DtoFactory.Clients.ClientDtoFactory_clientActivities_ClientActivitiesRequests',
  TelephonyModule = 'formtable_XL.Base.Modules.DtoFactory.Clients.ClientDtoFactory_clientActivities_TelephonyModule',
}

watch(
  () => props.objectId,
  (BaseObjectId) => {
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

    activeContentTab.value = windowStore.activeTab?.contentTab
    isLoadingVerifyLocking.value = false
    lockingObject.value = null
    isLoadingTryEdit.value = true

    if (object.id === -1) return

    if (object.isAllowedForEdit) {
      isUserHasEditAccess.value = true
      tryLockObject(false, true)
    } else {
      isUserHasEditAccess.value = false
      checkLockAndAccess()
    }
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.request-view {
  &__section {
    padding: 12px 30px;
    &:nth-child(even) {
      background: var(--color-background);
    }
  }

  &__actions {
    margin-top: auto;
    background: var(--color-background);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: flex-end;
    padding: 10px 30px;
    button:not(:last-child) {
      margin-right: 8px;
    }
  }
}

// section shared
:deep(.w-label) {
  font-size: var(--font-size-standart);
  color: var(--color-gray);
}

:deep(.w-value) {
  margin-top: 2px;
  font-weight: var(--font-weight-500);
  font-size: var(--font-size-14);
  line-height: 1.2;
}

.stub-view {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 90%;
  color: var(--color-font-disabled);
  font-weight: var(--font-weight-500);
  font-size: var(--font-size-16);
  line-height: 150%;
}
</style>
