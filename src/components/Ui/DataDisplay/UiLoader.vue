<template>
  <div
    :class="['loader', `_${theme}`, loading && '_loading', notTransparent && '_not-transparent']"
  >
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      style="enable-background: new 0 0 50 50"
      xml:space="preserve"
    >
      <rect x="0" y="0" width="4" height="7" fill="currentColor">
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="scale"
          values="1,1; 1,3; 1,1"
          begin="0s"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </rect>

      <rect x="10" y="0" width="4" height="7" fill="currentColor">
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="scale"
          values="1,1; 1,3; 1,1"
          begin="0.2s"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </rect>
      <rect x="20" y="0" width="4" height="7" fill="currentColor">
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="scale"
          values="1,1; 1,3; 1,1"
          begin="0.4s"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    theme?: 'inline' | 'page'
    loading?: boolean
    notTransparent?: boolean
  }>(),
  {
    theme: 'inline',
    loading: false,
    notTransparent: false,
  },
)
</script>

<style lang="scss" scoped>
.loader {
  color: var(--color-primary);
  transition: opacity 0.25s $ease;

  &._inline {
    margin: 16px 0;
  }

  &._page {
    position: absolute;
    z-index: 9;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(white, 0.5);
    opacity: 0;
    pointer-events: none;

    svg {
      width: 48px;
      height: 48px;
    }

    &._loading {
      opacity: 1;
      pointer-events: all;
    }

    &._not-transparent {
      background: white;
      z-index: 999999999999999;
    }
  }
  overscroll-behavior-y: none;
}
</style>
