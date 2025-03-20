<template>
  <div class="dashboard">
    <div class="container">
      <div class="row">
        <div class="col col-6 col-md-12">
          <div class="cell" style="height: 200px; background: var(--color-border)"></div>
        </div>
        <div class="col col-6 col-md-12">
          <div class="cell" style="height: 200px; background: var(--color-border)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { RouteMeta } from '@/core/config'

useHead({
  title: RouteMeta.home.title,
  meta: RouteMeta.home.meta,
})

const authStore = useAuthStore()

</script>

<style lang="scss" scoped>
.dashboard {
  margin: 24px 0;
}

.cell {
  margin: 20px 0;
}
</style>
