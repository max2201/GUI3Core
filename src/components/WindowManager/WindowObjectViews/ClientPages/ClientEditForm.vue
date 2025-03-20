<template>
  <div :id="formId" class="client-edit-form">
    <UiInfinityTabs
      compact
      divided
      :tabs="tabs"
      :active-tab-id="activeTab"
      @tab-click="onChangeTab"
      hide-overload
    />
    <ClientEditMainForm v-if="activeTab === TabsIds.Main" :object="object" @close="close" />
    <ClientEditDocsForm v-else-if="activeTab === TabsIds.Docs" :object="object" @close="close" />
    <ClientEditAdditionalForm
      v-else-if="activeTab === TabsIds.Additional"
      :object="object"
      @close="close"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, unref } from 'vue'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { ClientValidate, ClientUpdate, ClientsGetFormFields } from '@/core/api/clients.api'
import { GetObjectDto } from '@/core/api/object.api'
import type { IObjectDto } from '@/core/interface/Object'
import type { FormField } from '@/core/interface/FormField'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { customAlphabet } from 'nanoid'
import UiTabs from '@/components/Ui/DataDisplay/UiTabs.vue'
import ClientEditMainForm from './ClientEditMainForm.vue'
import ClientEditDocsForm from './ClientEditDocsForm.vue'
import ClientEditAdditionalForm from './ClientEditAdditionalForm.vue'
const nanoid = customAlphabet('abcdef', 10)

const formId = ref(nanoid(10))

const props = defineProps<{
  object: IObjectDto
}>()

const emits = defineEmits(['close'])

enum TabsIds {
  Main = 0,
  Docs = 1,
  Additional = 2,
  Fotos = 3,
  Integratinos = 4,
}

const tabs = [
  {
    id: TabsIds.Main,
    title: 'Основные данные',
  },
  {
    id: TabsIds.Docs,
    title: 'Документы',
  },
  {
    id: TabsIds.Additional,
    title: 'Дополнительно',
  },
  {
    id: TabsIds.Fotos,
    title: 'Фотографии',
  },
  {
    id: TabsIds.Integratinos,
    title: 'Интеграция',
  },
]

const activeTab = ref(TabsIds.Main)

const onChangeTab = ({ id }: { id: TabsIds }) => {
  activeTab.value = id
}

const close = () => {
  emits('close')
}
</script>

<style scoped lang="scss">
.client-edit-form {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 40px auto;
  overflow: hidden;
}
:deep(.tabs__scroller) {
  border-bottom: var(--border-default);
}
</style>
