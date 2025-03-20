<template>
  <header class="header">
    <div class="header__wrapper">
      <div class="header__logo">
        <div class="header__logo-wrapper">
          <img src="@/assets/img/logo-alt.svg" alt="logo" />
        </div>
      </div>

      <div class="header__navi">
        <ul class="header__menu">
          <li>
            <a :href="SOCIAL_LINKS.phone.value" target="_blank">
              <SvgIcon :name="SOCIAL_LINKS.phone.icon" />
            </a>
          </li>
          <li>
            <a :href="SOCIAL_LINKS.telegram.value" target="_blank">
              <SvgIcon :name="SOCIAL_LINKS.telegram.icon" />
            </a>
          </li>
          <li>
            <a :href="SOCIAL_LINKS.whatsapp.value" target="_blank">
              <SvgIcon :name="SOCIAL_LINKS.whatsapp.icon" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { SOCIAL_LINKS } from '@/core/config'

const authStore = useAuthStore()
</script>

<style lang="scss" scoped>
.header {
  top: 0;
  left: 0;
  right: 0;
  background: var(--header-background);
  color: var(--color-font-invert);

  &._sidebar_opened {
    .header {
      &__logo {
        width: 200px;
      }
    }
  }
  &__wrapper {
    display: flex;
    align-items: center;
    padding: 15px 40px;
  }
  &__logo {
    position: relative;
    flex: 0 0 auto;
    margin-right: 20px;
    font-size: 0;
    img {
      max-width: 100%;
    }
  }
  &__navi {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  &__menu {
    margin-left: auto;
    display: flex;
    align-items: center;

    li {
      flex: 0 0 auto;
      &:not(:last-child) {
        margin-right: 10px;
      }
      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 50px;
        min-height: 50px;
        position: relative;
        padding: 5px;
        color: var(--color-font-invert);
        background: rgba(white, 0.15);
        transition: color 0.25s $ease;
        font-size: 0;
        .svg-icon {
          font-size: var(--font-size-24);
        }

        &:hover {
          color: var(--color-primary);
        }
      }
    }
  }
}
</style>
