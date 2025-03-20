<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-page__wrapper">
        <div class="row">
          <div class="col col-6 col-md-12">
            <AuthRecover />
          </div>

          <div class="col col-6 col-md-12">
            <AuthNotification />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { AuthRecover, AuthNotification } from '@/components/Auth'
import { RouteMeta } from '@/core/config'

useHead({
  title: RouteMeta.auth.recover.title,
  meta: RouteMeta.auth.recover.meta,
})
</script>

<style lang="scss" scoped>
.auth-page {
  height: 100%;
  background: linear-gradient(90deg, #e9eafa 10.84%, rgba(255, 255, 255, 0) 100.74%);
  padding: 80px 0;

  @include r($md) {
    padding: 40px 0;
  }
}
</style>
