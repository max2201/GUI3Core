<template>
  <div
    :class="[
      'ui-external-image',
      {
        'ui-external-image__loaded': loaded,
      }
    ]"
    :style="{
      width,
      height,
    }"
  >
    <img
      :src="src"
      :alt="alt"
      @load="onLoad"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '150px',
  },
  height: {
    type: String,
    default: '150px',
  },
})

const emits = defineEmits(['load'])

const loaded = ref(false)

const onLoad = () => {
  emits('load')
  loaded.value = true
}
</script>

<style scoped lang="scss">

.ui-external-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23A9B6BF"><g><path d="M19.5 4h-15A2.5 2.5 0 0 0 2 6.5v11A2.5 2.5 0 0 0 4.5 20h15a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 19.5 4Zm-15 2h15c.28 0 .5.22.5.5v8.09l-4.29-4.29a1 1 0 0 0-1.41 0l-4.29 4.29-2.29-2.29a1 1 0 0 0-1.41 0l-2.29 2.29V6.5c0-.28.22-.5.5-.5Zm15 12h-15a.5.5 0 0 1-.5-.5v-.09l3-3 2.29 2.29a1 1 0 0 0 1.41 0l4.29-4.29 5 5v.09a.5.5 0 0 1-.5.5Z"></path><circle cx="9.5" cy="9.5" r="2"></circle></g></svg>');
  background-color: var(--color-background);
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  user-select: none;

  &__loaded {
    background-image: none;
  }

  > img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>