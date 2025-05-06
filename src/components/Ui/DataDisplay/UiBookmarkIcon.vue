<template>
  <div
    :class="[
      'bookmark-icon',
      {
        'bookmark-icon_active': active,
      },
    ]"
    @click="handleClick"
  ></div>
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
.bookmark-icon {
  width: 20px;
  height: 20px;
  background-image: url(/src/assets/icons/bookmark/default.svg);

  &:hover {
    background-image: url(/src/assets/icons/bookmark/plus.svg);
  }

  &_active {
    background-image: url(/src/assets/icons/bookmark/active.svg);

    &:hover {
      background-image: url(/src/assets/icons/bookmark/minus.svg);
    }
  }
}
</style>
