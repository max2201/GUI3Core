<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-page__wrapper">
        <div class="row">
          <div class="col col-6 col-md-12">
            <div class="h2-title">Страница не найдена</div>
            <UiButton to="/">На главную</UiButton>
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
import { AuthLogin, AuthNotification } from '@/components/Auth'
import { RouteMeta } from '@/core/config'

useHead({
  title: RouteMeta.auth.index.title,
  meta: RouteMeta.auth.index.meta,
})
</script>

<style lang="scss" scoped>
.auth-page {
  height: 100%;
  background: linear-gradient(90deg, #e9eafa 10.84%, rgba(255, 255, 255, 0) 100.74%);
  padding: 80px 0 40px;

  .container {
    max-width: 1550px;
  }
  @include r($md) {
    padding: 40px 0;
  }
}
</style>
