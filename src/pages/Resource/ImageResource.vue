<template>
  <div class="image-resource-page">
    <img :src="route.query.url">
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { RouteMeta } from '@/core/config'

const route = useRoute()

useHead({
  title: RouteMeta.resource.image.title + ': ' + route.query.name,
  meta: RouteMeta.auth.index.meta,
})
</script>

<style lang="scss" scoped>
.image-resource-page {
  
}
</style>
