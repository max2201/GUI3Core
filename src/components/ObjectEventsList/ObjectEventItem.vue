<template>
  <div class="object-event-item">
    <div class="object-event-item__header">
      <SvgIcon :width="24" :height="24" name="chat" />
      <div>
        {{ objectEvent.CreationTime }}
      </div>
      <div>
        {{ objectEvent.SlaveObjectTitle }}
      </div>
    </div>

    <div class="object-event-item__owner">
      {{ objectEvent.OwnerTitle }}
    </div>

    <div v-if="descriptionObject && descriptionObject.Images" class="object-event-item__images">
      <UiExternalImage
        v-for="(image, index) in descriptionObject.Images"
        :key="index"
        :src="image.url"
        width="134px"
        height="134px"
        class="object-event-item__img"
        @dblclick="onDoubleClickImg(image)"
      />
    </div>

    <div
      v-if="eventTextMessage"
      :class="[
        'object-event-item__message',
        {
          'object-event-item__message_important': objectEvent.IsImportant,
        },
      ]"
    >
      {{ eventTextMessage }}
    </div>

    <div v-if="failedCallMessage" :class="['object-event-item__call-message']">
      {{ failedCallMessage }}
    </div>

    <div v-if="descriptionObject && descriptionObject.TalkDuration && !failedCallMessage">
      Время разговора: {{ descriptionObject.TalkDuration }}
    </div>

    <div v-if="changes.length" class="object-event-item__changes">
      <div
        v-for="(change, key) in changes"
        :key="key"
        :class="[
          'object-event-item__changes__items',
          {
            'mb-2': key < changes.length - 1,
          },
        ]"
      >
        <span class="color-gray text-right">Изменено поле:</span>
        <span>{{ getChangeText(change) }}</span> <span class="color-gray text-right">Было:</span>
        <span class="color-gray">{{ change.OldShortValue }}</span>
        <span class="color-gray text-right">Стало:</span>
        <span>{{ change.NewShortValue }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFileUploadResult } from '@/core/interface/Files'
import type {
  IObjectEvent,
  IObjectEventDescription,
  IObjectEventFieldChange,
} from '@/core/interface/ObjectEvent'
import { useOpenExternalImage } from '@/composables/use-open-external-image'

const props = defineProps<{
  objectEvent: IObjectEvent
}>()

const descriptionObject = computed(() => {
  return parseJson<IObjectEventDescription>(props.objectEvent.Description)
})

const changes = computed<IObjectEventFieldChange[]>(() => {
  return descriptionObject.value?.Changes || []
})

const eventTextMessage = computed(() => {
  if (descriptionObject.value) {
    return (
      descriptionObject.value.Message ||
      descriptionObject.value.MessageText ||
      descriptionObject.value.Text
    )
  }

  return props.objectEvent.Description
})

const failedCallMessage = computed(() => {
  if (descriptionObject.value?.CallDirection && !descriptionObject.value.ConnectedDateTime) {
    if (descriptionObject.value.CallDirection === 1) {
      return 'Не дозвонился'
    }

    if (descriptionObject.value.CallDirection === 3) {
      return 'Не ответил'
    }
  }
})

const getChangeText = (change: IObjectEventFieldChange): string => {
  let result = change.FiledName

  if (change.FiledGroupName) {
    return change.FiledGroupName + '. ' + result
  }

  return result
}

const { openExternalImage } = useOpenExternalImage()
const onDoubleClickImg = (image: IFileUploadResult) => {
  openExternalImage({
    url: image.url,
    fileName: image.originalName,
  })
}
</script>

<style scoped lang="scss">
.object-event-item {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: 20px auto;
  gap: 8px;
  padding: 16px 0;

  &__header {
    display: grid;
    align-items: center;
    gap: 8px;
    grid-template-columns: 20px auto 170px;
    color: var(--color-gray);
  }

  &__owner {
    color: var(--color-font);
    font-weight: var(--font-weight-600);
  }

  &__message,
  &__changes {
    font-weight: var(--font-weight-400);
  }

  &__message_important {
    color: var(--color-red);
  }

  &__call-message {
    color: var(--color-red);
  }

  &__changes {
    &__items {
      display: grid;
      grid-template-columns: 112px 1fr;
      gap: 0 6px;
    }
  }

  &__images {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  &__img {
    cursor: pointer;
  }
}
</style>
