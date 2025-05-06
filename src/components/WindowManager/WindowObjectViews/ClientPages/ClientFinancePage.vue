<template>
  <div class="client-page client-finance-page">
    <div class="client-finance-page__middle-section">
      <div class="main__tables">
        <TableObject
          v-if="objectData"
          :object="objectData"
          :table-key="AdditionalTables.AccruedPaysModule"
        ></TableObject>
        <TableObject
          v-if="objectData"
          :object="objectData"
          :table-key="AdditionalTables.MoneyMoveModule"
        ></TableObject>
      </div>
    </div>

    <div class="client-finance-page__actions">
      <UiButton1 :loading="loadingEdit" @click="onClickEdit"> Изменить </UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClientObject } from '@/core/model/ClientObject'
import { useToast } from 'vue-toastification/dist/index.mjs'

import type { IClientDto } from '@/core/interface/Client'
const props = defineProps<{
  objectId: number
  loadingCreateNew: boolean
  loadingEdit: boolean
}>()

const windowStore = useWindowStore()
const toast = useToast()
enum AdditionalTables {
  AccruedPaysModule = 'formtable_XL.Base.Modules.DtoFactory.Clients.ClientDtoFactory_clientTables_AccruedPaysModule',
  MoneyMoveModule = 'formtable_XL.Base.Modules.DtoFactory.Clients.ClientDtoFactory_clientTables_MoneyMoveModule',
}
const object = ref<ClientObject | null>(null)
const objectData = ref<IClientDto | null>(null)

const emits = defineEmits(['edit', 'create-new'])

const onClickCreateNew = () => {
  emits('create-new')
}
const onClickEdit = () => {
  emits('edit')
}

watch(
  () => props.objectId,
  () => {
    if (props.objectId === undefined) {
      object.value = null
      objectData.value = null
      return
    }

    object.value = windowStore.objectByTabId(props.objectId)

    if (!object.value) {
      object.value = null
      objectData.value = null
      return
    }

    objectData.value = object.value.getCurrentState()
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
@import './clientPages.scss';

.client-finance-page__actions {
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 30px;

  button:not(:last-child) {
    margin-right: 8px;
  }
}
.main__tables {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.client-finance-page__middle-section {
  padding: 20px 24px;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 1fr;
  overflow: hidden;
}

.client-additional-page__middle-section__right {
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 24px;
  padding-top: 20px;
}
</style>
