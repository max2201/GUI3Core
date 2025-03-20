<template>
  <svg
    class="svg-icon"
    aria-hidden="true"
    :style="{
      width: width ? width + 'px' : undefined,
      height: height ? height + 'px' : undefined,
    }"
    :class="{
      'svg-icon_is-link': isLink,
    }"
  >
    <use :href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  isLink: {
    type: Boolean,
    default: false,
  },
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  flex: 0 0 auto;
  width: 1em;
  height: 1em;
  line-height: 1;
  max-width: unset;

  &_is-link {
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
