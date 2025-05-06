<template>
  <div class="call-connection-status" :class="{ 'call-connection-status--compact': compact }">
    <div class="call-connection-status__info">
      <SvgIcon
        class="call-connection-status__info-icon"
        :name="`calls-${parsedFields.DirectionAndStatus?.Value}`"
        :width="20"
        :height="20"
      />
      <span class="call-connection-status__info-text">{{
        parsedFields.ConnectionStatus.Value
      }}</span>
    </div>
    <div class="call-connection-status__time-block">
      <span v-if="parsedFields.TimeAndDuration?.Value" class="call-connection-status__date">{{
        parsedFields.TimeAndDuration.Value
      }}</span>
      <div class="call-connection-status__duration">
        {{ parsedFields.TimeAndDuration.Detailing || '0:00:00' }}
      </div>
    </div>
    <div class="call-connection-status__actions" v-if="+callInfo.Detailing">
      <UiButton1
        :disabled="!audioLink"
        @click="handleDownload"
        size="extra-large"
        icon-left="download"
        theme="success"
        :icon-size="24"
      ></UiButton1>
      <UiButton1
        :disabled="!audioLink"
        @click="togglePlay"
        size="extra-large"
        :icon-left="isPlaying ? 'pause' : 'play'"
        theme="success"
        :icon-size="24"
      ></UiButton1>
    </div>
    <div v-if="parsedFields.LineNumber" class="call-connection-status__line-number">
      <span class="call-connection-status__line-number-title">{{
        parsedFields.LineNumber.Title
      }}</span>
      <div class="call-connection-status__line-number-value">
        {{ formatPhoneNumber(parsedFields.LineNumber.Value) }}
      </div>
    </div>
  </div>

  <audio
    v-if="audioLink"
    ref="audioRef"
    :src="audioLink"
    @ended="handleEnded"
    @play="handlePlay"
    @pause="handlePause"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  callInfo
  compact?: boolean
}>()

const parsedFields = computed(() => {
  return props.callInfo.Fields.reduce((acc, item) => {
    acc[item.Code] = item
    return acc
  }, {})
})

const panelColors = computed(() => {
  return {
    background: getSystemColor(props?.callInfo?.SystemColor)?.secondary || '',
    duration: getSystemColor(parsedFields.value?.TimeAndDuration?.SystemColor)?.primary || '',
  }
})

const audioRef = ref<HTMLAudioElement | null>(null)

const audioLink = computed(() => {
  if (parsedFields.value?.Link?.Value) {
    return `${import.meta.env.VITE_API_URL}/${parsedFields.value.Link.Value}`
  } else return ''
})

const isPlaying = ref(false)
const togglePlay = () => {
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
}

const handlePlay = () => {
  isPlaying.value = true
}

const handlePause = () => {
  isPlaying.value = false
}

const handleEnded = () => {
  isPlaying.value = false
}

const handleDownload = () => {
  if (audioLink.value) {
    const link = document.createElement('a')
    link.href = audioLink.value
    link.click()
  }
}
</script>

<style scoped lang="scss">
.call-connection-status {
  $this: &;

  padding: 20px 24px;
  background-color: v-bind('panelColors.background');
  display: grid;
  grid-template-columns: auto max-content;
  gap: 8px;

  grid-template-areas:
    'status action'
    'duration action';

  &--compact {
    width: 300px;
    row-gap: 16px;
    justify-items: flex-start;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'status status'
      'duration action';

    #{$this}__time-block {
      align-self: center;
      align-items: flex-start;
      flex-direction: column;
    }
  }

  &__info {
    align-self: end;
    grid-area: status;
    display: flex;
    gap: 8px;
    align-items: center;

    &-text {
      font-family: Inter;
      font-size: 16px;
      font-weight: 600;
      line-height: 20.8px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }
  }

  &__time-block {
    grid-area: duration;
    display: flex;
    gap: 8px;
    flex-direction: row;
    align-items: center;
  }

  &__date {
    font-family: Inter;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.8px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }

  &__duration {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 2px 8px;
    border-radius: 20px;
    background: v-bind('panelColors.duration');

    font-family: Inter;
    font-size: 12px;
    font-weight: 600;
    line-height: 14.52px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #ffffff;
  }

  &__actions {
    grid-area: action;
    display: flex;
    gap: 8px;
  }

  &__line-number {
    grid-column: span 2;
    display: flex;
    flex-direction: column;
    gap: 6px;

    font-family: Inter;
    color: #23282f;
    font-size: 14px;
    font-weight: 400;
    line-height: 16.8px;

    &-value {
      font-weight: 600;
    }
  }
}
</style>
