<template>
  <div v-if="status === readStatus.Sended" class="message-status-icon message-status-icon__sended" />
  <div v-else-if="status === readStatus.Recieved" class="message-status-icon message-status-icon__recieved" />
  <div v-else-if="status === readStatus.Readed" class="message-status-icon message-status-icon__readed" />
</template>

<script setup lang="ts">
import { ReadStatus } from "@/core/interface/MessageDTO"

const props = defineProps<{
  status: ReadStatus
}>()

const readStatus = ReadStatus
</script>

<style scoped lang="scss">
.message-status-icon {
  width: 19px;
  height: 9px;

  &__idle {
    background-image: url(/src/assets/icons/messenger/check.svg);
  }
  &__sended {
    background-image: url(/src/assets/icons/messenger/check.svg);
  }
  &__recieved {
    background-image: url(/src/assets/icons/messenger/double-check.svg);
  }
  &__readed {
    background-image: url(/src/assets/icons/messenger/double-blue-check.svg);
  }
  &__inbound {
  }
}
</style>