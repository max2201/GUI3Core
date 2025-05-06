<template>
  <div class="client-edit-main-form">
    <div class="client-edit-main-form__scroll-wrapper">
      <div class="client-edit-main-form__wrapper" v-if="objectData">
        <div class="client-edit-main-form__grid">
          <UIObjectMainField
            v-if="objectData?.LegalStatusField"
            :field="objectData.LegalStatusField"
            v-model="objectData.LegalStatusField.currentVal"
            :title-value="true"
            wrapper-class="span-1"
          />
          <UIObjectMainField
            v-if="objectData.CategoryField"
            :field="objectData.CategoryField"
            v-model="objectData.CategoryField.currentVal"
            wrapper-class="span-1"
          />
          <UIObjectMainField
            v-if="objectData.ClientsGroupField"
            :field="objectData.ClientsGroupField"
            v-model="objectData.ClientsGroupField.currentVal"
            wrapper-class="span-2"
          />

          <template v-if="objectData.LegalStatusField.currentVal === '1'">
            <UIObjectMainField
              :field="objectData.LegalTypeField"
              v-model="objectData.LegalTypeField.currentVal"
            />
            <UIObjectMainField
              :field="objectData.CompanyNameField"
              v-model="objectData.CompanyNameField.currentVal"
              wrapper-class="span-2"
            />
            <UIObjectMainField
              :field="objectData.CompanyInnField"
              v-model="objectData.CompanyInnField.currentVal"
            />
            <UiFieldInput
              :id="formId"
              :type="FieldType.Address"
              :label="objectData.CompanyAddress.Value.Title"
              :value="objectData.CompanyAddress.Value.ComplexValue"
              @change="onChangeField(objectData?.CompanyAddress?.Code, $event)"
              wrapper-class="span-4"
            ></UiFieldInput>

            <UIObjectMainField
              :field="objectData.CompanyDateRegistrationField"
              v-model="objectData.CompanyDateRegistrationField.currentVal"
            />
            <UIObjectMainField
              :field="objectData.CompanyOgrnField"
              v-model="objectData.CompanyOgrnField.currentVal"
            />
            <UIObjectMainField
              :field="objectData.CompanyKppField"
              v-model="objectData.CompanyKppField.currentVal"
            />

            <UIObjectMainField
              :field="objectData.CompanyOkpoField"
              v-model="objectData.CompanyOkpoField.currentVal"
            />
            <UIObjectMainField
              :field="objectData.CeoPositionField"
              v-model="objectData.CeoPositionField.currentVal"
              wrapper-class="span-2"
            />
            <UiFieldInput
              :id="formId"
              :type="FieldType.ComplexFIO"
              :label="objectData.CeoFio.Value.Title"
              :value="objectData.CeoFio.Value.ComplexValue"
              @change="onChangeField(objectData.CeoFio.Code, $event)"
              wrapper-class="span-2"
            ></UiFieldInput>
          </template>
          <template v-else>
            <UiFieldInput
              :dialogAnchorId="formId"
              id="FioPerson"
              :type="FieldType.ComplexFIO"
              :label="objectData.FioPerson.Value.Title"
              :value="objectData.FioPerson.Value.ComplexValue"
              @change="onChangeField(objectData.FioPerson.Code, $event)"
              wrapper-class="span-2"
              name="fio"
            ></UiFieldInput>

            <UIObjectMainField
              :field="objectData.DateBirthdayField"
              v-model="objectData.DateBirthdayField.currentVal"
              :max-date="new Date()"
            />
            <UIObjectMainField
              :field="objectData.SexField"
              v-model="objectData.SexField.currentVal"
              :title-value="true"
            />
            <UIObjectMainField
              :field="objectData.RepairTypeField"
              v-model="objectData.RepairTypeField.currentVal"
              taggable
              searchable
              :title-value="true"
            />

            <UiFieldInput
              id="LivingPlace"
              :dialogAnchorId="formId"
              :type="FieldType.Address"
              :label="objectData.LivingPlace.Value.Title"
              :value="objectData.LivingPlace.Value.ComplexValue"
              @change="onChangeField(objectData?.LivingPlace?.Code, $event)"
              name="address"
              wrapper-class="span-4"
            ></UiFieldInput>
            <div class="photo-input">Для фото</div>
          </template>
        </div>

        <div class="block">
          <CollectionTable
            v-if="objectData?.PhonesInfo"
            type="phones-draggable"
            :object="objectData.PhonesInfo"
            :id="formId"
          ></CollectionTable>
        </div>

        <div class="block">
          <div class="block-head">
            <span class="block-head-title">Уведомления и контакты</span>
            <div class="d-flex">
              <UIObjectMainField
                :field="objectData.AgreeDogovorMessagesField"
                v-model="objectData.AgreeDogovorMessagesField.currentVal"
                title="Уведомления"
                :is-switch="true"
                class="mr-3"
              />
              <UIObjectMainField
                :field="objectData.AgreeReklamaMessagesField"
                v-model="objectData.AgreeReklamaMessagesField.currentVal"
                is-switch
                title="Реклама"
              />
            </div>
          </div>

          <div class="notification-inputs" v-if="objectData?.NotifyNumberField">
            <UIObjectMainField
              :field="objectData.NotifyNumberField"
              v-model="objectData.NotifyNumberField.currentVal"
              wrapper-class="span-2"
            />
            <UIObjectMainField
              :field="objectData.MailField"
              v-model="objectData.MailField.currentVal"
            />
            <UIObjectMainField
              :field="objectData.DeliveryTypeField"
              v-model="objectData.DeliveryTypeField.currentVal"
            />
          </div>
        </div>
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

const emits = defineEmits(['close', 'update'])

const objectData = ref(props.object)

const onChangeField = (field?: string, value?: any) => {
  Object.keys(objectData.value).forEach((key) => {
    if (objectData.value[key]?.Code === field) {
      objectData.value[key].Value.ComplexValue = value
    }
  })
}
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
    padding-bottom: 20px;
  }

  &__grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 151.5px);
    grid-auto-rows: 52px;
    gap: 16px 8px;
    padding: 20px 12px 0 20px;
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

.photo-input {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 3 / 5;
  grid-row: 2 / 5;
  background-color: var(--component-gray-background);
  color: var(--color-gray);
}

.telephone-row {
  display: grid;
  width: 100%;
  grid-template-columns: 252px auto;
  height: 40px;
  border: var(--border-default);

  &__main {
    background-color: var(--component-blue-background);
  }
}
.telephone-number {
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  border-right: var(--border-default);
  font-weight: var(--font-weight-500);
  gap: 12px;
}
.telephone-description {
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.notification-inputs {
  display: grid;
  grid-template-columns: repeat(4, 151.5px);
  grid-auto-rows: 52px;
  gap: 16px 8px;
}
</style>
