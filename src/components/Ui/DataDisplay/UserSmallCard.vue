<template>
  <div class="user-small-card-component">
    <div class="user-small-card-component__icon">
      <SvgIcon name="user" />
    </div>

    <span class="user-small-card-component__name">{{ fullname }}</span>
    <div v-if="showProfileLink" class="user-small-card-component__link" @click="onClickArrow">
      <SvgIcon is-link name="arrow-circle-right" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  fullname: {
    type: String,
    defualt: 'Неизвестное имя',
  },
  showProfileLink: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits('click-open-client')

const onClickArrow = (e: Event) => {
  emits('click-open-client', e)
}
</script>

<style lang="scss">
.user-small-card-component {
  display: grid;
  height: 24px;
  grid-template-rows: 24px;
  grid-template-columns: 24px auto auto;
  align-items: center;
  gap: 6px;

  &__icon {
    height: 24px;
    color: var(--color-primary-hover);

    > svg {
      width: 24px !important;
      height: 24px !important;
    }
  }

  &__name {
    padding-right: 10px;
    @include text-overflow();
  }

  &__link {
    height: 24px;
    color: var(--color-gray);

    > svg {
      width: 24px !important;
      height: 24px !important;
    }
  }
}
</style>
