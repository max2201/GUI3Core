<template>
  <div class="request-steps">
    <UiInfinityTabs
      class="request-steps__tabs"
      divided
      :tabs="stepsTabs"
      :active-tab-id="activeStepTabIndex"
      @tab-click="onChangeActiveStepTab"
    >
      <template #tab="{ tab, tabIndex }">
        <UiTab
          :submitted="!tab.data.editable && !isNew"
          compact
          transparent
          class="tabs_tab"
          :key="tab.id"
          :tab-index="tabIndex"
          :active="tab.id === activeStepTabIndex"
          :title="tab.title"
          @tab-click="onChangeActiveStepTab(tab)"
        >
          <template #prepend v-if="!isNew">
            <VDropdown
              :skidding="-2"
              container=".request-steps"
              class="request-steps__tab-menu-trigger"
              :class="{
                'request-steps__tab-menu-trigger--active':
                  tab.id === activeStepTabIndex && tab.data.editable,
              }"
              placement="bottom-start"
              :disabled="tab.id !== activeStepTabIndex"
              :distance="10"
            >
              <template #default="{ show }">
                <SvgIcon
                  v-if="tab.data.editable"
                  :width="16"
                  :height="16"
                  name="pencil"
                  @click.stop="tab.id === activeStepTabIndex && show()"
                />
                <SvgIcon
                  v-else
                  :width="16"
                  :height="16"
                  name="lock-wide"
                  @click.stop="tab.id === activeStepTabIndex && show()"
                />
              </template>
              <template #popper="{ hide }">
                <div class="request-steps__tab-menu">
                  <div class="request-steps__tab-menu-content">
                    <span class="request-steps__tab-menu-content-title"
                      >Статус: {{ tab.data.FieldGroupsStateTitle }}</span
                    >
                    <div class="request-steps__tab-menu-content-info">
                      <span>{{ tab.data.LastChangedDate }}</span>
                      <span>{{ tab.data.LastUserName }}</span>
                    </div>
                  </div>
                  <hr class="request-steps__tab-menu-divider" v-if="!tab.data.editable" />
                  <div class="request-steps__tab-menu-footer" v-if="!tab.data.editable">
                    <UiButton
                      :disabled="!isAllowSave"
                      class="request-steps__tab-menu-action"
                      :class="{ 'request-steps__tab-menu-action--disabled': !isAllowSave }"
                      theme="link"
                      icon-left="unlock-wide"
                      @click="isAllowSave && editStep(hide)"
                    >
                      <template #iconLeft>
                        <SvgIcon :width="20" :height="20" name="unlock-wide" />
                      </template>
                      Разблокировать
                    </UiButton>
                  </div>
                </div>
              </template>
            </VDropdown>
          </template>
        </UiTab>
      </template>
    </UiInfinityTabs>

    <div class="request-steps__content">
      <div class="request-steps__fields">
        <UiLoader :loading="loading" theme="page" not-transparent />
        <div
          v-for="(field, index) in currentStepFields"
          :key="objectId + field.Code"
          :class="['request-steps__field']"
          :style="[
            {
              'grid-column': getFieldGridSpan(field),
            },
          ]"
        >
          <UiFieldInput
            :id="field.UiId"
            :type="field.FieldType"
            :name="field.Code"
            :value="localValue[field.Code]"
            :label="field.Title"
            :options="getFieldOptions(field)"
            :has-modified="modifiedFields[field.Code]"
            :is-required="field.IsRequired"
            :dialog-anchor-id="id"
            :damage-value="field.DamagesValue"
            :disabled="!(isAllowSave && isEditModeActiveForCurrentStep)"
            :sub-fields="field.SubFields"
            :validator="field.Validator"
            :error="isInvalidFieldState(field)"
            @change="changeFieldValue([field.Code], $event)"
            @open-dialog="openFieldDialog(field, $event)"
            @close-dialog="closeOpenedDialog"
            @ready-to-focus-next="focusNextField(index)"
            @valid-state="onValidFieldState(field)"
            @set-reason-cancel="setReasonCancel"
          />
        </div>
      </div>

      <div class="request-steps__result">
        <slot name="result"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== Пропсы =====
import { computed, ref, toRaw, unref, watch } from 'vue'

import type { IObjectStep, IObjectStepField, IUiObjectStepField } from '@/core/interface/Object'
import { type IRequestDto } from '@/core/interface/Requests'
import { useObjectFieldServices } from '@/composables/use-object-field-services'
import { FieldGroupStates } from '@/core/constants/FieldGroupStates'
import { useObjectFieldDialog } from '@/composables/use-object-field-dialog'

const props = defineProps({
  object: { type: Object, required: true },
  steps: { type: Array, required: false },
  objectId: { type: Number, required: false },
  id: { type: String, required: false },
  loading: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isAllowSave: { type: Boolean, default: true },
  error: { type: Array<string>, default: [] },
})
const isPageMounted = ref(false)
const windowStore = useWindowStore()
const emits = defineEmits(['close', 'change', 'set-reason-cancel'])

const objectData = computed<IRequestDto[]>(() => {
  return props.object || []
})
const isEditModeActiveForCurrentStep = computed(() => {
  return props.isNew ? true : objectSteps.value[activeStepTabIndex.value].editable
})
const activateEditMode = () => {
  objectSteps.value[activeStepTabIndex.value].editable = true
}
const editStep = (hideFunction) => {
  hideFunction()
  activateEditMode()
}
// ---------------------------
// Поля формы
// ---------------------------
const localValue = defineModel<object>('modelValue', { default: {} })

const allStepsFields = computed<IUiObjectStepField[]>(() => {
  if (!isPageMounted.value) return []
  const data = objectData.value
  if (!data) return []

  return (
    (props.steps || []).reduce((acc, step) => {
      const preUiId = data.BaseObjectId + step.Code

      const stepFields = step.Fields.map((field) => ({
        ...field,
        UiId: preUiId + field.FieldType + field.Code,
        SubFields: field.SubFields?.map((subfield) => ({
          ...subfield,
          UiId: preUiId + field.FieldType + field.Code + subfield.Code,
        })),
      }))

      acc.push(...stepFields)
      return acc
    }, [] as IUiObjectStepField[]) || []
  )
})
const {
  form: currentForm,
  changeFieldValue,
  getFieldOptions,
  modifiedFields,
  focusNextField,
  updateFormFieldsFromSteps,
} = useObjectFieldServices(allStepsFields)

const objectSteps = computed<IObjectStep[]>(() => {
  return props.steps || []
})

const activeStepTabIndex = ref(0)
const stepsTabs = computed(() => {
  if (props.steps.length === 0) return []

  return objectSteps.value.map((step, index) => {
    return {
      id: index,
      title: step.Title,
      data: step,
    }
  })
})
watch(
  () => props.steps,
  () => {
    if (props.steps.length === 0) return

    activeStepTabIndex.value = 0
  },
)

const currentStep = computed(() => {
  return stepsTabs.value[activeStepTabIndex.value]?.data
})
const isSetFormData = ref(false)
watch(
  () => allStepsFields.value,
  () => {
    if (!isSetFormData.value) {
      updateFormFieldsFromSteps(allStepsFields.value)
      updateFieldDialogs()
    } else isSetFormData.value = false
  },
  {
    deep: true,
  },
)

watch(
  () => currentForm.value,
  () => {
    if (isPageMounted.value) {
      localValue.value = currentForm.value
    }
  },
  {
    deep: true,
  },
)
onMounted(() => {
  isPageMounted.value = true
  if (Object.keys(localValue.value).length !== 0) {
    isSetFormData.value = true
    currentForm.value = localValue.value
  } else {
    isSetFormData.value = false
    updateFormFieldsFromSteps(allStepsFields.value)
  }

  if (objectData.value?.activeStepTabIndex != null) {
    onChangeActiveStepTab({ id: objectData.value.activeStepTabIndex })
  } else {
    let current = stepsTabs.value.find((step) => {
      return step.data.FieldGroupState === FieldGroupStates.EditValues
    })
    if (!current) {
      current = stepsTabs.value.find((step) => {
        return step.data.FieldGroupState === FieldGroupStates.New
      })
    }

    if (current) {
      onChangeActiveStepTab(current)
    }
  }
})
const onChangeActiveStepTab = (tab) => {
  activeStepTabIndex.value = tab.id
  objectData.value!.activeStepTabIndex = tab.id
}

const currentStepFields = computed<IUiObjectStepField[]>(() => {
  if (!isPageMounted.value) return []
  if (!currentStep.value) return []
  if (!objectData.value) return []

  const preUiId = objectData.value.BaseObjectId + currentStep.value.Code

  return allStepsFields.value.filter((field) => field.UiId.startsWith(preUiId))
})
const FieldsAlwais4Span = [
  'complex_XL.Base|Classes.DriverLicence,XL.Base.UI|Classes.DriverLicence.frmViewDriverLicence,XL.Base.UI|Classes.DriverLicence.frmViewDriverLicence',
]
const getFieldGridSpan = (field: IObjectStepField) => {
  if (FieldsAlwais4Span.includes(field.FieldType)) {
    return 'span 2'
  }

  return field.Size > 1 ? 'span 2' : ''
}

// ---------------------------
// Методы
// ---------------------------
let saveOpenedDialog
let getOpenedDialog
let closeOpenedDialog
const updateFieldDialogs = () => {
  if (!objectData.value) return

  const objectFieldDialog = useObjectFieldDialog(
    objectData.value.BaseObjectType,
    objectData.value.BaseObjectId,
  )
  saveOpenedDialog = objectFieldDialog.saveOpenedDialog
  getOpenedDialog = objectFieldDialog.getOpenedDialog
  closeOpenedDialog = objectFieldDialog.closeOpenedDialog

  nextTick(() => {
    const openedDialog = getOpenedDialog()

    if (openedDialog) {
      EventBus.emit(GlobalEvents.ShowObjectFieldDialog, openedDialog)
    }
  })
}

const openFieldDialog = (field: IObjectStepField, data: any) => {
  saveOpenedDialog({
    fieldType: field.FieldType,
    fieldName: field.Code,
    params: data,
  })
}
const invalidFields = ref([])
watch(
  () => props.error,
  () => {
    if (props.error.length > 0) {
      invalidFields.value = props.error
      activeStepTabIndex.value = 0
    }
  },
  {
    deep: true,
  },
)

const isInvalidFieldState = (field: IObjectStepField) => {
  return invalidFields.value.some((error) => error.includes(field.Code))
}

const onValidFieldState = (field: IObjectStepField) => {
  invalidFields.value = invalidFields.value.filter((error) => !error.includes(field.Code))
}
const setReasonCancel = () => {
  emits('set-reason-cancel')
}
</script>

<style lang="scss" scoped>
/* Стили можно перенести без изменений из оригинального файла */
.request-steps {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 38px 1fr;
  overflow: hidden;

  :deep(.tabs__scroller) {
    border-bottom: var(--border-default);
  }

  &__tab-menu {
    width: 250px;
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    &-divider {
      border: none;
      height: 1px;
      margin: 0;
      padding: 0;
      background: #e3ebf1;
    }

    &-content {
      padding: 4px 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      &-title {
        font-family: Inter;
        font-size: 12px;
        font-weight: 500;
        line-height: 14.4px;
        color: #8990a2;
      }

      &-info {
        font-size: 14px;
        font-weight: 400;
        line-height: 16.8px;
        color: #23282f;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }

    &-trigger {
      margin-right: 4px;
      color: #458940;

      &--active {
        color: #1a8ff2;
      }

      svg {
        max-width: unset;
      }
    }

    &-footer {
      font-size: 14px;
      font-weight: 500;
      line-height: 19.6px;
      align-items: center;
      padding: 4px 8px;
      display: flex;
      gap: 8px;
      color: #23282f;
    }

    &-action {
      :deep(.button__content) {
        padding: 0 !important;
        color: #23282f;
        font-family: Inter;
        gap: 8px;

        .svg-icon {
          color: #8990a2;
        }
      }

      &:hover {
        :deep(.button__content) {
          color: var(--color-primary);

          .svg-icon {
            color: var(--color-primary);
          }
        }
      }

      &--disabled {
        cursor: no-drop;
        pointer-events: auto !important;

        &:hover {
          :deep(.button__content) {
            color: #23282f;

            .svg-icon {
              color: #8990a2;
            }
          }
        }
      }
    }
  }

  &__fields {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 4px));
    grid-auto-rows: min-content;
    gap: 8px;
    position: relative;
    padding: 24px;
    overflow-y: auto;
  }
}

.request-steps__content {
  display: grid;
  grid-template-columns: 540px auto;
  grid-template-rows: 1fr;
  overflow: hidden;
  overflow-y: auto;
}

@media (max-width: 1200px) {
  .request-steps__content {
    grid-template-columns: 270px 280px;
  }
}

.request-steps__fields {
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 4px));
  grid-auto-rows: min-content;
  gap: 8px;
  position: relative;
  padding: 24px;
  overflow-y: auto;
}

.request-steps__result {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 24px 24px;
  border-left: 1px solid var(--color-border);
  background-color: var(--color-background);
  overflow: auto;
}
</style>
