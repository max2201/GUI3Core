<template>
  <div class="draggable-phones" :id="id">
    <h3 class="draggable-phones__title">
      <UiButton1 variant="text" icon-left="plus-circle" :icon-size="24" @click="addItem" />
      <span>Список телефонов</span>
    </h3>

    <div v-if="localPhones.length" class="draggable-phones__content">
      <GridLayout
        v-model:layout="layout"
        :col-num="1"
        :row-height="40"
        :is-draggable="true"
        :margin="[0, 0]"
        :is-resizable="false"
        :vertical-compact="true"
        moving-placeholder-class="grid-placeholder"
        :prevent-collision="false"
        :compact-type="'vertical'"
        @layout-updated="onLayoutUpdated"
      >
        <GridItem
          v-for="(item, index) in localPhones"
          :key="item.id"
          :x="0"
          :y="index"
          :w="1"
          :h="1"
          :i="item.id || generateUniqueId(index)"
          drag-allow-from=".drag-handle"
          class="draggable-phones__grid-item"
        >
          <div class="phone-row">
            <div class="phone-cell phone-info">
              <div class="drag-icon drag-handle">
                <SvgIcon :width="24" :height="24" name="drag-handler" />
              </div>
              <span @click="editItem(item)"> {{ item.Title }}</span>
            </div>
            <div class="phone-cell phone-number" @click="editItem(item)">
              {{ item.DisplayPhone }}
              <span class="phone-status" v-if="item.IsMain">Основной</span>
            </div>
            <div class="phone-cell phone-comment" @click="editItem(item)">
              {{ item.Comment }}
            </div>
          </div>
        </GridItem>
      </GridLayout>
    </div>

    <div v-else class="draggable-phones__empty">Список телефонов пуст</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import UiButton1 from '@/components/Ui/DataEntry/UiButton1.vue'
import { GridItem, GridLayout } from 'grid-layout-plus'
import type { Layout } from 'grid-layout-plus'

// Обработчик события изменения макета
const onLayoutUpdated = (newLayout: Layout) => {
  if (!newLayout || !newLayout.length || isUpdating) return

  try {
    isUpdating = true

    // Создаем новый порядок телефонов на основе обновленного макета
    // Сортируем по y-координате (вертикальное положение)
    const orderedLayout = [...newLayout].sort((a, b) => a.y - b.y)

    // Создаем отображение id -> index в новом порядке для быстрого поиска
    const newOrderMap = new Map<string, number>()
    orderedLayout.forEach((layoutItem, newIndex) => {
      if (layoutItem.i !== undefined) {
        newOrderMap.set(String(layoutItem.i), newIndex)
      }
    })

    // Пропускаем обработку, если количество элементов не совпадает
    if (orderedLayout.length !== localPhones.value.length) {
      resetLayout()
      return
    }

    // Вместо создания нового массива, мы просто упорядочиваем существующие элементы
    // Это более надежный подход, так как мы не пытаемся искать элементы по ID
    const originalPhones = [...props.collection]
    const reorderedCollection: PhoneItem[] = []

    // Для каждого элемента в макете находим соответствующий телефон
    orderedLayout.forEach((layoutItem) => {
      if (!layoutItem.i) return

      // Ищем телефон с таким же ID в localPhones
      const phoneIndex = localPhones.value.findIndex((p) => String(p.id) === String(layoutItem.i))

      if (phoneIndex !== -1) {
        // Если нашли, то берем соответствующий originalPhone по тому же индексу
        if (phoneIndex < originalPhones.length) {
          reorderedCollection.push({ ...originalPhones[phoneIndex] })
        } else {
          // Если индекс выходит за пределы originalPhones, используем локальный телефон
          reorderedCollection.push({ ...localPhones.value[phoneIndex] })
        }
      }
    })

    // Проверяем, что все элементы были найдены
    if (reorderedCollection.length === props.collection.length) {
      // Отправляем событие с упорядоченной коллекцией
      emit('order-change', reorderedCollection)

      // Обновляем локальную коллекцию
      const phonesWithIds = reorderedCollection.map((item, index) => {
        // Сохраняем существующий ID или создаем новый стабильный
        const stableId =
          item.id || `phone_${item.DisplayPhone.replace(/\D/g, '')}` || generateUniqueId(index)

        return {
          ...item,
          id: stableId,
          __index: index,
          __originalIndex: index,
        }
      })

      localPhones.value = phonesWithIds

      // Обновляем макет с обновленными ID
      layout.value = phonesWithIds.map((item, index) => ({
        x: 0,
        y: index,
        w: 1,
        h: 1,
        i: String(item.id),
      }))
    } else {
      resetLayout()
    }
  } catch (error) {
    resetLayout()
  } finally {
    // Сбрасываем флаг обновления с небольшой задержкой
    setTimeout(() => {
      isUpdating = false
    }, 50)
  }
}

// Определение интерфейса для элемента телефонов
interface PhoneItem {
  id?: string
  DisplayPhone: string
  Comment: string
  IsMain?: boolean
  Title: string
  [key: string]: any
}

// Генерация уникального ID для элемента
const generateUniqueId = (index: number) => `phone_${index}`

// Определение пропсов компонента
const props = defineProps<{
  type: 'phones'
  object: any
  id: string
  collection: PhoneItem[]
}>()

const emit = defineEmits(['add-item', 'edit-item', 'order-change'])

// Обработчик добавления нового элемента
const addItem = () => {
  emit('add-item')
}

// Обработчик редактирования элемента
const editItem = (item: PhoneItem) => {
  emit('edit-item', item)
}

// Флаг для предотвращения рекурсивных обновлений
let isUpdating = false

// Создаем локальную копию коллекции телефонов с уникальными идентификаторами
const localPhones = ref<PhoneItem[]>([])

// Создаем макет для Grid Layout
const layout = ref<Layout>([])

// При изменении коллекции обновляем локальные данные
watch(
  () => props.collection,
  (newVal) => {
    // Предотвращаем обновление, если сейчас происходит внутреннее обновление
    if (isUpdating) return

    if (newVal) {
      // Убедимся, что у каждого элемента есть ID
      const phonesWithIds = newVal.map((item, index) => {
        // Если у элемента уже есть ID, сохраняем его
        // В противном случае создаем новый стабильный ID на основе DisplayPhone
        const stableId =
          item.id || `phone_${item.DisplayPhone.replace(/\D/g, '')}` || generateUniqueId(index)

        return {
          ...item,
          id: stableId,
          __index: index,
          __originalIndex: index,
        }
      })

      localPhones.value = phonesWithIds

      // Инициализируем макет
      layout.value = phonesWithIds.map((item, index) => ({
        x: 0,
        y: index,
        w: 1,
        h: 1,
        i: String(item.id),
      }))
    }
  },
  { immediate: true, deep: true },
)

// Функция сброса макета к исходному состоянию
const resetLayout = () => {
  // Восстанавливаем локальную коллекцию из props
  const phonesWithIds = props.collection.map((item, index) => {
    // Сохраняем существующий ID или создаем новый стабильный
    const stableId =
      item.id || `phone_${item.DisplayPhone.replace(/\D/g, '')}` || generateUniqueId(index)

    return {
      ...item,
      id: stableId,
      __index: index,
      __originalIndex: index,
    }
  })

  localPhones.value = phonesWithIds

  // Восстанавливаем макет
  layout.value = phonesWithIds.map((item, index) => ({
    x: 0,
    y: index,
    w: 1,
    h: 1,
    i: String(item.id),
  }))
}
</script>

<style lang="scss" scoped>
.draggable-phones {
  &__title {
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: bold;
  }

  &__grid {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    position: relative; /* Для корректного позиционирования во время перетаскивания */
  }

  &__grid-item {
    width: 100%;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
    &:hover {
      background: var(--color-bg-lighten);
    }

    /* Стили для активного перетаскиваемого элемента */
  }

  /* Стили для элементов во время перетаскивания другого элемента */

  &__empty {
    padding: 16px;
    text-align: center;
    color: var(--color-font-disabled);
    border: 1px dashed var(--color-border);
    margin-top: 8px;
  }
}

.phone-row {
  display: grid;
  grid-template-columns: 30% 40% 30%;
  height: 100%;
  width: 100%;
}

.phone-cell {
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  text-align: left;
  vertical-align: middle;
  overflow: hidden;
  text-wrap: nowrap;
  position: relative;

  &.drag-handle {
    cursor: move !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
}
.phone-info,
.phone-number {
  display: flex;
  gap: 10px;
  align-items: center;
}
.phone-status {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
  background: var(--component-blue-background);

  border: 1px solid var(--color-border);
  border-radius: 40px;
  padding: 2px 8px 3px;
  border-width: 1px;
  margin-left: 8px;
}

.drag-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-border);
}

/* Также добавляем стили для классов из Vue Grid Layout */

:deep(.vgl-item--placeholder) {
  border: 2px dashed #2196f3 !important;
  background-color: rgba(33, 150, 243, 0.1) !important;
  z-index: 1 !important;
  opacity: 0.9 !important;
}

/* Анимация для иконки перетаскивания */
</style>
