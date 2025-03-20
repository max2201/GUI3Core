<template>
  <div :class="['widget-callback', `widget-callback_${statusClass}`]">
    <div class="widget-callback__title">Обратная связь</div>
    <div class="widget-callback__datetime">
      <span class="widget-callback__datetime__main">{{ notification.OnlyTimeString }}</span>
      ({{ notification.OnlyDeltaString }})
    </div>
    <div class="widget-callback__owner">{{ notification.UserName }}</div>
    <div class="widget-callback__comment"></div>

    <SvgIcon
      v-if="notification.QuikDeleteAvailable"
      :width="20"
      :height="20"
      name="close"
      class="close-button"
      @click="close"
    />
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { DefaultDatetimeFormat } from '@/core/constants/DefaultDatetimeFormats'

const props = defineProps<{
  notification: INotification
}>()

const emits = defineEmits(['close'])

const close = () => emits('close')

const statusClass = computed(() => {
  if (!props.notification) return ''

  const m = moment()
  const notyM = moment(props.notification.Time, DefaultDatetimeFormat)

  if (!notyM.isValid()) return ''

  if (m.isSameOrBefore(notyM)) return 'error'
  if (m.isAfter(notyM, 'hour')) return 'warning'

  return 'success'
  // return 'warning'
})
</script>

<style scoped lang="scss">
.widget-callback {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;

  &_success {
    background-color: var(--component-green-background-light);
  }
  &_error {
    background-color: var(--component-danger-background);
  }
  &_warning {
    background-color: var(--component-warning-background-light);
  }
}
.widget-callback__title {
  font-weight: var(--font-weight-600);
  font-size: var(--font-size-16);
}
.widget-callback__datetime {
  padding: 6px;
  border-radius: var(--button-border-radius);

  &__main {
    font-weight: var(--font-weight-600);
    margin-right: 6px;
  }
}
.widget-callback_success .widget-callback__datetime {
  background-color: var(--component-green-background);
}
.widget-callback_error .widget-callback__datetime {
  background-color: var(--component-danger);
}
.widget-callback_warning .widget-callback__datetime {
  background-color: var(--component-warning-background-2);
}
.widget-callback__owner {
  font-weight: var(--font-weight-600);
}
.widget-callback__comment {
}

.close-button {
  position: absolute;
  top: 20px;
  right: 5px;
  color: var(--color-gray);
}
</style>
