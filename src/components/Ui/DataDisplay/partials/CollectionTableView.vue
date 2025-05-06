<template>
  <div>
    <!-- Таблица для контактов -->
    <template v-if="props.type === 'contact'">
      <h3 class="table-title">
        <UiButton1 variant="text" icon-left="plus-circle" :icon-size="24" @click="addItem" />
        <span>Контактные лица</span>
      </h3>
      <table class="table-layout" v-if="collection.length" :id="id">
        <colgroup>
          <col style="width: 35%" />
          <col style="width: 20%" />
          <col style="width: 20%" />
          <col style="width: 25%" />
        </colgroup>
        <thead>
          <tr class="table-header">
            <th class="table-cell">ФИО</th>
            <th class="table-cell">Кем приходится</th>
            <th class="table-cell">Телефон</th>
            <th class="table-cell">Комментарий</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in collection"
            :key="item.ClientName"
            class="table-row"
            @click="editItem(item)"
          >
            <td class="table-cell">{{ item.ClientName }}</td>
            <td class="table-cell">{{ item.Type }}</td>
            <td class="table-cell">{{ item.FirstPhone?.DisplayPhone }}</td>
            <td class="table-cell">{{ item.AddInfo }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="table-empty">Список контактных лиц пуст</div>
    </template>

    <!-- Таблица для клиентов -->
    <template v-if="props.type === 'clients'">
      <h3 class="table-title">
        <UiButton1 variant="text" icon-left="plus-circle" :icon-size="24" />
        <span>Связан с клиентами</span>
      </h3>
      <table class="table-layout" v-if="collection.length">
        <colgroup>
          <col style="width: 35%" />
          <col style="width: 20%" />
          <col style="width: 20%" />
          <col style="width: 25%" />
        </colgroup>
        <thead>
          <tr class="table-header">
            <th class="table-cell">ФИО</th>
            <th class="table-cell">Кем приходится</th>
            <th class="table-cell">Телефон</th>
            <th class="table-cell">Комментарий</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in collection" :key="item.ClientName" class="table-row">
            <td class="table-cell">{{ item.ClientName }}</td>
            <td class="table-cell">{{ item.Type }}</td>
            <td class="table-cell">{{ item.FirstPhone?.DisplayPhone }}</td>
            <td class="table-cell">{{ item.AddInfo }}</td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- Таблица для телефонов -->
    <template v-if="props.type === 'phones'">
      <h3 class="table-title">
        <UiButton1 variant="text" icon-left="plus-circle" :icon-size="24" @click="addItem" />
        <span>Список телефонов</span>
      </h3>
      <table class="table-layout" v-if="collection.length">
        <colgroup>
          <col style="width: 45%" />
          <col style="width: 55%" />
        </colgroup>

        <tbody>
          <tr
            v-for="item in collection"
            :key="item.DisplayPhone"
            class="table-row"
            @click="editItem(item)"
          >
            <td class="table-cell">
              {{ item.DisplayPhone }}
              <span class="table-cell__status" v-if="item.IsMain">Основной</span>
            </td>
            <td class="table-cell">{{ item.Comment }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="table-empty">Список телефонов пуст</div>
    </template>

    <!-- Таблица для телефонов с перетаскиванием -->
    <template v-if="props.type === 'phones-draggable'">
      <DraggablePhonesTableView
        :type="'phones'"
        :collection="collection"
        :object="object"
        :id="id"
        @add-item="addItem"
        @edit-item="editItem"
        @order-change="orderChanged"
      />
    </template>

    <!-- Таблица для карт -->
    <template v-if="props.type === 'card'">
      <h3 class="table-title">
        <UiButton1 variant="text" icon-left="plus-circle" :icon-size="24" @click="addItem" />
        <span>Банковские карты</span>
      </h3>
      <table class="table-layout" v-if="collection.length">
        <colgroup>
          <col style="width: 15%" />
          <col style="width: 40%" />
          <col style="width: 10%" />
          <col style="width: 15%" />
          <col style="width: 20%" />
        </colgroup>
        <thead>
          <tr class="table-header">
            <th class="table-cell">Тип</th>
            <th class="table-cell">Номер</th>
            <th class="table-cell">Дата</th>
            <th class="table-cell">Банк</th>
            <th class="table-cell">Держатель</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in collection"
            :key="item.DisplayNumber"
            class="table-row"
            @click="editItem(item)"
          >
            <td class="table-cell">{{ item.DisplayCardType }}</td>
            <td class="table-cell">
              {{ item.DisplayNumber }}
              <span class="table-cell__status" v-if="item.IsMainCard">Основная</span>
            </td>
            <td class="table-cell">{{ formatCardDate(item.ValidDate) }}</td>
            <td class="table-cell">{{ item.BankName }}</td>
            <td class="table-cell">{{ item.OwnerName || item.ClientName }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="table-empty">Список банковских карт пуст</div>
    </template>
  </div>
</template>

<script setup lang="ts">
// Определение пропсов компонента
const props = defineProps<{
  type: 'clients' | 'contact' | 'card' | 'phones' | 'phones-draggable'
  object: any
  id: string
  collection: any[]
}>()

const emit = defineEmits(['add-item', 'edit-item', 'order-change'])

// Обработчик добавления нового элемента
const addItem = () => {
  emit('add-item')
}

// Обработчик редактирования существующего элемента
const editItem = (item: any) => {
  emit('edit-item', item)
}

// Обработчик изменения порядка элементов
const orderChanged = (newOrder: any[]) => {
  // Напрямую обновляем коллекцию новыми данными
  // Определяем, какая коллекция используется (props.collection или вычисляемая)
  if (Array.isArray(props.collection)) {
    // Очищаем текущую коллекцию
    props.collection.splice(0, props.collection.length)

    // Заполняем коллекцию новыми элементами в правильном порядке
    newOrder.forEach((item) => {
      props.collection.push(item)
    })
  }

  // Передаем новый порядок дальше родительскому компоненту
  emit('order-change', newOrder)
}

/**
 * Форматирует дату из разных форматов в MM/YY
 */
const formatCardDate = (dateValue: string): string => {
  if (!dateValue) return ''

  // Если дата уже в формате MM/YY, возвращаем как есть
  if (dateValue.match(/^\d{1,2}\/\d{2}$/)) {
    return dateValue
  }

  // Попытка распарсить дату в формате DD.MM.YYYY или ISO
  try {
    // Обработка формата DD.MM.YYYY HH:MM:SS (например, 01.01.2025 00:00:00)
    if (dateValue.includes('.')) {
      const parts = dateValue.split(' ')[0].split('.')
      if (parts.length === 3) {
        const day = parts[0]
        const month = parts[1].replace(/^0/, '') // убираем ведущий ноль
        const year = parts[2].substring(2) // берем только последние 2 цифры года
        return `${month}/${year}`
      }
    }

    // Обработка ISO формата YYYY-MM-DD
    else if (dateValue.includes('-')) {
      const dateParts = dateValue.split('-')
      if (dateParts.length === 3) {
        const year = dateParts[0].substring(2) // берем только последние 2 цифры года
        const month = dateParts[1].replace(/^0/, '') // убираем ведущий ноль, если есть
        return `${month}/${year}`
      }
    }
  } catch (e) {
    console.error('Ошибка при форматировании даты карты:', e)
  }

  return dateValue
}
</script>

<style lang="scss" scoped>
.table-title {
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
}

.table-layout {
  width: 100%;
  border-collapse: collapse; /* Убирает лишние отступы между ячейками */
  table-layout: fixed; /* Фиксирует ширину столбцов */
}

.table-header {
  background: var(--color-bg-darken);
  color: var(--color-gray);
  font-weight: 500;
}

.table-row {
  cursor: pointer; /* Указывает, что строка кликабельна */
}

.table-row:hover {
  background: var(--color-bg-lighten);
  transition: background 0.3s ease;
}

.table-cell {
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  text-align: left;
  vertical-align: middle;
  gap: 20px;
  overflow: hidden;
  text-wrap: nowrap;
  &__status {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-primary);
    border: 1px solid var(--color-border);
    background: var(--component-blue-background);
    border-radius: 40px;
    padding: 2px 8px 3px;
    border-width: 1px;
    border-radius: 40px;
  }
}

th.table-cell {
  font-weight: 500;
  text-align: left;
  text-overflow: ellipsis;
}

.table-empty {
  padding: 16px;
  text-align: center;
  color: var(--color-font-disabled);
  border: 1px dashed var(--color-border);
  margin-top: 8px;
}
</style>
