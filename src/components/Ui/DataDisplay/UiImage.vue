<template>
  <img :src="srcPath" :srcset="have2x ? srcSet : undefined" alt="" v-bind="$attrs" />
</template>

<script setup lang="ts">
const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  folder: {
    type: String,
    default: '/images/',
  },
  have2x: {
    type: Boolean,
    default: false,
  },
})

const srcPath = computed(() => {
  return `${props.folder}${props.src}`
})
const srcSet = computed(() => {
  const { path, ext } = source2x.value
  return `${props.folder}${path} 2x`
})
const source2x = computed(() => {
  const lastDot = props.src.lastIndexOf('.')
  const path = props.src.substring(0, lastDot)
  const ext = props.src.substring(lastDot + 1, props.src.length)

  return {
    path: `${path}@2x.${ext}`,
    ext,
  }
})
</script>
