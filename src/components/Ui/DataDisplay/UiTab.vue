<template>
  <div
    class="ui-tab"
    :class="{
      'ui-tab--active': active,
      'ui-tab--compact': compact,
      'ui-tab--transparent': transparent,
      'ui-tab--dark': dark,
      'ui-tab--submitted': submitted,
    }"
    :title="title"
    @click="onClickTab"
    @mousedown="onMousedownTab($event)"
  >
    <div class="ui-tab__bookmark" v-if="color" :style="{ backgroundColor: color }"></div>
    <div v-if="closable" class="ui-tab__close" @click.stop="onCloseTab">
      <SvgIcon name="close" />
    </div>
    <slot name="prepend"></slot>
    <div class="ui-tab__title">{{ title }}</div>
    <slot name="append"></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  active?: boolean
  title?: string
  color?: string
  closable?: boolean
  compact?: boolean
  submitted?: boolean
  transparent?: boolean
  dark?: boolean
}>()

const emit = defineEmits(['tab-click', 'close-tab'])

const onMousedownTab = (event: Event) => {
  if (event.button === 1) {
    emit('close-tab')
  }
}

const onClickTab = () => {
  emit('tab-click')
}

const onCloseTab = () => {
  emit('close-tab')
}
</script>

<style lang="scss" scoped>
.ui-tab {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  min-width: 154px;
  width: max-content;
  padding: 5px 7px 5px 11px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  transition: background-color 0.25s $ease;
  user-select: none;

  &--compact {
    min-width: unset;
    padding: 6px 0;
  }

  &:hover {
    z-index: 3;
    background: var(--color-bg-darken);
  }

  &--active {
    background: var(--component-blue-background);
    border-color: var(--color-bg-active);
  }

  &--transparent {
    border-radius: 0;
    border: none;
    background: transparent;
    color: var(--color-gray);

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 4px;
      width: 100%;
      border-radius: 5px 5px 0 0;
      z-index: 2;
    }

    &:hover {
      background: transparent;

      &::after {
        background-color: var(--color-bg-active);
      }
    }

    &.ui-tab--dark {
      color: var(--color-gray);

      &:hover {
        &::after {
          background-color: var(--color-font-invert);
        }
      }

      &.ui-tab--active {
        background: transparent;
        color: var(--color-font-invert);

        &::after {
          background-color: var(--color-font-invert);
        }
      }
    }

    &.ui-tab--active {
      color: var(--color-font-2);

      &::after {
        background-color: var(--color-bg-active);
      }
    }

    &.ui-tab--submitted {
      &:hover {
        &::after {
          background-color: var(--color-green) !important;
        }
      }

      &.ui-tab--active {
        &::after {
          background-color: var(--color-green);
        }
      }
    }
  }

  &__bookmark {
    position: absolute;
    left: 0;
    top: 50%;
    width: 5px;
    height: 24px;
    transform: translateY(-50%);
    background: #1a8ff2;
    border-radius: 0 5px 5px 0;
    pointer-events: none;
  }

  &__close {
    flex: 0 0 auto;
    margin-right: 6px;
    color: var(--color-gray);
    transition: color 0.25s $ease;
    font-size: 0;
    cursor: pointer;

    .svg-icon {
      font-size: var(--font-size-24);
    }

    &:hover {
      color: var(--color-red);
    }
  }

  &__title {
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-14);
    @include text-overflow;
  }
}
</style>
