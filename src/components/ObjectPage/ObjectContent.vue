<template>
  <div class="content window-content-component">
    <UiLoader :loading="isLoadingObjectData" theme="page" />
    <template v-if="showedObjectId && isOpened">
      <RequestView
        v-if="showedObjectType === BaseObjectType.Requst"
        :key="'request' + showedObjectId"
        :object-id="showedObjectId"
        @update-object="onUpdateObject"
      />
      <ClientView
        v-else-if="showedObjectType === BaseObjectType.Client"
        :key="'client' + showedObjectId"
        :object-id="showedObjectId"
        @request-update-object="onUpdateObject"
      />
      <CallView
        v-else-if="showedObjectType === BaseObjectType.Call"
        :key="'call' + showedObjectId"
        :object-id="showedObjectId"
      ></CallView>
      <AICallView
        v-else-if="showedObjectType === BaseObjectType.AICall"
        :key="'AIcall' + showedObjectId"
        :object-id="showedObjectId"
      ></AICallView>
      <StubView v-else-if="!isLoadingObjectData" :object-id="showedObjectId" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { IObjectDto } from '@/core/interface/Object'
import { BaseObjectType } from '@/core/constants/BaseObjectType'
import type { IModuleDto } from '@/core/interface/Module'
import { createObjectInstance } from '@/core/services/createObjectInstance'
import { getTitleForNewObjectTab } from '@/core/services/getTitleForNewObjectTab'

const props = defineProps<{
  object: IObjectDto
  windowId: number
}>()
const windowStore = useWindowStore()
const dialogStore = useWindowStore()
const { isOpened, activeTab } = storeToRefs(dialogStore)

// TODO: в дальнейшем отказаться от WindowManager
const openWindowManger = async (item: any) => {
  const object = createObjectInstance(item.id, item.type)
  windowStore.addTab(
    {
      id: object.id,
      title: object.rawData?.WindowTitle,
      type: object.type,
      data: object.rawData,
      object,
    },
    true,
    true,
  )
}

openWindowManger({
  id: props.object.BaseObjectId === -1 ? props.windowId : props.object.BaseObjectId,
  title: props.object.BaseObjectName,
  type: props.object.BaseObjectType,
  data: props.object.rawData,
  object: props.object,
})

const showedObjectId = ref(null)
const showedObjectType = ref(0)
const isLoadingObjectData = ref(true)

watch(
  () => activeTab.value,
  (activeTabData) => {
    isLoadingObjectData.value = true
    const object = activeTabData?.object

    if (!object) {
      isLoadingObjectData.value = false
      return
    }

    object.loadData().finally(() => {
      isLoadingObjectData.value = false
      showedObjectId.value = object.id
      showedObjectType.value = object.type
    })
  },
  {
    immediate: true,
  },
)

const onUpdateObject = (objectState: IObjectDto) => {
  const object = activeTabData?.object

  if (!object) {
    return
  }

  object.applyChanges(objectState)
}
</script>

<style lang="scss" scoped>
:deep(.request-new-form) {
  width: auto;
  height: calc(100% - 100px);
}
</style>
