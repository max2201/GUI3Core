<template>
  <UiTabs
    :tabs="navSections"
    :active-tab-id="activeContentTab"
    @change="onChangeActiveContentTab"
  />

  <UiLoader :loading="loading" theme="page" />

  <template v-if="objectId > 0">
    <ClientMainPage
      v-if="activeContentTab === ClientPages.Main"
      :object-id="objectId"
      :object="objectData"
      :loading-create-new="isLoadingCreateNew"
      :loading-edit="isLoadingTryEdit"
      @edit="onClickEdit"
      @create-new="onClickCreateNew"
    />
    <client-additional-page
      v-if="activeContentTab === ClientPages.Additional"
      :object-id="objectId"
      :object="objectData"
      :loading-create-new="isLoadingCreateNew"
      :loading-edit="isLoadingTryEdit"
      @edit="onClickEdit"
      @create-new="onClickCreateNew"
    >
    </client-additional-page>
    <client-finance-page
      v-if="activeContentTab === ClientPages.Finance"
      :object-id="objectId"
      :object="objectData"
      :loading-create-new="isLoadingCreateNew"
      :loading-edit="isLoadingTryEdit"
      @edit="onClickEdit"
      @create-new="onClickCreateNew"
    >
    </client-finance-page>
    <UploadFilesContainer v-else-if="activeContentTab === ClientPages.Fotos" />
    <template v-if="activeContentTab === ClientPages.Deals">
      <TablePage
        v-if="objectData !== null"
        :object="objectData"
        :table-key="AdditionalTables.ClientActivitiesContracts"
        table-name="Договора"
        :loading="loading"
      />
    </template>
    <template v-if="activeContentTab === ClientPages.Calls">
      <TablePage
        v-if="objectData !== null"
        :object="objectData"
        :table-key="AdditionalTables.TelephonyModule"
        table-name="Звонки"
        :loading="loading"
      />
    </template>
    <template v-if="activeContentTab === ClientPages.Check">
      <TablePage
        v-if="objectData !== null"
        :object="objectData"
        :table-key="AdditionalTables.CheckModule"
        table-name="Проверки"
        :loading="loading"
      />
    </template>
    <template v-if="activeContentTab === ClientPages.Requests">
      <TablePage
        v-if="objectData !== null"
        :object="objectData"
        :table-key="AdditionalTables.ClientActivitiesRequests"
        table-name="Заявки"
        :loading="loading"
      />
    </template>
  </template>

  <client-empty-page v-if="isNew"></client-empty-page>

  <object-edit-view
    v-if="isEditModeOn"
    :title="isNew ? 'Создание клиента' : 'Редактирование клиента'"
    :loading="isLoadingCreateNew"
  >
    <ClientEditForm
      v-if="objectDataEdit"
      :object="objectDataEdit"
      :isEdit="!object?.isOnlyView || isNew || isObjectLockedForCurrentUser"
      @close="closeEdit"
      :loading="isSaveLoading || isLoadingTryEdit || isLoadingCreateNew"
      @save="OnSave"
      :formId="formId"
    />
    <!--    <UiButton1 @click="openObject(167014, false)"></UiButton1>-->
  </object-edit-view>
</template>

<script setup lang="ts">
import type { IObjectDto } from '@/core/interface/Object'
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import type { LockingObject } from '@/core/interface/LockingObject'

import { useToast } from 'vue-toastification'
import ClientMainPage from './ClientPages/ClientMainPage.vue'
import { ClientObject } from '@/core/model/ClientObject'
import ClientAdditionalPage from '@c/WindowManager/WindowObjectViews/ClientPages/ClientAdditionalPage.vue'
import { ClientEditObject } from '@/core/model/ClientEditObject'

import type { IClientEditDto } from '@/core/interface/Client'
import { ref } from 'vue'
import { ModalTableModal } from '@/core/constants/ModalsNames'
import { createObjectInstance } from '@/core/services/createObjectInstance'
import { VerifyLock, LockObject as LockObjectApi } from '@/core/api/locking.api'
const props = defineProps<{
  objectId: number
  loading: boolean
  formId: string
}>()
const isNew = ref(false)
const isEdit = ref(false)
const windowStore = useWindowStore()

let object = undefined as ClientObject | undefined

const objectData = ref<IObjectDto | null>(null)

let objectEdit = undefined as ClientEditObject | undefined
const objectDataEdit = ref<IClientEditDto | undefined>(undefined)
const emits = defineEmits(['request-update-object'])
const checkPassport = ref(false)
const toast = useToast()

enum ClientPages {
  Main = 1,
  Additional = 2,
  Fotos = 3,
  Finance = 4,
  Uses = 5,

  CheckRFM = 6,
  Deals = 7,
  Requests = 8,
  Calls = 9,
  Check = 10,
}

const activeContentTab = ref(ClientPages.Main)

const navSections = computed(() => {
  if (props.objectId <= -1) {
    return [{ id: 0, title: 'Создание клиента', label: 'Создание клиента' }]
  }
  return [
    { id: ClientPages.Main, label: 'Основные данные' },
    { id: ClientPages.Additional, label: 'Дополнительно' },
    { id: ClientPages.Fotos, label: 'Фотографии' },
    { id: ClientPages.Finance, label: 'Финансы' },
    { id: ClientPages.Uses, label: 'Использование' },
    { id: ClientPages.CheckRFM, label: 'Проверки РФМ' },
    { id: ClientPages.Deals, label: 'Договоры' },
    { id: ClientPages.Requests, label: 'Заявки' },
    { id: ClientPages.Calls, label: 'Звонки' },
    { id: ClientPages.Check, label: 'Проверки' },
  ]
})
enum AdditionalTables {
  ClientActivitiesContracts = 'formtable_XL.Base.Modules.DtoFactory.Clients.ClientDtoFactory_clientActivities_ClientActivitiesContracts',
  ClientActivitiesRequests = 'formtable_XL.Base.Modules.DtoFactory.Clients.ClientDtoFactory_clientActivities_ClientActivitiesRequests',
  TelephonyModule = 'formtable_XL.Base.Modules.DtoFactory.Clients.ClientDtoFactory_clientActivities_TelephonyModule',
  CheckModule = 'formtable_XL.Base.Modules.DtoFactory.Clients.ClientDtoFactory_clientActivities_CommonCheckModule',
}

const windowsStore = useWindowStore()
const { activeTabId, activeTab } = storeToRefs(windowsStore)

const onChangeActiveContentTab = (id: number) => {
  activeContentTab.value = id
}

const lockInfo = ref<LockingObject | null>(null)
const isUserHasEditAccess = ref(false)
const tryLockObject = async (isForceLock = false, isView?) => {
  isObjectLockedForCurrentUser.value = false
  isLoadingTryEdit.value = true
  if (object === undefined) {
    return
  }

  try {
    const { data, error } = await LockObjectApi({
      LockedObjectId: props.objectId,
      LockedObjectType: BaseObjectType.Client,
      ForceLock: isForceLock,
    })

    if (data && !error) {
      if (data.SelfLockingSuccessful) {
        isObjectLockedForCurrentUser.value = true
        isLoadingTryEdit.value = false
        await openEditModal()
      } else if (data.Error) {
        isLoadingTryEdit.value = false
      } else if (!isView && data.LockingObject) {
        const isUnlocked = await sharedModals.showExistLockModal({
          lockedObjectName: data.LockingObject.LockedObjectName || '',
          lockDateTime: data.LockingObject.LockDateTime || '',
          userName: data.LockingObject.UserName || '',
          isActions: true,
        })
        if (isUnlocked) {
          lockingObject.value = null
          isObjectLockedForCurrentUser.value = true
          await tryLockObject(true)
        } else {
          await openEditModal()
          isLoadingTryEdit.value = false
          isObjectLockedForCurrentUser.value = false
        }
      }
    } else {
      isUserHasEditAccess.value = true
      lockingObject.value = null
      isObjectLockedForCurrentUser.value = false
    }
    isLoadingTryEdit.value = false
  } catch (error) {
    console.error('Ошибка при блокировке объекта:', error)
    isUserHasEditAccess.value = true
    lockingObject.value = null
    isObjectLockedForCurrentUser.value = false
    isLoadingTryEdit.value = false
  }
}
const isSaveLoading = ref(false)
const sharedModals = useSharedModalsStore()
const isEditModeOn = computed(() => {
  return activeTab.value?.editMode || isNew.value
})
const openEditModal = async () => {
  isLoadingTryEdit.value = true
  objectEdit = new ClientEditObject(props.objectId)

  await objectEdit.loadData()
  objectEdit.setAfterCheckPassport(checkPassport.value)
  objectDataEdit.value = objectEdit.currentState

  windowsStore.switchTabEditMode(props.objectId, isNew, objectEdit, true)
  if (props.objectId < 0) {
    isNew.value = true
    isEdit.value = false
  } else {
    isNew.value = false
    isEdit.value = true
  }
}
const closeEdit = async () => {
  if (props.objectId < 0) {
    windowStore.removeTab(props.objectId)
    return
  }

  windowsStore.switchTabEditMode(props.objectId, false, objectEdit, false)
  isNew.value = false
  isEdit.value = false
  await object?.releaseObject()
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
// Обработка ошибок валидации нужно дорабатывать бек что бы это заработало
const processValidationErrors = (validationError) => {
  invalidFields.value = validationError

  // Обновляем поля с ошибками нужно дорабатывать бек что бы это заработало
  // Object.keys(objectDataEdit.value).forEach((key) => {
  //   if (
  //     validationError[objectDataEdit.value[key]?.id] ||
  //     validationError[objectDataEdit.value[key]?.Code]
  //   ) {
  //     objectDataEdit.value[key].error = validationError[objectDataEdit.value[key]?.id]
  //   }
  // })

  // Формируем сообщение об ошибках
  const errorDetails = Object.keys(validationError).map((key) => {
    delete validationError[key].code
    return validationError[key]
  })

  sharedModals.setModal({
    name: 'notification',
    params: {
      type: 'error',
      title: 'Ошибка сохранения клиента',
      tableData: errorDetails,
      hasActionCell: false,
      isActiveBatchEditing: false,
    },
  })

  console.error('Ошибка валидации:', validationError)
  isSaveLoading.value = false
}
const handleFormSave = async () => {
  try {
    isSaveLoading.value = true

    if (!objectEdit) {
      throw new Error('Объект не найден')
    }

    // Проверяем, является ли objectEdit экземпляром ClientEditObject
    // и если нет, создаем его заново
    if (
      !(objectEdit instanceof ClientEditObject) ||
      typeof objectEdit.getUpdateVals !== 'function'
    ) {
      console.warn(
        'objectEdit не является экземпляром ClientEditObject или не имеет метода getUpdateVals, пересоздаем объект',
      )
      objectEdit = new ClientEditObject(props.objectId)
      await objectEdit.loadData()
      objectDataEdit.value = objectEdit.currentState

      // Сохраняем объект в store
      windowsStore.switchTabEditMode(props.objectId, isNew, objectEdit, true)
    }

    const Vals = objectEdit.getUpdateVals()
    if (!Vals) {
      throw new Error('Нет данных для валидации')
    }

    // Выполняем дополнительную валидацию
    try {
      // Используем метод Validate объекта, который теперь должен быть доступен
      await objectEdit.Validate()
    } catch (validationError) {
      isSaveLoading.value = false
      processValidationErrors(validationError)
      return
    }

    try {
      // Используем метод CheckSameInnClients объекта
      const sameInnTable = await objectEdit.CheckSameInnClients()
      if (sameInnTable) {
        const isConfirmInn = await sharedModals.showActionModal({
          name: 'notification',
          params: {
            type: 'warning',
            title: 'Подтверждение операции',
            description: 'Обнаружены дубликаты компании по номеру ИНН и КПП. Добавить дубликат?',
          },
        })
        if (isConfirmInn) {
          // Пользователь подтвердил
        } else {
          sharedModals.setModal({
            name: ModalTableModal,
            params: {
              type: 'warning',
              title: 'Список объектов',
              description:
                'Список дубликатов по номеру ИНН и КПП. Внесите изменения в существующие или создайте дубликат',
              data: sameInnTable,
              isActions: false,
            },
          })
          isSaveLoading.value = false
          return
        }
      }
    } catch (InnError) {
      isSaveLoading.value = false
      console.log(InnError)
      return
    }

    try {
      // Используем метод CheckSamePassportClients объекта
      const samePassportTable = await objectEdit.CheckSamePassportClients()
      if (samePassportTable) {
        if (!isNew.value) {
          const isConfirmPassport = await sharedModals.showActionModal({
            name: 'notification',
            params: {
              type: 'warning',
              title: 'Подтверждение операции',
              description:
                'Такие серия и номер паспорта уже есть в базе клиентов. Вы уверены что хотите продолжить?',
            },
          })
          if (isConfirmPassport) {
            isSaveLoading.value = false
            console.log('isConfirmPassport')
          } else {
            isSaveLoading.value = false
            console.log('isConfirmPassport false')
            return
          }
        } else {
          const conflictTable = await sharedModals.showActionModal({
            name: ModalTableModal,
            params: {
              type: 'conflict',
              title: 'Разрешение конфликтов',
              description: 'Указанные серия и номер паспорта уже содержаться у следующих клиентов',
              data: samePassportTable,
              isActions: true,
            },
          })
          if (conflictTable) {
            console.log(conflictTable)
            if (conflictTable !== true) {
              isSaveLoading.value = false
              await openObject(conflictTable[0], true)
              return
            } else {
              isSaveLoading.value = false
              console.log('save-client')
            }
          } else {
            isSaveLoading.value = false
          }
        }
      }
    } catch (error) {
      sharedModals.setModal({
        name: 'notification',
        params: {
          type: 'error',
          title: error[0]?.Message || 'Ошибка редактировании клиента',
          description:
            error[0]?.ExceptionMessage ||
            'Попробуйте позднее или обратитесь в техническую поддержку',
          stackTrace: error[0]?.StackTrace || null,
        },
      })
      isSaveLoading.value = false
      return
    }
  } catch (error) {
    sharedModals.setModal({
      name: 'notification',
      params: {
        type: 'error',
        title: error[0]?.Message || 'Ошибка редактировании клиента',
        description:
          error[0]?.ExceptionMessage || 'Попробуйте позднее или обратитесь в техническую поддержку',
        stackTrace: error[0]?.StackTrace || null,
      },
    })
    console.log(error)
    isSaveLoading.value = false
    return
  }

  try {
    // Сохраняем данные объекта, используя метод update объекта
    const updateInfo = await objectEdit.update()
    if (updateInfo) {
      emits('request-update-object', props.objectId)
      isSaveLoading.value = false
      console.log(updateInfo)
      const updateInfoId = updateInfo?.Id
      if (isNew.value) {
        await openObject(updateInfoId, false)
      } else await closeEdit()
      return
    } else {
      isSaveLoading.value = false
      console.log('Ошибка при сохранении объекта', updateInfo)
    }
  } catch (error) {
    isSaveLoading.value = false
    sharedModals.setModal({
      name: 'notification',
      params: {
        type: 'error',
        title: error[0]?.Message || 'Ошибка редактировании клиента',
        description:
          error[0]?.ExceptionMessage || 'Попробуйте позднее или обратитесь в техническую поддержку',
        stackTrace: error[0]?.StackTrace || null,
      },
    })
    console.error('Ошибка при сохранении объекта:', error)
  }
}
const OnSave = async () => {
  if (!objectEdit) return
  isSaveLoading.value = true
  // Проверяем блокировку объекта
  if (props.objectId < 0) {
    await handleFormSave()
  } else {
    try {
      // Проверяем, является ли objectEdit экземпляром ClientEditObject
      // и если нет, создаем его заново
      if (!(objectEdit instanceof ClientEditObject)) {
        console.warn('objectEdit не является экземпляром ClientEditObject, пересоздаем объект')
        objectEdit = new ClientEditObject(props.objectId)
        await objectEdit.loadData()
        objectDataEdit.value = objectEdit.currentState

        // Сохраняем объект в store
        windowsStore.switchTabEditMode(props.objectId, isNew, objectEdit, true)
      }

      // Проверяем, имеет ли object методы для работы с блокировкой
      if (object && typeof object.verifyLockObject === 'function') {
        try {
          // Вызываем метод verifyLockObject, который является асинхронным и возвращает Promise
          const response = await (object as any).verifyLockObject()
          const data = response?.data
          const error = response?.error

          if (data && !error && data.VerifySuccessful) {
            await handleFormSave()
          } else if (data) {
            await handleObjectLock(data)
          } else {
            console.error('Ошибка при проверке блокировки:', error)
            await handleFormSave()
          }
        } catch (error) {
          console.error('Ошибка при вызове verifyLockObject:', error)
          await handleFormSave()
        }
      } else {
        // Используем прямой вызов API
        const { data, error } = await VerifyLock({
          LockedObjectId: props.objectId,
          LockedObjectType: BaseObjectType.Client,
        })

        if (data && !error && data.VerifySuccessful) {
          await handleFormSave()
        } else if (data) {
          await handleObjectLock(data)
        } else {
          console.error('Ошибка при проверке блокировки:', error)
          await handleFormSave()
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке блокировки:', error)
      await handleFormSave()
    }
  }
}

const openObject = async (id: number, edit: boolean = false) => {
  const object = createObjectInstance(id, BaseObjectType.Client)
  await object.loadData()

  windowStore.addTab(
    {
      id: object.id,
      title: object.rawData?.WindowTitle,
      type: object.type,
      data: object.rawData,
      object,
    },
    true,
    edit,
  )
  windowStore.removeTab(props.objectId)
}
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

  try {
    await sharedModals.showExistLockModal({
      lockedObjectName: data.LockingObject.LockedObjectName || '',
      lockDateTime: data.LockingObject.LockDateTime || '',
      userName: data.LockingObject.UserName || '',
      isActions: false,
    })
  } catch (error) {
    console.error('Ошибка при отображении модального окна блокировки:', error)
  } finally {
    isSaveLoading.value = false
  }
}
const isLoadingTryEdit = ref(false)

const isObjectLockedForCurrentUser = ref(true)
const lockingObject = ref<null | LockingObject>(null)

const onClickEdit = async () => {
  isLoadingTryEdit.value = true
  if (object === undefined) {
    return
  }

  try {
    // Проверяем, имеет ли object метод verifyLockObject
    if (typeof object.verifyLockObject === 'function') {
      try {
        // Вызываем метод verifyLockObject, который является асинхронным и возвращает Promise
        const response = await (object as any).verifyLockObject()
        const data = response?.data
        const error = response?.error

        isObjectLockedForCurrentUser.value = false
        if (data && !error) {
          if (!data?.VerifySuccessful) {
            await tryLockObject(false, false)
          } else {
            await openEditModal()
            isObjectLockedForCurrentUser.value = true
          }
          isLoadingTryEdit.value = false
        } else {
          console.error('VerifyLock, no data or error', error)
          isLoadingTryEdit.value = false
        }
      } catch (error) {
        console.error('Ошибка при вызове verifyLockObject:', error)
        isLoadingTryEdit.value = false
      }
    } else {
      // Используем прямой вызов API
      const { data, error } = await VerifyLock({
        LockedObjectId: props.objectId,
        LockedObjectType: BaseObjectType.Client,
      })

      isObjectLockedForCurrentUser.value = false
      if (data && !error) {
        if (!data?.VerifySuccessful) {
          await tryLockObject(false, false)
        } else {
          await openEditModal()
          isObjectLockedForCurrentUser.value = true
        }
        isLoadingTryEdit.value = false
      } else {
        console.error('VerifyLock, no data or error', error)
        isLoadingTryEdit.value = false
      }
    }
  } catch (error) {
    console.error('Ошибка при проверке блокировки:', error)
    isLoadingTryEdit.value = false
  }
}
watch(
  () => isObjectLockedForCurrentUser.value,
  (newVal) => {
    if (object) {
      object.setIsOnlyView(newVal)
    }
  },
)
const isLoadingCreateNew = ref(false)

const onClickCreateNew = async () => {
  return
}

watch(
  () => props.objectId,
  async () => {
    activeContentTab.value = 1
    isLoadingTryEdit.value = false
    lockInfo.value = null
    isLoadingCreateNew.value = true
    if (props.objectId === undefined) {
      object = undefined
      objectData.value = null
      return
    }
    if (props.objectId > 0) {
      isNew.value = false
      object = windowStore.objectByTabId(props.objectId)
      if (!object) {
        object = undefined
        objectData.value = null
        isLoadingCreateNew.value = false
        return
      }
      objectData.value = object.getCurrentState()
      objectEdit = windowsStore.objectEditByTabId(props.objectId)
      isObjectLockedForCurrentUser.value = !object.isOnlyView
      isLoadingCreateNew.value = false
      if (!objectEdit) {
        if (activeTab.value?.editMode === true) {
          checkPassport.value = true
          await onClickEdit()
        } else {
          objectEdit = undefined
          objectDataEdit.value = undefined
          return
        }
      }
    } else {
      isNew.value = true
      objectEdit = windowsStore.objectEditByTabId(props.objectId)
      if (!objectEdit) {
        objectEdit = new ClientEditObject(props.objectId)
        await objectEdit.loadData()
        objectDataEdit.value = objectEdit.currentState
        windowsStore.switchTabEditMode(props.objectId, isNew, objectEdit, true)
        isLoadingCreateNew.value = false
      }
    }

    objectDataEdit.value = objectEdit.currentState
    isLoadingCreateNew.value = false
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.client-empty {
  background: var(--color-disabled);
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
