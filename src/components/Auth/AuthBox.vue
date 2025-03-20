<template>
  <div class="auth">
    <div class="auth__box">
      <div class="auth__wrapper">
        <div class="auth__head">
          <h2 class="auth__title h1-title">{{ title }}</h2>
          <p class="auth__description text-m" :class="[error && 'c-red']">
            <template v-if="error">
              {{ description[1] }}
            </template>
            <template v-else> {{ description[0] }}</template>
          </p>
        </div>

        <div class="auth__form">
          <div class="auth__form-fields">
            <slot name="fields" />
          </div>
          <div class="auth__form-actions">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </div>

    <UiButton1 class="auth__help-link" href="" variant="text" theme="transparent"
      >Перейти на сайт XLombard
    </UiButton1>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ error: boolean; title: string; description: string[] }>()
</script>

<style lang="scss" scoped>
.auth {
  max-width: 540px;
  width: 100%;
  margin: 24px auto;
  display: flex;
  flex-direction: column;

  &__head {
    text-align: center;
  }

  &__box {
    padding: 92px 40px 106px;
    background: #ffffff;
    box-shadow: var(--box-shadow-extra-large);
    border-radius: 20px;
  }

  &__wrapper {
    max-width: 340px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__description {
    margin-top: 8px;
    min-height: 42px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 40px;
    &-fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    &-actions{
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 28px;
      align-items: center;
    }
  }

  &__help-link {
    align-self: center;
    display: inline-flex;
    margin-top: 84px;
  }
}

@include r($md) {
  .auth {
    margin-top: 0;
    max-width: 100%;

    &__box {
      padding: 64px 24px 80px;
    }

    &__help-link {
      margin-top: 42px;
    }
  }
}
</style>
