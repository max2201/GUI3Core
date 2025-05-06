<template>
  <div ref="rowRef" class="table" :id="id">
    <!-- Используем компонент CollectionTableView для отображения таблиц разных типов -->
    <CollectionTableView
      :type="props.type"
      :object="props.object"
      :id="id"
      :collection="collection"
      @add-item="handleAddItem"
      @edit-item="handleEditItem"
      @order-change="handleOrderChange"
    />

    <!-- Модальное окно для добавления/редактирования контактных лиц -->
    <ContactPersonModal
      v-if="props.type === 'contact'"
      :id="id"
      :is-open="isContactModalOpen"
      :editing-contact="editingContactPerson"
      :object-collection="props.object.Collection || []"
      :client-code="props.object.ClientCode"
      @update:is-open="isContactModalOpen = $event"
      @update:collection="updateContactCollection"
    />

    <!-- Модальное окно для добавления/редактирования банковских карт -->
    <BankCardModal
      v-if="props.type === 'card'"
      :id="id"
      :is-open="isCardModalOpen"
      :editing-card="editingCard"
      :object-collection="props.object.Collection || []"
      @update:is-open="isCardModalOpen = $event"
      @update:collection="updateCardCollection"
    />

    <!-- Модальное окно для добавления/редактирования телефонов -->
    <PhoneModal
      v-if="props.type === 'phones' || props.type === 'phones-draggable'"
      :id="id"
      :is-open="isPhoneModalOpen"
      :editing-phone="editingPhone"
      :object-collection="props.object.Collection || []"
      @update:is-open="isPhoneModalOpen = $event"
      @update:collection="updatePhoneCollection"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ICardsData, IContactPersonsInfo } from '@/core/interface/Client'
const props = defineProps<{
  type: 'clients' | 'contact' | 'card' | 'phones' | 'phones-draggable'
  object: IContactPersonsInfo | ICardsData
  id?: string
}>()

const emits = defineEmits(['open-client'])

// Генерируем ID для таблицы, если он не передан
const id = props.id || `table-${Date.now()}`

// Состояние модальных окон
const isContactModalOpen = ref(false)
const isCardModalOpen = ref(false)
const isPhoneModalOpen = ref(false)
const editingContactPerson = ref(null)
const editingCard = ref(null)
const editingPhone = ref(null)

// Получаем коллекцию элементов для отображения
const collection = computed(() => {
  return props.object.Collection ?? []
})

// Обработчик добавления нового элемента
const handleAddItem = () => {
  if (props.type === 'contact') {
    editingContactPerson.value = null
    isContactModalOpen.value = true
  } else if (props.type === 'card') {
    editingCard.value = null
    isCardModalOpen.value = true
  } else if (props.type === 'phones' || props.type === 'phones-draggable') {
    editingPhone.value = null
    isPhoneModalOpen.value = true
  }
}

// Обработчик редактирования существующего элемента
const handleEditItem = (item: any) => {
  if (props.type === 'contact') {
    editingContactPerson.value = item
    isContactModalOpen.value = true
  } else if (props.type === 'card') {
    editingCard.value = item
    isCardModalOpen.value = true
  } else if (props.type === 'phones' || props.type === 'phones-draggable') {
    editingPhone.value = item
    isPhoneModalOpen.value = true
  }
}

// Обработчик изменения порядка элементов
const handleOrderChange = (newOrder: any[]) => {
  if (props.object && Array.isArray(props.object.Collection)) {
    // Обновляем порядок элементов в коллекции объекта
    props.object.Collection = [...newOrder]
  }
}

// Обновление коллекции контактных лиц
const updateContactCollection = (newCollection: any[]) => {
  if (props.object) {
    props.object.Collection = [...newCollection]
  }
}

// Обновление коллекции банковских карт
const updateCardCollection = (newCollection: any[]) => {
  if (props.object) {
    props.object.Collection = [...newCollection]
  }
}

// Обновление коллекции телефонов
const updatePhoneCollection = (newCollection: any[]) => {
  if (props.object) {
    props.object.Collection = [...newCollection]
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
}
</style>
