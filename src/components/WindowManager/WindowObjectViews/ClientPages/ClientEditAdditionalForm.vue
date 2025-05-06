<template>
  <div :id="formId" class="client-edit-main-form">
    <div class="client-edit-main-form__scroll-wrapper">
      <div class="client-edit-main-form__wrapper">
        <div
          :class="[
            'block-disable-deal',
            {
              'block-disable-deal_active': objectData.BanField.currentVal == 'True',
            },
          ]"
        >
          <UIObjectMainField
            :field="objectData.BanField"
            v-model="objectData.BanField.currentVal"
            is-switch
          />
          <UiInput1 v-if="isActiveBlockDeal" label="Причина блокировки" />
        </div>

        <div class="block">
          <CollectionTable
            v-if="objectData?.ContactPersonsInfo"
            type="contact"
            :object="objectData.ContactPersonsInfo"
            :id="formId"
          ></CollectionTable>
        </div>
        <div class="block">
          <CollectionTable
            v-if="objectData?.ReverseContactPersonsInfo"
            type="clients"
            :object="objectData.ReverseContactPersonsInfo"
            :id="formId"
          ></CollectionTable>
          <CollectionTable
            v-if="objectData?.BankCardsInfo"
            type="card"
            :object="objectData.BankCardsInfo"
            :id="formId"
          ></CollectionTable>
        </div>
        <div class="block">
          <div class="block-head">
            <span class="block-head-title">Постоянный договор</span>
          </div>

          <div class="block-grid">
            <UIObjectMainField
              :field="objectData.SingleContractTitleField"
              v-model="objectData.SingleContractTitleField.currentVal"
              wrapper-class="span-2"
            />
            <UIObjectMainField
              :field="objectData.SingleContractNumberField"
              v-model="objectData.SingleContractNumberField.currentVal"
            />
            <UIObjectMainField
              :field="objectData.SingleContractDateField"
              v-model="objectData.SingleContractDateField.currentVal"
            />
          </div>
        </div>
        <div class="block">
          <div class="block-head">
            <span class="block-head-title">Скидки и бонусы</span>
          </div>

          <div class="block-grid">
            <UIObjectMainField
              :field="objectData.DiscountField"
              v-model="objectData.DiscountField.currentVal"
            />
            <UIObjectMainField
              :field="objectData.BonusField"
              v-model="objectData.BonusField.currentVal"
            />
            <UiInput1 label="Карта лояльности" :additional-class="['span-2']" />
          </div>
        </div>
      </div>
    </div>

    <div class="client-edit-main-form__buttons">
      <UiButton1 v-if="!isLoadingUpdate" theme="secondary" @click="onCancel">Отменить</UiButton1>
      <UiButton1 :disabled="!isEdit" :loading="isLoadingUpdate" @click="onUpdate"
        >Сохранить</UiButton1
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IClientEditDto } from '@/core/interface/Client'

const props = defineProps<{
  object: IClientEditDto
  isEdit: boolean
  formId: string
  loading?: boolean
}>()
const objectData = ref(props.object)
const emits = defineEmits(['close', 'update'])

const isLoadingUpdate = ref(false)
const isActiveBlockDeal = ref(false)

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
  }

  &__grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 152px);
    grid-auto-rows: 52px;
    gap: 16px 12px;
    align-items: baseline;
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

.block-disable-deal {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px 24px;
  background-color: var(--component-green-background-light);

  &_active {
    :deep(.ui-switch__wrapper, ) {
      background-color: var(--component-danger);
    }
    :deep(.ui-switch--active:hover .ui-switch__wrapper) {
      background-color: var(--component-danger-hover);
    }
    background-color: var(--component-danger-background);
  }
}

table.simple-table {
  border: 1px solid var(--color-border);
  border-collapse: collapse;

  thead tr {
    background-color: var(--color-background);

    th {
      text-align: left;
      font-weight: var(--font-weight-500);
      padding: 8px 10px;
      border: 1px solid var(--color-border);
      border-collapse: collapse;
    }
  }

  tbody tr td {
    padding: 8px 10px;
    border: 1px solid var(--color-border);
    border-collapse: collapse;
  }
}
</style>
