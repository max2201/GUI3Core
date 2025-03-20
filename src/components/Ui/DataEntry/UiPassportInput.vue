<template>
  <UiFieldInputWrapper :label="label" :has-modified="hasModifiedField" :is-required="isRequired">
    <div class="ui-passport-input">
      <span class="ui-passport-input__value" :title="valueString">{{
        valueString || 'Нет значения'
      }}</span>
      <div class="ui-passport-input__buttons">
        <IconButton
          v-if="!disabled && valueString"
          :width="32"
          :height="32"
          :additionalClass="['ui-passport-input__button-clear']"
          :disabled="disabled"
          name="close"
          padding="6px"
          outlined
          @click.stop="onClickClear"
        />
        <IconButton
          v-if="!disabled"
          :width="32"
          :height="32"
          :additionalClass="['ui-passport-input__button-check']"
          :disabled="disabled"
          name="pencil"
          padding="6px"
          outlined
          @click.stop="onClickShowDetails"
        />
        <IconButton
          v-else
          :width="32"
          :height="32"
          :additionalClass="['ui-passport-input__button-check']"
          name="search"
          padding="6px"
          outlined
          @click.stop="onClickShowDetails"
        />
      </div>

      <UiFieldDetialsModal
        :compact="!isFull"
        :anchor-id="dialogAnchorId"
        :title="label || ''"
        :is-open="isOpenForm"
        @close="onCloseDetails"
      >
        <div class="ui-passport-input__form">
          <UiSelect1
            :disabled="disabled"
            v-model="passportData.DocumentType"
            :options="PASSPORT_TYPE_OPTIONS"
            :additional-class="['span-2']"
            :reduce="(val) => val.value"
          ></UiSelect1>

          <template v-if="passportData.DocumentType === PassportTypes.PassportRf">
            <UiFieldInput
              id="RfSeries"
              :type="FieldType.Input"
              :value="passportData.PassportRf.Series"
              label="Серия"
              mask="####"
              is-required
              validator="maska"
              :disabled="disabled"
              @change="passportData.PassportRf.Series = $event"
              @valid-state="setFieldValidationState('PassportRf', 'Series', true)"
              @invalid-state="setFieldValidationState('PassportRf', 'Series', false)"
              @ready-to-focus-next="focusNextField('RfNumber')"
            />
            <UiFieldInput
              id="RfNumber"
              :type="FieldType.Input"
              :value="passportData.PassportRf.Number"
              label="Номер"
              mask="######"
              is-required
              validator="maska"
              :disabled="disabled"
              @change="passportData.PassportRf.Number = $event"
              @valid-state="setFieldValidationState('PassportRf', 'Number', true)"
              @invalid-state="setFieldValidationState('PassportRf', 'Number', false)"
              @ready-to-focus-next="focusNextField('RfIssuedDate')"
            />
            <UiFieldInput
              id="RfIssuedDate"
              :type="FieldType.DateString"
              :value="passportData.PassportRf.IssuedDate"
              label="Дата получения"
              is-required
              :disabled="disabled"
              @change="passportData.PassportRf.IssuedDate = $event"
              @valid-state="setFieldValidationState('PassportRf', 'IssuedDate', true)"
              @invalid-state="setFieldValidationState('PassportRf', 'IssuedDate', false)"
              @ready-to-focus-next="focusNextField('RfIssuedPlaceNo')"
            />
            <UiFieldInput
              v-if="isFull"
              id="RfIssuedPlaceNo"
              :type="FieldType.Input"
              :value="passportData.PassportRf.IssuedPlaceNo"
              label="Код подразделения"
              mask="###-###"
              is-required
              validator="maska"
              :disabled="disabled"
              @change="passportData.PassportRf.IssuedPlaceNo = $event"
              @valid-state="setFieldValidationState('PassportRf', 'IssuedPlaceNo', true)"
              @invalid-state="setFieldValidationState('PassportRf', 'IssuedPlaceNo', false)"
            />
          </template>
          <template v-else-if="passportData.DocumentType === PassportTypes.PassportForegin">
            <UiFieldInput
              id="ForeginCitizenship"
              :type="FieldType.Input"
              :value="passportData.PassportForegin.Citizenship"
              label="Гражданство"
              is-required
              :disabled="disabled"
              @change="passportData.PassportForegin.Citizenship = $event"
              @valid-state="setFieldValidationState('PassportForegin', 'Citizenship', true)"
              @invalid-state="setFieldValidationState('PassportForegin', 'Citizenship', false)"
            />
            <UiFieldInput
              id="ForeginNumber"
              :type="FieldType.Input"
              :value="passportData.PassportForegin.Number"
              label="Номер"
              is-required
              :disabled="disabled"
              @change="passportData.PassportForegin.Number = $event"
              @valid-state="setFieldValidationState('PassportForegin', 'Number', true)"
              @invalid-state="setFieldValidationState('PassportForegin', 'Number', false)"
              @ready-to-focus-next="focusNextField('ForeginRegistryDate')"
            />
            <UiFieldInput
              id="ForeginRegistryDate"
              :type="FieldType.DateString"
              :value="passportData.PassportForegin.RegistryDate"
              label="Дата получения"
              is-required
              :disabled="disabled"
              @change="passportData.PassportForegin.RegistryDate = $event"
              @valid-state="setFieldValidationState('PassportForegin', 'RegistryDate', true)"
              @invalid-state="setFieldValidationState('PassportForegin', 'RegistryDate', false)"
              @ready-to-focus-next="focusNextField('ForeginExpirationDate')"
            />
            <UiFieldInput
              id="ForeginExpirationDate"
              :type="FieldType.DateString"
              :value="passportData.PassportForegin.ExpirationDate"
              label="Действителен до"
              is-required
              :disabled="disabled"
              @change="passportData.PassportForegin.ExpirationDate = $event"
              @valid-state="setFieldValidationState('PassportForegin', 'ExpirationDate', true)"
              @invalid-state="setFieldValidationState('PassportForegin', 'ExpirationDate', false)"
            />
          </template>

          <template v-else-if="passportData.DocumentType === PassportTypes.PassportResidence">
            <UiFieldInput
              id="ResidenceCitizenship"
              :type="FieldType.Input"
              :value="passportData.PassportResidence.Citizenship"
              label="Гражданство"
              is-required
              :disabled="disabled"
              @change="passportData.PassportResidence.Citizenship = $event"
              @valid-state="setFieldValidationState('PassportResidence', 'Citizenship', true)"
              @invalid-state="setFieldValidationState('PassportResidence', 'Citizenship', false)"
            />
            <UiFieldInput
              id="ResidenceNumber"
              :type="FieldType.Input"
              :value="passportData.PassportResidence.Number"
              label="Номер"
              is-required
              :mask="{
                mask: /[0-9]/.test(passportData.PassportResidence.Number?.[2])
                  ? '#########'
                  : '##D#######',
                tokens: {
                  D: { pattern: /[№ ]/, optional: true },
                },
              }"
              validator="maska"
              :disabled="disabled"
              @change="passportData.PassportResidence.Number = $event"
              @valid-state="setFieldValidationState('PassportResidence', 'Number', true)"
              @invalid-state="setFieldValidationState('PassportResidence', 'Number', false)"
              @ready-to-focus-next="focusNextField('ResidenceRegistryDate')"
            />
            <UiFieldInput
              id="ResidenceRegistryDate"
              :type="FieldType.DateString"
              :value="passportData.PassportResidence.RegistryDate"
              label="Дата получения"
              is-required
              :disabled="disabled"
              @change="passportData.PassportResidence.RegistryDate = $event"
              @valid-state="setFieldValidationState('PassportResidence', 'RegistryDate', true)"
              @invalid-state="setFieldValidationState('PassportResidence', 'RegistryDate', false)"
            />
            <UiFieldInput
              id="ResidenceExpirationDate"
              :type="FieldType.DateString"
              :value="passportData.PassportResidence.ExpirationDate"
              label="Действителен до"
              :disabled="disabled"
              @change="passportData.PassportResidence.ExpirationDate = $event"
            />
          </template>

          <template v-if="isFull">
            <UiFieldInput
              id="IssuedPlace"
              :type="FieldType.Input"
              :value="passportData[PassportTypes[passportData.DocumentType]].IssuedPlace"
              label="Кем выдан"
              is-required
              :disabled="disabled"
              @change="passportData[PassportTypes[passportData.DocumentType]].IssuedPlace = $event"
              @valid-state="
                setFieldValidationState(
                  PassportTypes[passportData.DocumentType],
                  'IssuedPlace',
                  true,
                )
              "
              @invalid-state="
                setFieldValidationState(
                  PassportTypes[passportData.DocumentType],
                  'IssuedPlace',
                  false,
                )
              "
            />
            <UiSelect1
              :disabled="disabled"
              clearable
              select-label="Код ОКСМ"
              searchable
              :autoscroll="false"
              v-model="passportData[PassportTypes[passportData.DocumentType]].BirthplaceOKCMCode"
              :options="VirtualDictionaries.OksmList"
              label="Code"
              :reduce="(val) => val.Code"
              :filter-by="
                (option, _, search) => {
                  return (
                    (option.Name || '').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >
                      -1 ||
                    (option.Code || '').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >
                      -1 ||
                    (option.Summary || '').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) >
                      -1
                  )
                }
              "
            >
              <template #list-header>
                <div style="display: grid; grid-template-columns: 1fr 4fr 1fr; gap: 4px">
                  <span>Код</span>
                  <span>Имя</span>
                  <span>Инфо</span>
                </div>
              </template>
              <template #option="{ item }">
                <div style="display: grid; grid-template-columns: 1fr 4fr 1fr; gap: 4px">
                  <span>{{ item.Code }}</span>
                  <span>{{ item.Name }}</span>
                  <span>{{ item.Summary }}</span>
                </div>
              </template>
            </UiSelect1>
            <UiFieldInput
              id="BirthplaceOKATOCode"
              :type="FieldType.Input"
              :value="passportData[PassportTypes[passportData.DocumentType]].BirthplaceOKATOCode"
              label="Код ОКАТО"
              :disabled="disabled"
              @change="
                passportData[PassportTypes[passportData.DocumentType]].BirthplaceOKATOCode = $event
              "
            />
            <UiFieldInput
              id="Birthplace"
              :type="FieldType.Input"
              :value="passportData[PassportTypes[passportData.DocumentType]].Birthplace"
              label="Место рождения"
              is-required
              :disabled="disabled"
              @change="passportData[PassportTypes[passportData.DocumentType]].Birthplace = $event"
              @valid-state="
                setFieldValidationState(
                  PassportTypes[passportData.DocumentType],
                  'Birthplace',
                  true,
                )
              "
              @invalid-state="
                setFieldValidationState(
                  PassportTypes[passportData.DocumentType],
                  'Birthplace',
                  false,
                )
              "
            />
            <UiFieldInput
              id="RegisterAddress"
              :type="FieldType.Address"
              :value="passportData[PassportTypes[passportData.DocumentType]].RegisterAddress"
              label="Прописка"
              is-required
              :disabled="disabled"
              @change="
                passportData[PassportTypes[passportData.DocumentType]].RegisterAddress = $event
              "
              @valid-state="
                setFieldValidationState(
                  PassportTypes[passportData.DocumentType],
                  'RegisterAddress',
                  true,
                )
              "
              @invalid-state="
                setFieldValidationState(
                  PassportTypes[passportData.DocumentType],
                  'RegisterAddress',
                  false,
                )
              "
            />
          </template>
        </div>

        <template #actions>
          <UiButton1 v-if="!disabled" :disabled="!canSave" @click="onClickSave">
            Сохранить
          </UiButton1>
        </template>
      </UiFieldDetialsModal>
    </div>
  </UiFieldInputWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FieldType } from '@/core/constants/FieldType'
import { PassportTypes } from '@/core/constants/PassportTypes'
import type { IPassportData } from '@/core/interface/Object'
import { cloneDeep } from 'lodash'

const props = defineProps<{
  name: string
  dialogAnchorId: string
  label?: string
  disabled?: boolean
  value?: IPassportData
  isRequired?: boolean
  isFull?: boolean
}>()

const emits = defineEmits(['change', 'open-dialog', 'close-dialog'])

const configurationStore = useConfigurationStore()
const { VirtualDictionaries } = storeToRefs(configurationStore)

const focusNextField = (nextFieldId: string) => {
  EventBus.emit(GlobalEvents.FocusElement, nextFieldId)
}

const validationMap = ref({
  PassportRf: {
    IssuedPlaceNo: '',
    Series: '',
    IssuedDate: '',
    IssuedPlace: '',
    Birthplace: '',
    RegisterAddress: '',
    Number: '',
  },
  PassportForegin: {
    Number: '',
    RegistryDate: '',
    ExpirationDate: '',
    Citizenship: '',
    RegisterAddress: '',
    Birthplace: '',
    IssuedPlace: '',
  },
  PassportResidence: {
    Number: '',
    RegistryDate: '',
    Citizenship: '',
    RegisterAddress: '',
    Birthplace: '',
    IssuedPlace: '',
  },
})

const setFieldValidationState = (type: string, key: string, value: boolean) => {
  validationMap.value[type][key] = value
}

// Initialize default passport data structure
const defaultPassportData = {
  DocumentType: PassportTypes.PassportRf,
  PassportRf: {
    IssuedPlaceNo: '',
    Series: '',
    IssuedDate: '',
    IsFullData: false,
    IssuedPlace: '',
    Birthplace: '',
    BirthplaceOKCMCode: '',
    BirthplaceOKATOCode: '',
    RegisterAddress: '',
    Number: '',
  },
  PassportForegin: {
    IsFullData: false,
    Number: '',
    RegistryDate: '',
    ExpirationDate: '',
    Citizenship: '',
    RegisterAddress: '',
    Birthplace: '',
    BirthplaceOKCMCode: '',
    BirthplaceOKATOCode: '',
    IssuedPlace: '',
  },
  PassportResidence: {
    IsFullData: false,
    Number: '',
    RegistryDate: '',
    ExpirationDate: '',
    Citizenship: '',
    RegisterAddress: '',
    Birthplace: '',
    BirthplaceOKCMCode: '',
    BirthplaceOKATOCode: '',
    IssuedPlace: '',
  },
}

const parsedValue = computed(() => {
  return {
    ...defaultPassportData,
    ...cloneDeep(props.value),
  }
})

const valueString = computed(() => {
  const type = parsedValue.value?.DocumentType

  if (type === PassportTypes.PassportRf) {
    const { Series, Number, IssuedDate } = parsedValue.value.PassportRf
    if (!Series && !Number) return ''

    const formattedDate = IssuedDate ? new Date(IssuedDate).toLocaleDateString('ru-RU') : ''
    return `${Series || ''} ${Number || ''}${formattedDate ? `, ${formattedDate}` : ''}`
  } else if (type === PassportTypes.PassportForegin) {
    const { Number, Citizenship } = parsedValue.value.PassportForegin
    if (!Number) return ''

    return `${Number}${Citizenship ? `, ${Citizenship}` : ''}`
  } else if (type === PassportTypes.PassportResidence) {
    const { Number, Citizenship } = parsedValue.value.PassportResidence
    if (!Number) return ''

    return `${Number}${Citizenship ? `, ${Citizenship}` : ''}`
  }

  return ''
})

const PASSPORT_TYPE_OPTIONS = [
  { label: 'Паспорт гражданина РФ', value: PassportTypes.PassportRf },
  {
    label: 'Вид на жительство в РФ',
    value: PassportTypes.PassportResidence,
  },
  {
    label: 'Паспорт гражданина иностранного государства',
    value: PassportTypes.PassportForegin,
  },
]

const passportData = ref(cloneDeep(parsedValue.value))

watch(
  () => props.value,
  (newValue) => {
    if (newValue) {
      passportData.value = {
        ...defaultPassportData,
        ...cloneDeep(parsedValue.value),
      }
    }
  },
  { immediate: true },
)

// Dialog state
const isOpenForm = ref(false)

// Check if form can be saved
const canSave = computed(() => {
  return !Object.values(
    validationMap.value[PassportTypes[passportData.value.DocumentType]],
  ).includes(false)
})

// // Track if field has been modified
const hasModifiedField = ref(false)

// Handle opening the details dialog
const onClickShowDetails = () => {
  isOpenForm.value = true
  emits('open-dialog')
}

// Handle closing the details dialog
const onCloseDetails = () => {
  isOpenForm.value = false
  passportData.value = cloneDeep(parsedValue.value)
  emits('close-dialog')
}

// Handle saving the form
const onClickSave = () => {
  // Mark the appropriate passport type as having full data
  if (props.isFull) {
    if (passportData.value.DocumentType === PassportTypes.PassportRf) {
      passportData.value.PassportRf.IsFullData = true
      passportData.value.PassportForegin.IsFullData = false
      passportData.value.PassportResidence.IsFullData = false
    } else if (passportData.value.DocumentType === PassportTypes.PassportForegin) {
      passportData.value.PassportRf.IsFullData = false
      passportData.value.PassportForegin.IsFullData = true
      passportData.value.PassportResidence.IsFullData = false
    } else if (passportData.value.DocumentType === PassportTypes.PassportResidence) {
      passportData.value.PassportRf.IsFullData = false
      passportData.value.PassportForegin.IsFullData = false
      passportData.value.PassportResidence.IsFullData = true
    }
  } else {
    passportData.value.PassportRf.IsFullData = false
    passportData.value.PassportForegin.IsFullData = false
    passportData.value.PassportResidence.IsFullData = false
  }

  const resultValue = {
    ...parsedValue.value,
    ...{
      DocumentType: passportData.value.DocumentType,
      [PassportTypes[passportData.value.DocumentType]]:
        passportData.value[PassportTypes[passportData.value.DocumentType]],
    },
  }
  emits('change', resultValue)
  hasModifiedField.value = true
  isOpenForm.value = false
}

// Handle clearing the form
const onClickClear = () => {
  passportData.value = { ...defaultPassportData }
  emits('change', {
    ...parsedValue.value,
    ...{
      DocumentType: parsedValue.value.DocumentType,
      [PassportTypes[parsedValue.value.DocumentType]]:
        passportData.value[PassportTypes[parsedValue.value.DocumentType]],
    },
  })
  hasModifiedField.value = true
}
</script>

<style lang="scss" scoped>
.ui-passport-input {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  background-color: var(--color-background);
  border-radius: var(--input-border-radius);
  border: 1px solid var(--color-border);
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;

  &__value {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.ui-passport-input__buttons {
  display: flex;
}

.ui-passport-input__buttons .svg-icon-wrapper:last-child {
  border-radius: 0 5px 5px 0;
}

.ui-passport-input__form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
</style>
