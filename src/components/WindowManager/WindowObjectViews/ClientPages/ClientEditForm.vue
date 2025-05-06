<template>
  <div class="client-edit-form">
    <UiTabs :tabs="tabs" :active-tab-id="activeTab" light-style @change="onChangeTab" />
    <UiLoader :loading="loading" theme="page" />

    <ClientEditMainForm
      v-if="object && activeTab === TabsIds.Main"
      :object="object"
      @close="close"
      @update="UpdateObject"
      :is-edit="isEdit"
      :formId="formId"
      :loading="loading"
    />
    <ClientEditDocsForm
      v-else-if="object && activeTab === TabsIds.Docs"
      :object="object"
      @close="close"
      :is-edit="isEdit"
      @update="UpdateObject"
      :formId="formId"
      :loading="loading"
    />
    <ClientEditAdditionalForm
      v-else-if="object && activeTab === TabsIds.Additional"
      :object="object"
      :is-edit="isEdit"
      @close="close"
      @update="UpdateObject"
      :formId="formId"
      :loading="loading"
    />
    <UploadFilesContainer v-else-if="activeTab === TabsIds.Photos" />
    <ClientEditIntegrationForm
      v-else-if="object && activeTab === TabsIds.Integrations"
      :object="object"
      :is-edit="isEdit"
      @save="close"
      @update="UpdateObject"
      :formId="formId"
      :loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
import UiTabs from '@/components/Ui/DataDisplay/UiTabs.vue'
import ClientEditMainForm from './ClientEditMainForm.vue'
import ClientEditDocsForm from './ClientEditDocsForm.vue'
import ClientEditAdditionalForm from './ClientEditAdditionalForm.vue'
import type { IClientEditDto } from '@/core/interface/Client'
import ClientEditIntegrationForm from '@c/WindowManager/WindowObjectViews/ClientPages/ClientEditIntegrationForm.vue'
const props = defineProps<{
  object: IClientEditDto
  isEdit: boolean
  loading: boolean
  formId: string
}>()

const emits = defineEmits(['close', 'save'])

enum TabsIds {
  Main = 0,
  Docs = 1,
  Additional = 2,
  Photos = 3,
  Integrations = 4,
}

const tabs = [
  {
    id: TabsIds.Main,
    label: 'Основные данные',
  },
  {
    id: TabsIds.Docs,
    label: 'Документы',
  },
  {
    id: TabsIds.Additional,
    label: 'Дополнительно',
  },
  {
    id: TabsIds.Photos,
    label: 'Фотографии',
  },
  {
    id: TabsIds.Integrations,
    label: 'Интеграция',
  },
]

const activeTab = ref(TabsIds.Main)

const onChangeTab = (tabId: TabsIds) => {
  activeTab.value = tabId
}

const close = () => {
  emits('close')
}
const UpdateObject = () => {
  emits('save')
}
</script>

<style scoped lang="scss">
.client-edit-form {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 40px auto;
  overflow: hidden;
}
</style>
