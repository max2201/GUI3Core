<template>
  <div :class="['chat-multiple-messages', {
    'chat-multiple-messages__one-column': messages[0].type === MessageType.AudioFileLink
  }]">
    <MessageContent
      v-for="(message, index) in messages"
      :key="index"
      :message="message"
    />
  </div>
</template>

<script setup lang="ts">
import type { IChatMessage } from '@/core/interface/Chat'
import { MessageType } from '@/core/interface/MessageDTO';

const props = defineProps<{
  messages: IChatMessage[]
}>()
</script>

<style scoped lang="scss">
.chat-multiple-messages {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  &__one-column {
    flex-direction: column;
  }
}
</style>
