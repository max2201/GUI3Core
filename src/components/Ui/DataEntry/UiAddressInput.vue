<template>
  <UiFieldInputWrapper :label="label" :is-required="isRequired">
    <div class="ui-address-input">
      <UiInput1
        :id="id"
        v-model="inputValue"
        ref="inputRef"
        :additionalClass="['ui-address-input__input']"
        :disabled="disabled || isLoadingVerifyResult"
        @on-change="onChangeInputValue"
      />
      <IconButton
        :width="32"
        :height="32"
        :additionalClass="['ui-address-input__button-check']"
        :disabled="disabled || isLoadingVerifyResult"
        name="checkmark"
        padding="6px"
        outlined
        @click.stop="onClickVerify"
      />
      <IconButton
        :width="32"
        :height="32"
        :additionalClass="['ui-address-input__button-details']"
        :disabled="isLoadingVerifyResult"
        :success-outlined="recognitionResult === RecognitionResult.Success"
        :warning-outlined="
          [RecognitionResult.Fail, RecognitionResult.Warning].includes(recognitionResult)
        "
        :unexpected-outlined="recognitionResult === RecognitionResult.Manual"
        name="search"
        padding="6px"
        outlined
        @click.stop="onClickShowDetails"
      />

      <UiFieldDetialsModal
        compact
        :anchor-id="dialogAnchorId"
        :title="label || ''"
        :is-open="isOpenDetails"
        @close="onCloseDetails"
      >
        <PanelListGroup :group="{ Fields: detailsFields, HideTitle: true }">
          <template #fields="{ fields }">
            <SimpleViewField v-for="field in fields" :key="field.type" :field="field">
              <template #action v-if="field.type === DetailsFields.Geo">
                <UiButton1
                  v-if="value?.GeoLink"
                  variant="text"
                  @click="openGeo"
                  theme="transparent"
                  icon-left="arrow-circle-right"
                  :icon-size="20"
                  title="Открыть на карте"
                />
              </template>
            </SimpleViewField>
          </template>
        </PanelListGroup>
      </UiFieldDetialsModal>
    </div>
  </UiFieldInputWrapper>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { toRaw, unref } from 'vue'
import { getAddressRecognition } from '@/core/api/object.api'
import { RecognitionResult } from '@/core/constants/RecognitionResult'
import { FieldType } from '@/core/constants/FieldType'
import type { IAddressValue } from '@/core/interface/Object'
import { useFieldInputEvents } from '@/composables/use-object-field-dialog'
import SimpleViewField from '@c/Ui/DataDisplay/Fields/SimpleViewField.vue'
import { SystemColorsValue } from '@/core/constants/SystemColors'
const inputRef = ref<HTMLInputElement | null>(null)

const props = defineProps<{
  name: string
  dialogAnchorId: string
  label?: string
  value?: IAddressValue
  disabled?: boolean
  isRequired?: boolean
  id?: string
}>()

const emits = defineEmits(['change', 'open-dialog', 'close-dialog'])

enum DetailsFields {
  ValidationStatusString = 'ValidationStatusString',
  ObjectType = 'ObjectType',
  flat_area = 'flat_area',
  flat_price = 'flat_price',
  Geo = 'Geo',
}

const recognitionResult = ref(RecognitionResult.None)

const inputValue = ref('')
const detailsFieldValues = ref({
  [DetailsFields.ValidationStatusString]: '',
  [DetailsFields.ObjectType]: '',
  [DetailsFields.flat_area]: '',
  [DetailsFields.flat_price]: '',
  [DetailsFields.Geo]: '',
})

const updateDetailsFieldsValues = (data: IAddressValue = {} as any) => {
  detailsFieldValues.value[DetailsFields.ValidationStatusString] =
    data[DetailsFields.ValidationStatusString] || ''
  detailsFieldValues.value[DetailsFields.ObjectType] = data[DetailsFields.ObjectType] || ''
  detailsFieldValues.value[DetailsFields.flat_area] = data[DetailsFields.flat_area] || ''
  detailsFieldValues.value[DetailsFields.flat_price] = data[DetailsFields.flat_price] || ''
  detailsFieldValues.value[DetailsFields.Geo] = data[DetailsFields.Geo] || ''
}

watch(
  () => props.value,
  (newValue) => {
    if (!newValue) return

    recognitionResult.value = newValue.ValidationStatus || RecognitionResult.None
    inputValue.value = props.value?.DisplayAddress || ''

    updateDetailsFieldsValues(newValue)
  },
  {
    immediate: true,
  },
)

const onChangeInputValue = (value: string) => {
  if (value === props.value?.result) return

  emits('change', {
    ...cloneDeep(toRaw(props.value)),
    ValidationStatus: RecognitionResult.Manual,
    DisplayAddress: value,
  })
}

const detailsFields = computed(() => {
  return [
    {
      type: DetailsFields.ValidationStatusString,
      Title: 'Статус',
      Value: detailsFieldValues.value[DetailsFields.ValidationStatusString] || '-',
      SystemColor: (() => {
        switch (recognitionResult.value) {
          case RecognitionResult.Success:
            return SystemColorsValue.Result
          case RecognitionResult.Fail:
            return SystemColorsValue.Danger
          case RecognitionResult.Warning:
            return SystemColorsValue.Warning
          default:
            return ''
        }
      })(),
    },
    {
      type: DetailsFields.ObjectType,
      Title: 'Тип объекта',
      Value: detailsFieldValues.value[DetailsFields.ObjectType] || '-',
      SystemColor:
        detailsFieldValues.value[DetailsFields.ObjectType] === 'неизвестно'
          ? SystemColorsValue.Blue
          : '',
    },
    {
      type: DetailsFields.flat_area,
      Title: 'Площадь',
      Value: detailsFieldValues.value[DetailsFields.flat_area] || '-',
      SystemColor:
        detailsFieldValues.value[DetailsFields.flat_area] === 'неизвестно'
          ? SystemColorsValue.Blue
          : '',
    },
    {
      type: DetailsFields.flat_price,
      Title: 'Примерная цена',
      Value: detailsFieldValues.value[DetailsFields.flat_price] || '-',
      SystemColor:
        detailsFieldValues.value[DetailsFields.flat_price] === 'неизвестно'
          ? SystemColorsValue.Blue
          : '',
    },
    {
      type: DetailsFields.Geo,
      Title: 'Геолокация',
      Value: detailsFieldValues.value[DetailsFields.Geo] || '-',
      SystemColor:
        detailsFieldValues.value[DetailsFields.Geo] === 'неизвестно' ? SystemColorsValue.Blue : '',
    },
  ]
})

const isLoadingVerifyResult = ref(false)

const onClickVerify = () => {
  if (!inputValue.value) return

  isLoadingVerifyResult.value = true

  getAddressRecognition({
    StringParamValue: inputValue.value,
  })
    .then(({ data, error }) => {
      if (!data || error) {
        console.error('getAddressRecognition, error', error)
        return
      }

      emits('change', toRaw(data))
    })
    .finally(() => {
      isLoadingVerifyResult.value = false
    })
}

const isOpenDetails = ref(false)

const onClickShowDetails = () => {
  isOpenDetails.value = !isOpenDetails.value
  emits('open-dialog', {
    ...toRaw(unref(detailsFieldValues)),
  })
}

const onCloseDetails = () => {
  isOpenDetails.value = false
  updateDetailsFieldsValues(props.value)
  emits('close-dialog')
}

const openGeo = () => {
  if (!props.value?.GeoLink) return

  window.open(props.value.GeoLink, '_blank')
}

const showSavedDetails = (data: any) => {
  onClickShowDetails()
  updateDetailsFieldsValues(data)
}

const onEventGlobalFocus = (id: string) => {
  if (!props.id || id !== props.id) return

  inputRef.value?.focus()
}
// Отписываемся от события при уничтожении компонента
onBeforeUnmount(() => {
  EventBus.off(GlobalEvents.FocusElement, onEventGlobalFocus)
})
// Подписываемся на событие при монтировании
onMounted(() => {
  EventBus.on(GlobalEvents.FocusElement, onEventGlobalFocus)
})
</script>

<style lang="scss" scoped>
.ui-address-input {
  display: inline-flex;
  align-items: center;
  width: 100%;

  &__input {
    width: 100%;

    :deep(.ui-input__wrapper) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  &__button-check {
    border-radius: 0;
    background-color: var(--color-background);
  }

  &__button-details {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: var(--color-background);
  }
}

.ui-address-input-details__wrapper {
  position: fixed;
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-index-input-modal);
}

.ui-address-input-details {
  &__field {
    display: grid;
    align-items: center;
    grid-template-columns: 160px auto;
    height: 32px;
    border-bottom: 1px solid var(--color-border);

    &__title {
      display: flex;
      align-items: center;
      color: var(--color-gray);
      height: 32px;
    }

    &__value {
      height: 32px;
      padding-left: 14px;
      overflow: hidden;
      display: flex;
      align-items: center;
      gap: 3px;
    }
  }
}

.ui-address-input-details__field__value_success {
  background-color: var(--component-green-background);
}

.ui-address-input-details__field__value_warning {
  background-color: var(--component-warning);
}
</style>
