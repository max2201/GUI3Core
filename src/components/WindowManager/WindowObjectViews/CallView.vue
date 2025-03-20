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
    <template v-if="activeContentTab === CallPages.Main">
      <CallEditPage v-if="isEditModeOn" :object-id="objectId" @finish-edit="finishEditObject" />
      <CallMainPage v-else @edit-call="startEditObject" :object-id="objectId" />
    </template>
  </template>
</template>

<script setup lang="ts">
import { CallObject } from '@/core/model/CallObject'
import { CallEditObject } from '@/core/model/CallEditObject'
import type { IObjectDto } from '@/core/interface/Object'

enum CallPages {
  Main = 0,
}

const props = defineProps<{
  objectId: number
  loading?: boolean
}>()

const windowStore = useWindowStore()
const sharedModals = useSharedModalsStore()

let object: CallObject | CallEditObject
const objectData = ref<IObjectDto | null>(null)

const navSections = computed(() => {
  if (props.objectId === -1) {
    return []
  }

  return [{ id: CallPages.Main, title: 'Основные данные' }]
})
const activeContentTab = ref(CallPages.Main)
const dialogStore = useWindowStore()
const { activeTab } = storeToRefs(dialogStore)

const onChangeActiveContentTab = ({ id }: { id: number }) => {
  activeContentTab.value = id
  windowStore.setContentTab(id)
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

    activeContentTab.value = activeTab.value?.contentTab

    if (object.id === -1) return
  },
  {
    immediate: true,
  },
)

const isEditModeOn = computed(() => {
  return activeTab.value?.editMode
})

const forceUnlock = async () => {
  isEditModeOn.value ? await finishEditObject(true) : await startEditObject(true)
}

const startEditObject = async (force = false) => {
  if (!lockLoading.value) {
    lockLoading.value = true
    const { data, error } = await object.lockObject(force)
    if (data && !error) {
      if (data.SelfLockingSuccessful) {
        await editModeSwitch()
      } else if (data.Error) {
        console.log(data.Error)
      } else {
        const isUnlocked = await sharedModals.showExistLockModal({
          lockedObjectName: data!.LockingObject!.LockedObjectName,
          lockDateTime: data!.LockingObject!.LockDateTime,
          userName: data!.LockingObject!.UserName,
          isActions: true,
        })
        lockLoading.value = false
        if (isUnlocked) {
          await forceUnlock()
        } else {
          return
        }
      }
    } else {
      console.log(error)
    }
    lockLoading.value = false
  }
}

const lockLoading = ref(false)
const finishEditObject = async (force = false) => {
  if (!lockLoading.value) {
    lockLoading.value = true
    const { data, error } = await object.verifyLockObject()
    if (data && !error) {
      if (data.VerifySuccessful) {
        if (object instanceof CallEditObject) {
          await object.update()
        }
        const { data, error } = await object.releaseObject()
        if (data && !error) {
          if (data.Error) {
            console.log(data.Error)
          } else {
            await editModeSwitch()
          }
        } else {
          console.log(error)
        }
      } else if (data.Error) {
        console.log(data.Error)
      } else {
        sharedModals.setModal({
          name: 'notification',
          params: {
            type: 'error',
            title: 'Системная ошибка',
            description:
              'Объект был изменён другим пользователем, информация в форме устарела. Для изменения объекта переоткройте форму.',
          },
        })
        await editModeSwitch()
      }
    } else {
      console.log(error)
    }
    lockLoading.value = false
  }
}

const editModeSwitch = async () => {
  object = isEditModeOn.value ? new CallObject(props.objectId) : new CallEditObject(props.objectId)
  await object.loadData()
  windowStore.switchTabEditMode(props.objectId, object)
}
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
