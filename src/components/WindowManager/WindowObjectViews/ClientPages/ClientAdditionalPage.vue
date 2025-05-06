<template>
  <div class="client-page client-additional-page">
    <div class="client-additional-page__middle-section">
      <div class="client-additional-page__middle-section__left">
        <div class="about-column">
          <TypeGroupRenderer
            v-if="objectData?.NotificationsBlockGroup"
            :key="`group-${objectData.NotificationsBlockGroup.Code}`"
            class="call-edit-page__linked-object-group"
            :group="objectData.NotificationsBlockGroup"
          >
            <template #fields="{ fields }">
              <TypeFieldRenderer
                v-for="field in fields"
                :key="`field-${field.Code}`"
                :field="field"
              ></TypeFieldRenderer>
            </template>
          </TypeGroupRenderer>
          <TypeGroupRenderer
            v-if="objectData?.CustomCodeGroups"
            :key="`group-${objectData?.CustomCodeGroups.Code}`"
            class="call-edit-page__linked-object-group"
            :group="objectData?.CustomCodeGroups"
          >
            <template #fields="{ fields }">
              <TypeFieldRenderer
                v-for="field in fields"
                :key="`field-${field.Code}`"
                :field="field"
              ></TypeFieldRenderer>
            </template>
          </TypeGroupRenderer>
          <TypeGroupRenderer :group="objectData?.ClientDiscountGroup">
            <template #fields="{ fields }">
              <TypeFieldRenderer
                v-for="field in fields"
                :key="`field-${field.Code}`"
                :field="field"
              ></TypeFieldRenderer> </template
          ></TypeGroupRenderer>
        </div>
      </div>

      <div class="client-additional-page__middle-section__right">
        <div class="main__tables">
          <CollectionTable
            v-if="objectData?.ContactPersonsInfo"
            type="contact"
            :object="objectData?.ContactPersonsInfo"
          ></CollectionTable>
          <CollectionTable
            v-if="objectData?.ReverseContactPersonsInfo"
            type="clients"
            :object="objectData.ReverseContactPersonsInfo"
          ></CollectionTable>
          <CollectionTable
            v-if="objectData?.BankCardsInfo"
            type="card"
            :object="objectData.BankCardsInfo"
          ></CollectionTable>
        </div>

        <div class="main__entities"></div>
      </div>
    </div>

    <div class="client-additional-page__actions">
      <UiButton1 :loading="loadingCreateNew" variant="outline" @click="onClickCreateNew">
        Добавить клиента
      </UiButton1>
      <UiButton1 :loading="loadingEdit" @click="onClickEdit"> Изменить </UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import InlineFileInfo from '@/components/Ui/DataDisplay/InlineFileInfo.vue'
import SvgIcon from '@/components/Ui/DataDisplay/SvgIcon.vue'
import type { IObjectDto } from '@/core/interface/Object'
import type { ClientObject } from '@/core/model/ClientObject'
import { useToast } from 'vue-toastification/dist/index.mjs'
import {
  ClientUpdateAdditionalData,
  ClientUpdateAdditionalDataValidate,
} from '@/core/api/clients.api'
import type { IClientDto, IContactPersonsInfo } from '@/core/interface/Client'
import { BaseObjectType } from '@/core/constants/BaseObjectType'

const props = defineProps<{
  objectId: number
  loadingCreateNew: boolean
  loadingEdit: boolean
}>()

const windowStore = useWindowStore()
const toast = useToast()

let object: ClientObject
const objectData = ref<IClientDto | null>(null)

const emits = defineEmits(['edit', 'create-new'])

const onClickCreateNew = () => {
  emits('create-new')
}
const onClickEdit = () => {
  emits('edit')
}

const isCommentEditing = computed({
  get() {
    return objectData.value?.CommentField.editing
  },
  set(newValue) {
    objectData.value.CommentField.editing = newValue
  },
})

const isLoadingCommentUpdate = ref(false)
const CommentValidationError = ref('')
const commentInput = async (newComment: string) => {
  objectData.value.CommentField.currentVal = newComment
}
const editCommentSave = async () => {
  CommentValidationError.value = ''
  isLoadingCommentUpdate.value = true

  const payload = {
    ObjectId: props.objectId,
    Vals: {
      txtComment: objectData.value.CommentField.currentVal,
    },
  }

  const validation = await ClientUpdateAdditionalDataValidate(payload)

  if (validation.error) {
    toast.error('Не удалось обновить поле')
    isLoadingCommentUpdate.value = false
    return
  }
  if (validation.data && !validation.data.TotalOk) {
    isLoadingCommentUpdate.value = false
    CommentValidationError.value =
      validation.data.Results?.txtComment?.ErrorDesription || 'Ошибкa валидации'
    return
  }

  const { error } = await ClientUpdateAdditionalData(payload)
  if (error) {
    isLoadingCommentUpdate.value = false
    toast.error(error[0].Message)
    return
  }

  await object.loadData()
  objectData.value = object.getCurrentState()
  isLoadingCommentUpdate.value = false
  isCommentEditing.value = false
  toast.success('Краткая характеристика успешно обновлена')
}

const isBlockNewDeals = ref(true)
watch(
  () => props.objectId,
  () => {
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
</script>

<style scoped lang="scss">
@import './clientPages.scss';

.client-additional-page__actions {
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

.client-additional-page__middle-section {
  display: grid;
  grid-template-columns: 406px auto;
  grid-template-rows: 1fr;
  overflow: hidden;
}
.client-additional-page__middle-section__left {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  overflow: hidden;
}

.client-additional-page__middle-section__right {
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 24px;
  padding-top: 20px;
}

.about-column,
.info-panel {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.about-column {
  padding: 20px 24px;
  gap: 20px;
}
.main__tables {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.client-foto {
  display: block;
  background-color: darkturquoise;
  width: 252px;
  height: 160px;
}
.disable-client-deal {
  display: flex;
  gap: 6px;
  align-items: center;
  height: 32px;
  background-color: var(--component-danger-background);
  padding: 6px 0 6px 6px;
  border-radius: 5px;
  overflow: hidden;

  > svg {
    color: var(--component-danger);
  }
}
.short-info {
  display: flex;
  flex-direction: column;
  gap: 3px;

  &__error {
    font-size: var(--font-size-standart);
    color: var(--color-red);
  }
}
.short-info__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.short-info__header__title {
  color: var(--color-gray);
}
.short-info__body {
}
.documents-for-print {
  display: flex;
  flex-direction: column;
  width: 253px;
  gap: 12px;
}
</style>
