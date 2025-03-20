<template>
  <UiSwitch1
    :model-value="isShowCallbackToClient"
    label="Связь с клиентом"
    @update:model-value="changeShowCallback"
  />
  <UiNotificationDatePicker
    v-if="isShowCallbackToClient"
    :less-times-options="lessTimesOptions"
    :great-times-options="greatTimesOptions"
    :users="usersForReminder"
    :roles="rolesForReminder"
    @change="onChangeReminder"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  type IRequestDto,
  RecipientReminderGroup,
  type RequestReminderPayload,
  TimeReminderGroup,
} from '@/core/interface/Requests'
const props = defineProps({
  object: { type: Object, required: true },
  loading: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
})
const emit = defineEmits(['on-change'])

// ---------------------------
// Фабрики опций
// ---------------------------
function createOptionsFromValues(
  values: Array<{ Title: string; Value: string; Key: string }> = [],
) {
  return values.map((value) => {
    return {
      label: value.Title || ' ',
      value: value.Value,
      subitemKey: value.Key,
    } as ExtendedISelectItem
  })
}

function createOptionsFromSubItems(
  subItems: Array<{
    id: string
    values: Array<{ Title: string; Value: string; Key: string }>
  }> = [],
  subItemId?: string,
) {
  if (!subItemId) return []
  const found = subItems.find((s) => s.id === subItemId)
  if (!found) return []
  return createOptionsFromValues(found.values)
}
const objectData = computed<IRequestDto[]>(() => {
  return props.object || []
})
const isShowCallbackToClient = ref(false)
// Напоминание (даты/время/роли)
const lessTimesOptions = computed<ExtendedISelectItem[]>(() => {
  return createOptionsFromSubItems(
    objectData.value?.TimeReminderField.subItems || [],
    TimeReminderGroup.time_reminder_less_now,
  )
})

const greatTimesOptions = computed<ExtendedISelectItem[]>(() => {
  return createOptionsFromSubItems(
    objectData.value?.TimeReminderField.subItems || [],
    TimeReminderGroup.time_reminder_great_now,
  )
})

const usersForReminder = computed<ExtendedISelectItem[]>(() => {
  return createOptionsFromSubItems(
    objectData.value?.RecipientReminderField.subItems || [],
    RecipientReminderGroup.users_reminder,
  )
})

const rolesForReminder = computed<ExtendedISelectItem[]>(() => {
  return createOptionsFromSubItems(
    objectData.value?.RecipientReminderField.subItems || [],
    RecipientReminderGroup.roles_reminder,
  )
})

const changeShowCallback = () => {
  isShowCallbackToClient.value = !isShowCallbackToClient.value
  if (!isShowCallbackToClient.value) {
    emit('on-change')
  }
}

const onChangeReminder = (reminderValue: RequestReminderPayload) => {
  emit('on-change', reminderValue)
  // object?.setReminder(reminderValue)
}
</script>
