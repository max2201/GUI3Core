<template>
  <div v-if="flags" class="window-flags" :class="[{ 'window-flags_empty': !flags.length }]">
    <UiButton1
      class="window-flags__plus"
      @click="handleClickAddFlag"
      icon-left="plus-circle"
      variant="text"
      :icon-size="24"
      ><span v-if="!flags.length"> Добавить флаг </span></UiButton1
    >

    <div class="window-flags__wrapper">
      <ObjectFlag
        v-for="(flag, index) in flags"
        :key="index"
        :flag="flag"
        @click="() => handleClickFlag(flag)"
      />
    </div>

    <UiModal
      v-if="showEditModal"
      :name="EditModalName"
      size="normal"
      is-custom-form
      @close="() => (showEditModal = false)"
    >
      <div class="modal-edit-flag">
        <h3 class="mb-6">Редактирование флага</h3>

        <div class="modal-edit-flag__form">
          <div>
            <ObjectFlag v-if="editObjectForm.flag" :flag="editObjectForm.flag" passive />
          </div>

          <UiInput1
            v-model="editObjectForm.comment"
            :placeholder="editModalDisabled ? '' : 'Комментарий'"
            :disabled="editModalDisabled"
            :error="editObjectValidations.comment"
            label="Комментарий"
            type="textarea"
            readable-disable-mode
          />

          <div v-if="editObjectForm.flag?.UserName">
            <span class="d-inline-block color-gray mb-1">Последнее изменение:</span><br />
            {{ editObjectForm.flag?.UserName }}: {{ editObjectForm.flag?.AddingTime }}
          </div>
        </div>
      </div>

      <template #buttons>
        <div class="modal-edit-flag__buttons">
          <p v-if="isConfirm">Подтверждаете удаление?</p>
          <div>
            <UiButton1
              v-if="editModalDisabled"
              class="mr-2"
              variant="outline"
              size="large"
              @click="handleCloseEditModal"
            >
              Закрыть
            </UiButton1>
            <UiButton1
              v-if="!editModalDisabled && !isConfirm"
              variant="outline"
              theme="danger"
              size="large"
              @click="handleDeleteFlag"
            >
              Удалить флаг
            </UiButton1>
          </div>
          <div class="modal-edit-flag__buttons-right">
            <template v-if="!isConfirm">
              <UiButton1
                class="mr-2"
                v-if="!editModalDisabled"
                variant="outline"
                size="large"
                @click="handleCloseEditModal"
              >
                Отмена
              </UiButton1>
              <UiButton1 size="large" :loading="loadingEditFlag" @click="handleEditFlag">
                {{ editModalDisabled ? 'Изменить' : 'Сохранить' }}
              </UiButton1>
            </template>
            <template v-else>
              <UiButton1 variant="outline" size="large" @click="handleCancelConfirm">
                {{ 'Отмена' }}
              </UiButton1>
              <UiButton1 size="large" :loading="loadingEditFlag" @click="handleConfirmDelete">
                {{ 'Подтвердить' }}
              </UiButton1>
            </template>
          </div>
        </div>
      </template>
    </UiModal>

    <NewFlagModal v-if="activeTab?.object" :object="activeTab.object" />
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import type { IObjectDto, IObjectFlag } from '@/core/interface/Object'
import { ValidateObject, SetFlagToObject, DelFlagFromObject } from '@/core/api/object.api'
import { OperationCode } from '@/core/constants/OperationCode'
import { FieldsValCode } from '@/core/constants/FieldsValCode'
import { ValidErrorCodes } from '@/core/constants/ValidErrorCodes'
import { UiModal } from '@/components/Ui'
import { AddModalName } from '@/core/constants/ModalsNames'
const dialogStore = useWindowStore()
const { activeTab } = storeToRefs(dialogStore)
const sharedModals = useSharedModalsStore()

const objectState = ref<IObjectDto | undefined>()

watch(
  () => activeTab.value,
  () => {
    objectState.value = activeTab.value?.object.currentState
  },
)

const flags = computed<IObjectFlag[] | null>((): IObjectFlag[] | null => {
  const itemFlags = activeTab.value?.object?.getFlags()

  if (!itemFlags) return null

  return itemFlags
})

const EditModalName = 'object-flag-edit'
const showEditModal = ref<boolean>(false)
const editModalDisabled = ref<boolean>(true)
const editObjectForm = reactive<{
  flag: IObjectFlag | null
  comment: string
}>({
  flag: null,
  comment: '',
})

const editObjectValidations = reactive<{
  comment: any
}>({
  comment: '',
})

watch(
  () => editObjectForm.comment,
  () => {
    editObjectValidations.comment = ''
  },
)

const clearEditValidation = () => {
  editObjectValidations.comment = ''
}

const handleClickFlag = (flag: IObjectFlag) => {
  editObjectForm.comment = flag.Comment
  editObjectForm.flag = flag
  editModalDisabled.value = true
  clearEditValidation()

  showEditModal.value = true
  sharedModals.setModal({
    name: EditModalName,
  })
}

const handleClickAddFlag = () => {
  sharedModals.setModal({
    name: AddModalName,
  })
}

const handleEditFlag = async () => {
  if (editModalDisabled.value) {
    editModalDisabled.value = false
    return
  }

  const object = activeTab.value?.object

  if (!object) {
    return
  }

  const txtDescription = editObjectForm.comment
  const ddlFlags = editObjectForm.flag?.TemplateId

  if (!ddlFlags) {
    return
  }

  loadingEditFlag.value = true

  const { data } = await ValidateObject({
    BaseObjectType: object.type,
    ObjectId: object.id,
    OperationCode: OperationCode.addFlag,
    Vals: {
      [FieldsValCode.ddlFlags]: ddlFlags,
      [FieldsValCode.txtDescription]: txtDescription,
    },
  })

  if (data?.TotalOk) {
    const { data } = await SetFlagToObject({
      ObjectId: object.id,
      BaseObjectType: object.type,
      TemplateId: ddlFlags,
      Description: txtDescription,
    })

    object.setFlags(data)
    sharedModals.closeModal()
  } else {
    const fieldsWIthErrors = data?.Results.filter((r) => r.ErrorCode !== ValidErrorCodes.Unknown)

    fieldsWIthErrors?.forEach((fieldValidation) => {
      if (fieldValidation.FieldCode === FieldsValCode.txtDescription) {
        editObjectValidations.comment = fieldValidation.ErrorDesription
      }
    })
  }

  loadingEditFlag.value = false
}

const loadingEditFlag = ref(false)

const isConfirm = ref(false)
const handleCancelConfirm = () => {
  isConfirm.value = false
}
async function handleDeleteFlag() {
  isConfirm.value = true
}

async function handleConfirmDelete() {
  const object = activeTab.value?.object
  if (!object) {
    return
  }

  loadingEditFlag.value = true

  const { data } = await DelFlagFromObject({
    ObjectId: object.id,
    BaseObjectType: object.type,
    TemplateId: editObjectForm.flag?.TemplateId as number,
  })

  object.setFlags(data)
  loadingEditFlag.value = false
  sharedModals.closeModal()
  isConfirm.value = false
}

function handleCancelDelete() {
  isConfirm.value = false
}

const handleCloseEditModal = () => {
  if (editModalDisabled.value) {
    sharedModals.closeModal()
  } else {
    clearEditValidation()
    editModalDisabled.value = true
    editObjectForm.comment = editObjectForm.flag?.Comment || ''
  }
}
</script>

<style setup lang="scss">
.window-flags {
  display: grid;
  grid-template-columns: 24px auto;
  grid-gap: 10px;
  padding: 10px 15px;

  &_empty {
    grid-template-columns: 200px auto;
  }

  &__plus {
    font-weight: var(--font-weight-400) !important;

    &:not(:hover) {
      .ui-button__text {
        color: var(--color-font) !important;
      }
    }
  }

  &__wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 3px 40px;
  }
}

.modal-edit-flag__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  > * {
    width: 100%;
  }
}

.modal-edit-flag__buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  p {
    line-height: initial;
  }
}

.modal-edit-flag__buttons-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
