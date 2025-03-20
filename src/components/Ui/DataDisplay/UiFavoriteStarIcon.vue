<template>
  <UiButton1
    :class="['favorite-star-icon', { 'favorite-star-icon_active': active }]"
    theme="transparent"
    variant="text"
    @click.stop="handleClick"
  ></UiButton1>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.favorite-star-icon {
  width: 24px;
  height: 24px;
  background-image: url(/src/assets/icons/favoritestar/default.svg);

  &:hover {
    background-image: url(/src/assets/icons/favoritestar/available-add.svg);
  }

  &_active {
    background-image: url(/src/assets/icons/favoritestar/active.svg);

    &:hover {
      background-image: url(/src/assets/icons/favoritestar/available-remove.svg);
    }
  }
}
</style>
