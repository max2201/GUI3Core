<template>
  <div class="ui-passport-form" :class="{ 'ui-passport-form--compact': !isFull }">
    <UiSelect1
      selectLabel="Основной документ"
      :disabled="disabled || documentTypesOptions?.length == 1"
      v-model="localDocumentType"
      :options="documentTypesOptions || PASSPORT_TYPE_OPTIONS"
      :additional-class="['span-2', 'ui-passport-form__document-type']"
      label="Title"
      :reduce="(val) => val.Value"
    ></UiSelect1>

    <div class="ui-passport-form__empty"></div>
    <div class="ui-passport-form__empty"></div>

    <template v-if="PassportTypes[localDocumentType!] === PassportTypes[PassportTypes.PassportRf]">
      <UiFieldInput
        id="RfSeries"
        :type="FieldType.Input"
        :value="(localDocumentValue as IPassportRf).Series"
        label="Серия"
        mask="####"
        is-required
        validator="maska"
        :disabled="disabled"
        @change="(localDocumentValue as IPassportRf).Series = $event"
        @valid-state="setFieldValidationState('PassportRf', 'Series', true)"
        @invalid-state="setFieldValidationState('PassportRf', 'Series', false)"
        @ready-to-focus-next="focusNextField('RfNumber')"
      />
      <UiFieldInput
        id="RfNumber"
        :type="FieldType.Input"
        :value="(localDocumentValue as IPassportRf).Number"
        label="Номер"
        mask="######"
        is-required
        validator="maska"
        :disabled="disabled"
        @change="(localDocumentValue as IPassportRf).Number = $event"
        @valid-state="setFieldValidationState('PassportRf', 'Number', true)"
        @invalid-state="setFieldValidationState('PassportRf', 'Number', false)"
        @ready-to-focus-next="focusNextField('RfIssuedDate')"
      />
      <UiFieldInput
        validator="maska"
        id="RfIssuedDate"
        :type="FieldType.DateString"
        :value="(localDocumentValue as IPassportRf).IssuedDate"
        label="Дата получения"
        :max-date="new Date()"
        is-required
        :disabled="disabled"
        @change="(localDocumentValue as IPassportRf).IssuedDate = $event"
        @valid-state="setFieldValidationState('PassportRf', 'IssuedDate', true)"
        @invalid-state="setFieldValidationState('PassportRf', 'IssuedDate', false)"
        @ready-to-focus-next="focusNextField('RfIssuedPlaceNo')"
      />
      <UiFieldInput
        v-if="isFull"
        id="RfIssuedPlaceNo"
        :type="FieldType.Input"
        :value="(localDocumentValue as IPassportRf).IssuedPlaceNo"
        label="Код подразделения"
        mask="###-###"
        is-required
        validator="maska"
        :disabled="disabled"
        @change="(localDocumentValue as IPassportRf).IssuedPlaceNo = $event"
        @valid-state="setFieldValidationState('PassportRf', 'IssuedPlaceNo', true)"
        @invalid-state="setFieldValidationState('PassportRf', 'IssuedPlaceNo', false)"
      />
    </template>
    <template
      v-else-if="PassportTypes[localDocumentType!] === PassportTypes[PassportTypes.PassportForegin]"
    >
      <UiFieldInput
        id="ForeginCitizenship"
        :type="FieldType.Input"
        :value="(localDocumentValue as IPassportForegin).Citizenship"
        label="Гражданство"
        is-required
        :disabled="disabled"
        @change="(localDocumentValue as IPassportForegin).Citizenship = $event"
        @valid-state="setFieldValidationState('PassportForegin', 'Citizenship', true)"
        @invalid-state="setFieldValidationState('PassportForegin', 'Citizenship', false)"
      />
      <UiFieldInput
        id="ForeginNumber"
        :type="FieldType.Input"
        :value="(localDocumentValue as IPassportForegin).Number"
        label="Номер"
        is-required
        :disabled="disabled"
        @change="(localDocumentValue as IPassportForegin).Number = $event"
        @valid-state="setFieldValidationState('PassportForegin', 'Number', true)"
        @invalid-state="setFieldValidationState('PassportForegin', 'Number', false)"
        @ready-to-focus-next="focusNextField('ForeginRegistryDate')"
      />
      <UiFieldInput
        validator="maska"
        id="ForeginRegistryDate"
        :type="FieldType.DateString"
        :value="(localDocumentValue as IPassportForegin).RegistryDate"
        label="Дата получения"
        :max-date="new Date()"
        is-required
        :disabled="disabled"
        @change="(localDocumentValue as IPassportForegin).RegistryDate = $event"
        @valid-state="setFieldValidationState('PassportForegin', 'RegistryDate', true)"
        @invalid-state="setFieldValidationState('PassportForegin', 'RegistryDate', false)"
        @ready-to-focus-next="focusNextField('ForeginExpirationDate')"
      />
      <UiFieldInput
        validator="maska"
        id="ForeginExpirationDate"
        :type="FieldType.DateString"
        :value="(localDocumentValue as IPassportForegin).ExpirationDate"
        label="Действителен до"
        is-required
        :disabled="disabled"
        @change="(localDocumentValue as IPassportForegin).ExpirationDate = $event"
        @valid-state="setFieldValidationState('PassportForegin', 'ExpirationDate', true)"
        @invalid-state="setFieldValidationState('PassportForegin', 'ExpirationDate', false)"
      />
    </template>

    <template
      v-else-if="
        PassportTypes[localDocumentType!] === PassportTypes[PassportTypes.PassportResidence]
      "
    >
      <UiFieldInput
        id="ResidenceCitizenship"
        :type="FieldType.Input"
        :value="(localDocumentValue as IPassportResidence).Citizenship"
        label="Гражданство"
        is-required
        :disabled="disabled"
        @change="(localDocumentValue as IPassportResidence).Citizenship = $event"
        @valid-state="setFieldValidationState('PassportResidence', 'Citizenship', true)"
        @invalid-state="setFieldValidationState('PassportResidence', 'Citizenship', false)"
      />
      <UiFieldInput
        id="ResidenceNumber"
        :type="FieldType.Input"
        :value="(localDocumentValue as IPassportResidence).Number"
        label="Номер"
        is-required
        :mask="{
          mask: /[0-9]/.test((localDocumentValue as IPassportResidence).Number?.[2])
            ? '#########'
            : '##D#######',
          tokens: {
            D: { pattern: /[№ ]/, optional: true },
          },
        }"
        validator="maska"
        :disabled="disabled"
        @change="(localDocumentValue as IPassportResidence).Number = $event"
        @valid-state="setFieldValidationState('PassportResidence', 'Number', true)"
        @invalid-state="setFieldValidationState('PassportResidence', 'Number', false)"
        @ready-to-focus-next="focusNextField('ResidenceRegistryDate')"
      />
      <UiFieldInput
        id="ResidenceRegistryDate"
        :type="FieldType.DateString"
        :value="(localDocumentValue as IPassportResidence).RegistryDate"
        label="Дата получения"
        :max-date="new Date()"
        is-required
        :disabled="disabled"
        @change="(localDocumentValue as IPassportResidence).RegistryDate = $event"
        @valid-state="setFieldValidationState('PassportResidence', 'RegistryDate', true)"
        @invalid-state="setFieldValidationState('PassportResidence', 'RegistryDate', false)"
      />
      <UiFieldInput
        id="ResidenceExpirationDate"
        :type="FieldType.DateString"
        :value="(localDocumentValue as IPassportResidence).ExpirationDate"
        label="Действителен до"
        :min-date="(localDocumentValue as IPassportResidence).RegistryDate"
        :disabled="disabled"
        @change="(localDocumentValue as IPassportResidence).ExpirationDate = $event"
        @valid-state="setFieldValidationState('PassportResidence', 'ExpirationDate', true)"
        @invalid-state="setFieldValidationState('PassportResidence', 'ExpirationDate', false)"
      />
    </template>

    <template v-if="isFull">
      <UiFieldInput
        :dialogAnchorId="dialogAnchorId"
        wrapper-class="span-4"
        id="IssuedPlace"
        :type="FieldType.Input"
        :value="localDocumentValue!.IssuedPlace.trim().toUpperCase()"
        label="Кем выдан"
        is-required
        :disabled="disabled"
        @change="localDocumentValue!.IssuedPlace = $event.trim().toUpperCase()"
        @valid-state="
          setFieldValidationState(PassportTypes[localDocumentType!], 'IssuedPlace', true)
        "
        @invalid-state="
          setFieldValidationState(PassportTypes[localDocumentType!], 'IssuedPlace', false)
        "
      />
      <UiFieldInput
        wrapper-class="span-2"
        id="Birthplace"
        :type="FieldType.Input"
        :value="localDocumentValue!.Birthplace"
        :dialogAnchorId="dialogAnchorId"
        label="Место рождения"
        is-required
        :disabled="disabled"
        @change="localDocumentValue!.Birthplace = $event"
        @valid-state="
          setFieldValidationState(PassportTypes[localDocumentType!], 'Birthplace', true)
        "
        @invalid-state="
          setFieldValidationState(PassportTypes[localDocumentType!], 'Birthplace', false)
        "
      />
      <UiSelect1
        dropdown-width="300px"
        :disabled="disabled"
        clearable
        select-label="Код ОКСМ"
        searchable
        :autoscroll="false"
        v-model="localDocumentValue!.BirthplaceOKCMCode"
        :options="VirtualDictionaries.OksmList"
        label="Code"
        taggable
        :reduce="(val) => val.Code"
        :filter-by="
          (option, _, search) => {
            return (
              (option.Name || '').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1 ||
              (option.Code || '').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1 ||
              (option.Summary || '').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1
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
        :type="FieldType.OKATO"
        :value="localDocumentValue!.BirthplaceOKATOCode"
        label="Код ОКАТО"
        :disabled="disabled"
        @change="localDocumentValue!.BirthplaceOKATOCode = $event"
        :birthplace="localDocumentValue!.Birthplace"
      />

      <UiSwitch1
        v-if="addressLiving"
        :model-value="sameAddress"
        @update:model-value="changeSameAddress"
        label="Прописка совпадает с адресом фактического проживания"
        class="span-4 pt-2"
      >
      </UiSwitch1>
      <UiFieldInput
        v-show="!addressLiving || !sameAddress"
        :dialogAnchorId="dialogAnchorId"
        wrapper-class="span-4"
        id="RegisterAddress"
        :type="FieldType.Address"
        :value="localDocumentValue!.RegisterAddress"
        label="Адрес регистрации"
        is-required
        :disabled="disabled"
        @change="localDocumentValue!.RegisterAddress = $event"
        @valid-state="
          setFieldValidationState(PassportTypes[localDocumentType!], 'RegisterAddress', true)
        "
        @invalid-state="
          setFieldValidationState(PassportTypes[localDocumentType!], 'RegisterAddress', false)
        "
      />
      <slot></slot>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineExpose, ref, watch } from 'vue'
import { FieldType } from '@/core/constants/FieldType'
import { PassportTypes } from '@/core/constants/PassportTypes'
import type {
  IAddressValue,
  IPassportForegin,
  IPassportResidence,
  IPassportRf,
} from '@/core/interface/Object'
import { FilterFieldTypes } from '@/core/interface/Auth'

const PASSPORT_TYPE_OPTIONS = [
  { Title: 'Паспорт гражданина РФ', Value: PassportTypes.PassportRf },
  {
    Title: 'Вид на жительство в РФ',
    Value: PassportTypes.PassportResidence,
  },
  {
    Title: 'Паспорт гражданина иностранного государства',
    Value: PassportTypes.PassportForegin,
  },
]

interface documentTypeOption {
  Key?: string
  Title: string
  Value: string | number
}

const props = defineProps<{
  documentType: PassportTypes
  documentValue: IPassportRf | IPassportForegin | IPassportResidence
  documentTypesOptions?: documentTypeOption[]
  addressLiving?: IAddressValue
  isFull?: boolean
  disabled?: boolean
  dialogAnchorId?: string
}>()
const sameAddress = ref(false)
const changeSameAddress = (value: boolean) => {
  sameAddress.value = value
  if (value) {
    localDocumentValue.value!.RegisterAddress = props.addressLiving
  }
}
const localDocumentType = defineModel<PassportTypes>('documentType')
const localDocumentValue = defineModel<IPassportRf | IPassportForegin | IPassportResidence>(
  'documentValue',
)

const emits = defineEmits(['update:documentType', 'update:documentValue'])

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

const isFormValid = computed(() => {
  return !Object.values(validationMap.value[PassportTypes[localDocumentType.value!]]).includes(
    false,
  )
})

defineExpose({ isFormValid })
</script>

<style lang="scss" scoped>
.ui-passport-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 8px;
  &--compact {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
