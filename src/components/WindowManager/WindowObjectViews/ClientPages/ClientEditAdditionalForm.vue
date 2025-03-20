<template>
  <div :id="formId" class="client-edit-main-form">
    <div class="client-edit-main-form__scroll-wrapper">
      <div class="client-edit-main-form__wrapper">
        <div
          :class="[
            'block-disable-deal',
            {
              'block-disable-deal_active': isActiveBlockDeal,
            },
          ]"
        >
          <UiSwitch1 v-model="isActiveBlockDeal" label="Запрет на заключение договора" />
          <UiInput1 v-if="isActiveBlockDeal" label="Причина блокировки" />
        </div>

        <div class="block">
          <div class="block-head">
            <span class="block-head-title">Контактные лица</span>
            <UiButton1 :icon-size="24" icon-left="plus-circle" size="small" />
          </div>

          <table class="simple-table">
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Кем приходится</th>
                <th width="130">Телефон</th>
                <th>Комментарий</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in contactsTable" :key="row.id">
                <td v-for="cell in contactsTableCells" :key="cell">{{ row.cells[cell] }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="block">
          <div class="block-head">
            <span class="block-head-title">Банковские карты</span>
            <UiButton1 :icon-size="24" icon-left="plus-circle" size="small" />
          </div>

          <table class="simple-table">
            <thead>
              <tr>
                <th>Тип</th>
                <th>Номер</th>
                <th>Дата</th>
                <th>Банк</th>
                <th>Комментарий</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in cardsTable" :key="row.id">
                <td v-for="cell in cardsTableCells" :key="cell">{{ row.cells[cell] }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="block">
          <div class="block-head">
            <span class="block-head-title">Постоянный договор</span>
          </div>

          <div class="block-grid">
            <UiInput1 label="Название" :additional-class="['span-2']" />
            <UiInput1 label="Номер" />
            <UiInput1 label="Дата" />
          </div>
        </div>

        <div class="block">
          <div class="block-head">
            <span class="block-head-title">Скидки и бонусы</span>
          </div>

          <div class="block-grid">
            <UiInput1 label="Скидка, %" />
            <UiInput1 label="Бонус, %" />
            <UiInput1 label="Карта лояльности" :additional-class="['span-2']" />
          </div>
        </div>
      </div>
    </div>

    <div class="client-edit-main-form__buttons">
      <UiButton1 v-if="!isLoadingUpdate" theme="secondary" @click="onCancel">Отменить</UiButton1>
      <UiButton1 :loading="isLoadingUpdate">Сохранить</UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, unref } from 'vue'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { ClientValidate, ClientUpdate, ClientsGetFormFields } from '@/core/api/clients.api'
import { GetObjectDto } from '@/core/api/object.api'
import type { IObjectDto } from '@/core/interface/Object'
import type { FormField } from '@/core/interface/FormField'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { customAlphabet } from 'nanoid'
import UiTabs from '@/components/Ui/DataDisplay/UiTabs.vue'
import UiDatepicker from '@/components/Ui/DataEntry/UiDatepicker.vue'
import IconButton from '@/components/Ui/DataDisplay/IconButton.vue'
import UiBadge from '@/components/Ui/DataDisplay/UiBadge.vue'

const nanoid = customAlphabet('abcdef', 10)
const formId = ref(nanoid(10))

const props = defineProps<{
  object: IObjectDto
}>()

const emits = defineEmits(['close'])

const isLoadingUpdate = ref(false)
const isActiveBlockDeal = ref(false)

const contactsTableCells = ['fio', 'who', 'tel', 'comment']
const contactsTable = [
  {
    id: 0,
    cells: {
      fio: 'Савельев Владимир Викторович',
      who: 'брат',
      tel: '(052) 107-2308',
      comment: 'для экстренных случаев',
    },
  },
  {
    id: 1,
    cells: {
      fio: 'Савельева Ирина',
      who: 'сестра',
      tel: '(052) 111-2308',
      comment: 'не звонить просто так а почему бы и нет если надо',
    },
  },
]

const cardsTableCells = ['type', 'number', 'date', 'bankname', 'comment']
const cardsTable = [
  {
    id: 0,
    cells: {
      type: 'МИР',
      number: '3456 2454 4548 1222',
      date: '20.08.2024',
      bankname: 'Т-банк',
      comment: 'зарплатная',
    },
  },
]

const onCancel = () => {
  emits('close')
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
