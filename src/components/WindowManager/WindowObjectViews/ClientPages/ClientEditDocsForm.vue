<template>
  <div class="client-edit-main-form">
    <div class="client-edit-main-form__scroll-wrapper">
      <div class="client-edit-main-form__wrapper">
        <template v-if="objectData.LegalStatusField.currentVal !== '1'">
          <UiPassportForm
            style="grid-template-columns: 1fr 1fr 1fr 1fr"
            :dialogAnchorId="formId"
            is-full
            v-model:document-type="objectData.DocumentTypeField.currentVal"
            v-model:document-value="objectData.ClientDocument"
            :document-types-options="documentTypeOptions"
            :address-living="objectData.LivingPlace.Value.ComplexValue"
          >
            <UIObjectMainField
              :field="objectData.InnField"
              v-model="objectData.InnField.currentVal"
              :class="'span-1'"
            />
            <UIObjectMainField
              :field="objectData.SnilsField"
              v-model="objectData.SnilsField.currentVal"
              :class="'span-1'"
            />
            <UIObjectMainField
              v-if="objectData.LegalStatusField.currentVal == '2'"
              :field="objectData.OgrnIpField"
              v-model="objectData.OgrnIpField.currentVal"
              :class="'span-1'"
            />
            <UIObjectMainField
              v-if="objectData.LegalStatusField.currentVal == '2'"
              :field="objectData.IPDateRegField"
              v-model="objectData.IPDateRegField.currentVal"
              :class="'span-1'"
            />
          </UiPassportForm>

          <div class="client-edit-main-form__grid">
            <UiFieldInput
              id="FieldType.DriverLicence"
              :dialogAnchorId="formId"
              :type="FieldType.DriverLicence"
              :label="objectData.DriverLicenceInfo.Value.Title"
              :value="objectData.DriverLicenceInfo.Value.ComplexValue"
              @change="onChangeField(objectData.DriverLicenceInfo.Code, $event)"
              :subFields="objectData.DriverLicenceInfo.Value.SubFields"
              :is-not-steps="true"
              wrapper-class="span-4"
            ></UiFieldInput>
            <UiFieldInput
              :id="FieldType.ComplexBankInfo"
              :dialogAnchorId="formId"
              :type="FieldType.ComplexBankInfo"
              :label="objectData.BankPersonInfo.Value.Title"
              :value="objectData.BankPersonInfo.Value.ComplexValue"
              :sub-fields="objectData.BankPersonInfo.Value.SubFields"
              @change="onChangeField(objectData.BankPersonInfo.Code, $event)"
              wrapper-class="span-4"
            ></UiFieldInput>
            <UiFieldInput
              :dialogAnchorId="formId"
              :id="FieldType.WorkingPlace"
              :type="FieldType.WorkingPlace"
              :label="objectData.JobPlaceInfo.Value.Title"
              :value="objectData.JobPlaceInfo.Value.ComplexValue"
              :sub-fields="objectData.JobPlaceInfo.Value.SubFields"
              @change="onChangeField(objectData.JobPlaceInfo.Code, $event)"
              wrapper-class="span-4"
            ></UiFieldInput>
          </div>
        </template>
        <template v-if="objectData.LegalStatusField.currentVal === '1'">
          <div class="block">
            <div class="block-head">
              <span class="block-head-title">Уведомления и контакты</span>
            </div>
            <div class="block-grid">
              <UiFieldInput
                :id="formId"
                :type="FieldType.ComplexFIO"
                :label="objectData.CompanyDefaultSignerNameInfo.Value.Title"
                :value="objectData.CompanyDefaultSignerNameInfo.Value.ComplexValue"
                @change="onChangeField(objectData.CompanyDefaultSignerNameInfo.Code, $event)"
                wrapper-class="span-4"
                name="fio"
              ></UiFieldInput>
              <UIObjectMainField
                :field="objectData.CompanyDefaultSignerPositionField"
                v-model="objectData.CompanyDefaultSignerPositionField.currentVal"
                class="span-4"
              />
              <UIObjectMainField
                :field="objectData.CompanyDefaultSignerLawBaseField"
                v-model="objectData.CompanyDefaultSignerLawBaseField.currentVal"
                class="span-4"
              />
              <UiFieldInput
                :id="formId"
                :type="FieldType.ComplexBankInfo"
                :label="objectData.CompanyBankInfo.Value.Title"
                :value="objectData.CompanyBankInfo.Value.ComplexValue"
                @change="onChangeField(objectData.CompanyBankInfo.Code, $event)"
                wrapper-class="span-4"
              ></UiFieldInput>
              <UiFieldInput
                :id="formId"
                :type="FieldType.ComplexFIO"
                :label="objectData.CompanyAccountantNameInfo.Value.Title"
                :value="objectData.CompanyAccountantNameInfo.Value.ComplexValue"
                @change="onChangeField(objectData.CompanyAccountantNameInfo.Code, $event)"
                wrapper-class="span-4"
                name="ComplexFIO"
              ></UiFieldInput>
              <UiFieldInput
                :id="formId"
                :type="FieldType.Address"
                :label="objectData.CompanyActualAddressInfo.Value.Title"
                :value="objectData.CompanyActualAddressInfo.Value.ComplexValue"
                @change="onChangeField(objectData.CompanyActualAddressInfo.Code, $event)"
                wrapper-class="span-4"
                name="address"
              ></UiFieldInput>

              <UIObjectMainField
                :field="objectData.OkvedField"
                v-model="objectData.OkvedField.currentVal"
                wrapper-class="span-4"
              />
              <UIObjectMainField
                :field="objectData.CompanyMainActivityField"
                v-model="objectData.CompanyMainActivityField.currentVal"
                wrapper-class="span-3"
              />
              <UIObjectMainField
                :field="objectData.CompanyPlaceOKSMCodeField"
                v-model="objectData.CompanyPlaceOKSMCodeField.currentVal"
                wrapper-class="span-1"
              />
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="client-edit-main-form__buttons">
      <UiButton1 v-if="!loading" theme="secondary" @click="onCancel">Отменить</UiButton1>
      <UiButton1 :disabled="!isEdit" :loading="loading" @click="onUpdate">Сохранить</UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IClientEditDto } from '@/core/interface/Client'
import { FieldType } from '@/core/constants/FieldType'

const props = defineProps<{
  object: IClientEditDto
  isEdit: boolean
  formId: string
  loading?: boolean
}>()
const objectData = ref(props.object)
const emits = defineEmits(['close', 'update'])

const onChangeField = (field?: string, value?: any) => {
  Object.keys(objectData.value).forEach((key) => {
    if (objectData.value[key]?.Code === field) {
      objectData.value[key].Value.ComplexValue = value
    }
  })
}

const documentTypeOptions = computed(() => {
  const options = objectData.value.DocumentTypeField.values
  if (objectData.value.RepairTypeField.currentVal === 'РФ') {
    const newOptions = options.filter((item) => item.Value == '0')
    objectData.value.DocumentTypeField.currentVal = newOptions[0].Value
    return newOptions
  } else {
    const newOptions = options.filter((item) => item.Value !== '0')
    objectData.value.DocumentTypeField.currentVal = newOptions[0].Value
    return newOptions
  }
})
const onCancel = () => {
  emits('close')
}
const onUpdate = () => {
  emits('update')
}
</script>

<style scoped lang="scss">
@import './clientEditForm.scss';

.client-edit-main-form {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 56px;
  overflow: auto;

  &__scroll-wrapper {
    display: grid;
    grid-template-columns: 1fr;
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding: 20px 12px 0 20px;
    position: relative;
  }

  &__grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 152px);
    grid-auto-rows: 52px;
    gap: 16px 12px;
    align-items: baseline;
  }

  &__buttons {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: right;
    padding: 0 20px;
    background-color: var(--color-background);
    border-top: var(--border-default);
  }
}
.block {
  padding: 0;
}
.block-grid {
  display: grid;
  grid-template-columns: repeat(4, 152px);
  grid-auto-rows: 52px;
  gap: 16px 12px;
  align-items: baseline;
}
</style>
