<template>
  <div :id="formId" class="client-edit-main-form">
    <div class="client-edit-main-form__scroll-wrapper">
      <div class="client-edit-main-form__wrapper">
        <div class="block">
          <div class="block-head">
            <span class="block-head-title">Категории экспорта платежей</span>
          </div>

          <div class="block-grid">
            <UIObjectMainField
              :field="objectData.FinCategoryField"
              :searchable="true"
              v-model="objectData.FinCategoryField.currentVal"
              wrapper-class="span-2"
            />
            <UIObjectMainField
              :parent-field="objectData.FinCategoryField"
              :field="objectData.FinSubCategoryField"
              v-model="objectData.FinSubCategoryField.currentVal"
              wrapper-class="span-2"
            />
          </div>
        </div>
        <div class="block">
          <div class="block-grid">
            <UIObjectMainField
              :field="objectData.IntegrationIdField"
              v-model="objectData.IntegrationIdField.currentVal"
              wrapper-class="span-2"
            />
            <UIObjectMainField
              :field="objectData.Code1Field"
              v-model="objectData.Code1Field.currentVal"
            />
            <UIObjectMainField
              :field="objectData.Code2Field"
              v-model="objectData.Code2Field.currentVal"
            />
          </div>
        </div>
        <div class="block">
          <div class="block-head">
            <span class="block-head-title">Начальные значения</span>
          </div>

          <div class="block-grid">
            <UIObjectMainField
              :field="objectData.InitialPersonalAccountField"
              v-model="objectData.InitialPersonalAccountField.currentVal"
            />
            <UIObjectMainField
              :field="objectData.InitialProfitField"
              v-model="objectData.InitialProfitField.currentVal"
            />
            <UIObjectMainField
              :field="objectData.InitialBonusesField"
              v-model="objectData.InitialBonusesField.currentVal"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="client-edit-main-form__buttons">
      <UiButton1 theme="secondary" @click="onCancel">Отменить</UiButton1>
      <UiButton1 :disabled="!isEdit" :loading="loading" @click="onUpdate">Сохранить</UiButton1>
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
    padding-top: 20px;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  block-grid {
    padding: 20px 12px 0 20px;
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

.block-disable-deal {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px 24px;
  background-color: var(--component-green-background-light);

  &_active {
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
