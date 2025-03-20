<template>
  <div class="badges-component">
    <UiBadge
      v-for="(badge, index) in badges"
      :key="index + 'badge'"
      :value="badge.value"
      :passive="badge.passive"
      :success="badge.success"
      :danger="badge.danger"
      :icon-before="badge.iconBefore"
      :rounded-left-border="index === 0"
      :rounded-right-border="index === badges.length - 1"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  badges: {
    value: string
    passive?: boolean
    success?: boolean
    danger?: boolean
    iconBefore?: string
  }[]
}>()
</script>

<style lang="scss">
.badges-component {
  display: flex;
  align-items: center;
}
</style>
