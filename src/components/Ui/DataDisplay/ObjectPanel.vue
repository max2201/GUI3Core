<template>
  <div class="object-panel-component">
    <span
      v-if="!hideColorMark"
      class="object-panel-component__badge"
      :style="{ ['background-color']: badgeColor }"
    />
    <UiButton1
      variant="text"
      icon-left="close"
      :icon-size="20"
      theme="transparent"
      v-if="showClose"
      :class="[...classesForIcons]"
      @click.stop.prevent="handleClickClose"
    ></UiButton1>
    <UiFavoriteStarIcon
      title="Добавить в избранное"
      v-if="showStar"
      :active="isStared"
      :class="[...classesForIcons]"
      class="object-panel-component__star"
      @click="handleClickStar"
    />
    <span>
      {{ title }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  showClose: {
    type: Boolean,
    default: false,
  },
  showStar: {
    type: Boolean,
    default: false,
  },
  isStared: {
    type: Boolean,
    default: false,
  },
  hideColorMark: {
    type: Boolean,
    default: false,
  },
  badgeColor: {
    type: String,
    default: '#000000',
  },
  classesForIcons: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'click-star'])

const handleClickClose = () => emit('close')
const handleClickStar = () => emit('click-star')
</script>

<style lang="scss">
.object-panel-component {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  background-color: var(--component-background);
  padding: 10px 17px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.2s ease-out;

  gap: 9px;

  &__badge {
    position: absolute;
    left: 0;
    height: 20px;
    width: 5px;
    border-radius: 0 5px 5px 0;
  }

  &:hover {
    border: var(--border-default);
    cursor: pointer;
  }
}

svg.object-panel-component__close {
  width: 20px !important;
  height: 20px !important;
  color: var(--color-gray);

  &:hover {
    color: var(--color-font);
    cursor: pointer;
  }

  &_active {
    color: var(--color-primary);
  }
}
</style>
