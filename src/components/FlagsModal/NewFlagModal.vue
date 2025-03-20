<template>
  <UiModal :name="AddModalName" size="normal" is-form @close="clearForm">
    <div class="modal-edit-flag">
      <h3 class="mb-6">Добавление флага</h3>

      <div class="modal-edit-flag__form">
        <UiSelect1
          placeholder="Выберите"
          v-model="addObjectForm.flag"
          :options="flagsSelectItems"
          select-label="Выберите флаг"
        />

        <UiInput1
          v-model="addObjectForm.comment"
          :error="addObjectValidations.comment"
          label="Комментарий"
          type="textarea"
        />
      </div>
    </div>

    <template #buttons>
      <div class="modal-edit-flag__buttons">
        <div></div>
        <div>
          <UiButton1
            :loading="loadingSaveFlag"
            :disabled="!addObjectForm.flag"
            @click="handleSaveNewFlag"
          >
            Сохранить
          </UiButton1>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { FieldsValCode } from '@/core/constants/FieldsValCode'
import { OperationCode } from '@/core/constants/OperationCode'
import { ValidateObject, SetFlagToObject } from '@/core/api/object.api'
import { ValidErrorCodes } from '@/core/constants/ValidErrorCodes'
import { AddModalName } from '@/core/constants/ModalsNames'
import { BaseObject } from '@/core/model/BaseObject'

const loadingSaveFlag = ref(false)
const sharedModals = useSharedModalsStore()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const props = defineProps<{
  object: BaseObject
}>()

interface FlagSelectItem {
  value: number
  label: string
}

const addObjectForm = reactive<{
  flag: FlagSelectItem | undefined
  comment: string
}>({
  flag: undefined,
  comment: '',
})

const addObjectValidations = reactive<{
  flag: any
  comment: any
}>({
  flag: '',
  comment: '',
})

const availableFlags = computed(() => {
  if (!props.object?.type) return []

  return user.value?.UserFlags[props.object.type] || []
})

const flagsSelectItems = computed(() => {
  return availableFlags.value.map((flag) => {
    return {
      value: flag.TemplateId,
      label: flag.Title,
    }
  })
})

const handleSaveNewFlag = async () => {
  if (!props.object) {
    return
  }

  const txtDescription = addObjectForm.comment
  const ddlFlags = addObjectForm.flag?.value

  if (!ddlFlags) {
    return
  }

  loadingSaveFlag.value = true

  const { data } = await ValidateObject({
    BaseObjectType: props.object.type,
    ObjectId: props.object.id,
    OperationCode: OperationCode.addFlag,
    Vals: {
      [FieldsValCode.ddlFlags]: ddlFlags,
      [FieldsValCode.txtDescription]: txtDescription,
    },
  })

  if (data?.TotalOk) {
    const { data } = await SetFlagToObject({
      ObjectId: props.object.id,
      BaseObjectType: props.object.type,
      TemplateId: ddlFlags,
      Description: txtDescription,
    })

    props.object.setFlags(data)
    clearForm()
    sharedModals.closeModal()
  } else {
    const fieldsWIthErrors = data?.Results.filter((r) => r.ErrorCode !== ValidErrorCodes.Unknown)

    fieldsWIthErrors?.forEach((fieldValidation) => {
      if (fieldValidation.FieldCode === FieldsValCode.txtDescription) {
        addObjectValidations.comment = fieldValidation.ErrorDesription
      }
    })
  }

  loadingSaveFlag.value = false
}

const clearForm = () => {
  addObjectForm.comment = ''
  addObjectForm.flag = ''
}

watch(
  () => addObjectForm.comment,
  () => {
    addObjectValidations.comment = ''
  },
)

const handleCloseAddModal = () => {
  sharedModals.closeModal()
}
</script>

<style scoped lang="scss"></style>
