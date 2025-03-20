<template>
  <div class="notificationsFilters">
    <div
      v-for="(filter, index) in sessionStorageFilters"
      :key="index"
      @click="toggleActiveFilter(filter)"
      :class="[filter.active && 'notificationsFilters__item-active']"
      class="notificationsFilters__item"
    >
      <div
        :class="[filter.notEmpty && 'notificationsFilters__item-icon_notEmpty']"
        class="notificationsFilters__item-icon"
      >
        <svgIcon :name="`iconNotificationBar-${filter.type}`"></svgIcon>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useNotificationsStore } from '@/core/store/notifications.store'
import { cloneDeep } from 'lodash'

const notifications = useNotificationsStore()

const props = defineProps<{
  componentType: String
}>()
const notificationsFilters = ref([
  {
    type: 0,
    active: false,
    notEmpty: false,
  },
  {
    type: 1,
    active: false,
    notEmpty: false,
  },
  {
    type: 3,
    active: false,
    notEmpty: false,
  },
  {
    type: 4,
    active: false,
    notEmpty: false,
  },
  {
    type: 5,
    active: false,
    notEmpty: false,
  },
])
const emitArray = ref([])
const sessionStorageFilters = ref(null)
const emit = defineEmits(['updateNotificationsFilters'])

onMounted(() => {
  const storedFilters = sessionStorage.getItem(`${props.componentType}Filters`)
  if (storedFilters) {
    sessionStorageFilters.value = Object.values(JSON.parse(storedFilters))
  } else {
    const setFiltersArray = cloneDeep(notificationsFilters.value)
    sessionStorage.setItem(`${props.componentType}Filters`, JSON.stringify(setFiltersArray))
    sessionStorageFilters.value = setFiltersArray
  }
})

watch(
  () => notifications.notificationsBarArray,
  (notificationsBarArray) => {
    sessionStorageFilters?.value?.forEach((filter) => (filter.notEmpty = false)) // сбросим значения свойства notEmpty перед обновлением
    notificationsBarArray?.forEach((item) => {
      const filterIndex = sessionStorageFilters?.value?.findIndex(
        (filter) => filter.type === item.type,
      )
      sessionStorageFilters.value[filterIndex].notEmpty = item.count > 0 && filterIndex > -1
    })
  },
  { deep: true },
)

const toggleActiveFilter = (item) => {
  const index = sessionStorageFilters.value.findIndex((filter) => filter.type === item.type)
  if (index === -1) {
    // Элемент не найден в массиве sessionStorageFilters.value,
    // пушим новый фильтр
    sessionStorageFilters.value.push({
      type: item.type,
      active: false,
      notEmpty: false,
    })
  } else {
    // Элемент найден в массиве sessionStorageFilters.value,
    // меняем статус активности
    sessionStorageFilters.value[index].active = !sessionStorageFilters.value[index].active
  }
}

watch(
  () => sessionStorageFilters.value,
  (sessionStorageFilters) => {
    if (sessionStorageFilters?.length) {
      sessionStorage.setItem(`${props.componentType}Filters`, JSON.stringify(sessionStorageFilters))
      const activeElementArray = []
      sessionStorageFilters.forEach((item) => {
        item.active ? activeElementArray.push(item.type) : ''
      })
      emitArray.value = activeElementArray
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => emitArray.value,
  (emitArray) => {
    emit('updateNotificationsFilters', emitArray)
  },
)
</script>
