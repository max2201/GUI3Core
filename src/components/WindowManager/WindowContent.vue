<template>
  <div class="content" :id="formId">
    <UiLoader :loading="isLoadingObjectData" theme="page" />
    <template v-if="showedObjectId && isOpened && !isLoadingObjectData">
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
        :formId="formId"
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
import { customAlphabet } from 'nanoid'
import { ref } from 'vue'
import ClientEditMainForm from '@c/WindowManager/WindowObjectViews/ClientPages/ClientEditMainForm.vue'
const nanoid = customAlphabet('abcdef', 10)
const formId = ref(nanoid(10))
const dialogStore = useWindowStore()
const { isOpened, activeTab } = storeToRefs(dialogStore)

const showedObjectId = ref(null)
const showedObjectType = ref(0)
const isLoadingObjectData = ref(true)

watch(
  () => activeTab.value,
  async (activeTabData) => {
    isLoadingObjectData.value = true

    const object = activeTabData?.object

    if (!object) {
      isLoadingObjectData.value = false
      return
    }

    if (object.checkExist()) {
      isLoadingObjectData.value = false
      showedObjectId.value = object.id
      showedObjectType.value = object.type

      if (object.id < 0) {
        showedObjectId.value = activeTabData.id
        if (showedObjectType.value === BaseObjectType.Client) {
          isLoadingObjectData.value = false
          return
        }
      }
      isLoadingObjectData.value = false
      return
    }
    try {
      if (object.id < 0 && showedObjectType.value == BaseObjectType.Client) {
        return
      } else await object.loadData()
    } finally {
      showedObjectId.value = object.id
      showedObjectType.value = object.type
      if (object.id < 0) {
        showedObjectId.value = activeTabData.id
      }
      isLoadingObjectData.value = false
    }
  },
  {
    immediate: true,
  },
)

const onUpdateObject = (objectState: IObjectDto) => {
  const object = activeTab.value?.object

  if (!object) {
    return
  }

  object.applyChanges(objectState)
}
</script>

<style lang="scss" scoped>
.content {
  position: relative;
}
</style>
