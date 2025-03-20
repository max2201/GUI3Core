<template>
  <div class="ui-notification-form">
    <UiButtonGroupSwitcher
      :buttons="modes"
      :selected-button="selectedMode"
      @select="onChangeMode"
    />

    <template v-if="selectedMode === RelativeTimeID">
      <UiDatepicker
        :model-value="selectedRelativeDate"
        mode="date"
        :min-date="new Date()"
        @update:model-value="onChangeRelativeDate"
      />

      <UiSelect1 v-model="selectedTimeOption" :options="timesOptions" />
    </template>

    <template v-else>
      <UiDatepicker :min-date="new Date()" v-model="selectedCertainDate" mode="dateTime" />
    </template>

    <UiSelect1
      v-if="isSelectedDateToday"
      v-model="reciepents"
      :options="reciepentsOptions"
      :disabled="reciepentsOptions.length === 1"
      select-label="Получатели уведомлений"
      multiple
    />

    <UiSelect1
      v-else
      v-model="selectedRoles"
      :options="rolesOptions"
      :disabled="rolesOptions.length === 1"
      select-label="Получатели уведомлений"
      multiple
      searchable
    />
  </div>
</template>

<script setup lang="ts">
import UiDatepicker from '@/components/Ui/DataEntry/UiDatepicker.vue'
import UiButtonGroupSwitcher from '@/components/Ui/DataEntry/UiButtonGroupSwitcher.vue'
import moment from 'moment'
import { DefaultDateFormat, DefaultDatetimeFormat } from '@/core/constants/DefaultDatetimeFormats'
import type { ISelect } from '@/core/interface/Ui'
import type { RequestReminderPayload } from '@/core/interface/Requests'

const props = defineProps<{
  lessTimesOptions: ISelect[]
  greatTimesOptions: ISelect[]
  users: ISelect[]
  roles: ISelect[]
}>()

const emits = defineEmits(['change'])

const RelativeTimeID = 0
const CertainTimeID = 1

const modes = ref([
  {
    id: RelativeTimeID,
    label: 'Дата',
  },
  {
    id: CertainTimeID,
    label: 'Точное время',
  },
])
const selectedMode = ref(RelativeTimeID)
const onChangeMode = (tabId: any) => {
  selectedMode.value = tabId
  onChange()
}

const selectedRelativeDate = ref(new Date())
const onChangeRelativeDate = (date) => {
  selectedRelativeDate.value = date
  selectedTimeOption.value = timesOptions.value[0]
  onChange()
}

const isSelectedDateToday = computed(() =>
  selectedMode.value === RelativeTimeID
    ? moment(selectedRelativeDate.value).isSame(moment(), 'day')
    : moment(selectedCertainDate.value).isSame(moment(), 'day'),
)

const timesOptions = computed(() => {
  return (isSelectedDateToday.value ? props.lessTimesOptions : props.greatTimesOptions) || []
})

const selectedTimeOption = ref(timesOptions.value[0])

const selectedCertainDate = ref(new Date())

const reciepentsOptions = computed(() => {
  return props.users || []
})
const reciepents = ref([reciepentsOptions.value[0]])

const rolesOptions = computed(() => {
  return props.roles || []
})

const selectedRoles = ref([rolesOptions.value[0]])

watch([selectedRoles, reciepents, selectedTimeOption, selectedCertainDate], () => {
  onChange() // Функция будет выполнена при изменении любого значения
})

const onChange = () => {
  emits('change', {
    Checked: true,
    IsExactTime: selectedMode.value === CertainTimeID,
    dtExact: moment(selectedCertainDate.value).format(DefaultDatetimeFormat),
    dateRemind: moment(selectedRelativeDate.value).format(DefaultDateFormat),
    ddlTimeRemind: selectedTimeOption.value.value,
    UsersIds: reciepents.value.map((v) => v.value).join('|'),
    // UsersIds: isSelectedDateToday.value
    //   ? reciepents.value.map((v) => v.value).join('|')
    //   : undefined,
    RolesIds: selectedRoles.value.map((v) => v.value).join('|'),
    // RolesIds:
    //   isSelectedDateToday.value
    // ? undefined
    // : selectedRoles.value.map((v) => v.value).join('|'),
  } as RequestReminderPayload)
}

onMounted(() => {
  onChange()
})
</script>

<style lang="scss" scoped>
.ui-notification-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
