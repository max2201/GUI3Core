<template>
  <UiInfinityTabs
    divided
    dark
    :tabs="navSections"
    :active-tab-id="activeContentTab"
    @tab-click="onChangeActiveContentTab"
    hide-overload
  />

  <UiLoader :loading="loading" theme="page" />

  <ClientMainPage
    v-if="activeContentTab === ClientPages.Main"
    :object-id="objectId"
    :loading-create-new="isLoadingCreateNew"
    :loading-edit="isLoadingTryEdit"
    @edit="onClickEdit"
    @create-new="onClickCreateNew"
  />
  <UploadFilesContainer v-else-if="activeContentTab === ClientPages.Fotos" />

  <template v-else>
    <div class="stub-view">
      <SvgIcon name="stub-box" :width="170" :height="180" />
      <div>Раздел в разработке</div>
    </div>
  </template>

  <ExistLockModal
    v-if="lockInfo"
    :locked-object-name="lockInfo.LockedObjectName"
    :lock-date-time="lockInfo.LockDateTime"
    :user-name="lockInfo.UserName"
    @force-unlock="forceUnlock"
    @close="closeLockingModal"
  />
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { toRaw } from 'vue'
import { LockObject, ReleaseObject, VerifyLock } from '@/core/api/locking.api'
import { VerifyAccess } from '@/core/api/access.api'
import { AccessVerifyOperationType } from '@/core/constants/AccessVerifyOperationType'
import type { IObjectDto } from '@/core/interface/Object'
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import { GetObjectDto } from '@/core/api/object.api'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import type { LockingObject } from '@/core/interface/LockingObject'
import { openFreeModal } from '@/core/utils/openFreeModal'
import { FreeModalTarget } from '@/core/interface/FreeModal'
import { useToast } from 'vue-toastification'
import { WindowHeadClass, WindowContentClass } from '@/core/constants/GlobalClassNames'
import ClientMainPage from './ClientPages/ClientMainPage.vue'
import { createObjectInstance } from '@/core/services/createObjectInstance'
import { ClientObject } from '@/core/model/ClientObject'

const props = defineProps<{
  objectId: number
  loading: boolean
}>()

const windowStore = useWindowStore()

let object: ClientObject
const objectData = ref<IObjectDto | null>(null)

const emits = defineEmits(['request-update-object'])

const toast = useToast()

enum ClientPages {
  Main = 1,
  Additional = 2,
  Fotos = 3,
  Finance = 4,
  Uses = 5,
  Deals = 6,
  CheckRFM = 7,
}

const activeContentTab = ref(ClientPages.Main)

const navSections = computed(() => {
  return [
    { id: ClientPages.Main, title: 'Основные данные' },
    { id: ClientPages.Additional, title: 'Дополнительно' },
    { id: ClientPages.Fotos, title: 'Фотографии' },
    { id: ClientPages.Finance, title: 'Финансы' },
    { id: ClientPages.Uses, title: 'Использование' },
    { id: ClientPages.Deals, title: 'Делопроизводство' },
    { id: ClientPages.CheckRFM, title: 'Проверки РФМ' },
  ]
})

const windowsStore = useWindowStore()
const { activeTabId } = storeToRefs(windowsStore)

const onChangeActiveContentTab = ({ id }: { id: number }) => {
  activeContentTab.value = id
}

const isLoadingLock = ref(false)
const isObjectLockedForCurrentUser = ref(false)
const lockInfo = ref<LockingObject | null>(null)

const tryLockObject = (isForceLock = false) => {
  const LockedObjectId = props.objectId
  const LockedObjectType = objectData.value?.BaseObjectType

  isLoadingLock.value = true
  lockInfo.value = null
  isObjectLockedForCurrentUser.value = false

  return LockObject({
    LockedObjectId,
    LockedObjectType,
    ForceLock: isForceLock,
  })
    .then((result) => {
      if (!result || !result.data || result.data.Error || !result.data.LockingObject) {
        // TODO
        console.error('Cant lock object', LockedObjectId, 'result', result)
        return
      }

      lockInfo.value = result.data.LockingObject || null
      isObjectLockedForCurrentUser.value = result.data.SelfLockingSuccessful
      return result.data.LockingObject
    })
    .finally(() => {
      isLoadingLock.value = false
    })
}

const sharedModals = useSharedModalsStore()

const openEditModal = () => {
  const windowHeadDiv = Array.from(document.getElementsByClassName(WindowHeadClass))[0]
  const windowHeadRect = windowHeadDiv.getBoundingClientRect()
  const windowContentDiv = Array.from(document.getElementsByClassName(WindowContentClass))[0]
  const windowContentRect = windowContentDiv.getBoundingClientRect()

  if (!windowHeadRect || !windowContentRect) {
    console.error('Не удалось открыть окно редактирования - не найдено view')
    return
  }

  openFreeModal({
    target: FreeModalTarget.EditClient,
    object: objectData.value,
    title: 'Редактирование данных',
    top: windowHeadRect.bottom,
    left: document.body.clientWidth - 690,
    height: windowContentRect.bottom - windowHeadRect.bottom,
    width: 690,
    callback: (object: IObjectDto) => {
      emits('request-update-object', object)
    },
  })
}

const isLoadingTryEdit = ref(false)

const onClickEdit = async () => {
  const Id = props.objectId
  const BaseObjectType = objectData.value?.BaseObjectType
  const BaseObjectName = objectData.value?.BaseObjectName
  const BaseObjectDate = objectData.value?.BaseObjectDate

  console.log('BaseObjectType', BaseObjectType)
  console.log('BaseObjectName', BaseObjectName)
  console.log('BaseObjectDate', BaseObjectDate)
  console.log('objectData.value', objectData.value)

  isLoadingTryEdit.value = true

  const verifyResult = await VerifyAccess({
    TypeOperation: AccessVerifyOperationType.Modify,
    Id,
    BaseObjectType,
    BaseObjectName,
    BaseObjectDate,
  })

  if (!verifyResult?.data || !verifyResult.data.SuccessVerify) {
    toast.error('Ошибка: ' + verifyResult.data?.ErrorMessage)
    isLoadingTryEdit.value = false
    return
  }

  tryLockObject()
    .then((data) => {
      if (data && !isObjectLockedForCurrentUser.value) {
        sharedModals.setModal({ name: 'exist-lock' })
        return
      }

      openEditModal()
    })
    .finally(() => {
      isLoadingTryEdit.value = false
    })
}

const forceUnlock = () => {
  lockInfo.value = null

  tryLockObject(true).then((data) => {
    if (isObjectLockedForCurrentUser.value) {
      openEditModal()
    }
  })
}

const closeLockingModal = () => {}

const isLoadingCreateNew = ref(false)

const onClickCreateNew = async () => {
  isLoadingCreateNew.value = true

  const verifyResult = await VerifyAccess({
    TypeOperation: AccessVerifyOperationType.Add,
    Id: -1,
    BaseObjectType: BaseObjectType.Client,
    BaseObjectName: '',
    BaseObjectDate: '',
  })

  if (!verifyResult?.data || !verifyResult.data.SuccessVerify) {
    toast.error('Ошибка: ' + verifyResult.data?.ErrorMessage)
    isLoadingCreateNew.value = false
    return
  }

  const id = -`1${BaseObjectType.Client}`
  const name = 'Новый клиент'

  const object = createObjectInstance(-1, BaseObjectType.Client)

  windowsStore.addTab(
    {
      id,
      title: name,
      type: BaseObjectType.Client,
      object,
    },
    true,
  )
}

watch(
  () => props.objectId,
  () => {
    activeContentTab.value = 1
    isLoadingLock.value = false
    isObjectLockedForCurrentUser.value = false
    lockInfo.value = null
    isLoadingCreateNew.value = false

    if (props.objectId < 0) {
      openEditModal()
    }

    console.log('props.objectId', props.objectId)

    if (props.objectId === undefined) {
      object = undefined
      objectData.value = null
      return
    }

    object = windowStore.objectByTabId(props.objectId)

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

onMounted(() => {
  if (props.objectId < 0) {
    openEditModal()
  }
})
</script>

<style scoped lang="scss">
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
