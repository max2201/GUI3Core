<template>
  <div class="call-moderator-comment-empty-wrapper">
    <slot v-if="isEmpty" name="empty-state" :addAction="addClick" />
    <slot v-else name="filled-state" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isEmpty?: boolean
}>()
const emit = defineEmits(['add-action'])
const addClick = () => {
  emit('add-action')
}
</script>

<style scoped lang="scss"></style>
