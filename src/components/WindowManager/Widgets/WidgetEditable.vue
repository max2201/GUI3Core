<template>
  <div class="editable">
    <div class="editable__body">
      <span class="w-label">Краткая характеристика</span>
      <div class="w-value" :contenteditable="isEditing">
        Клиент просит, чтобы ему клали бутылки с водой в машину
      </div>
    </div>
    <div class="editable__action" :class="[isEditing && '_active']" @click="isEditing = !isEditing">
      <SvgIcon name="pencil" />
    </div>
  </div>
</template>

<script setup lang="ts">
const isEditing = ref(false)
</script>

<style lang="scss" scoped>
// edition
.editable {
  display: flex;
  &__body {
    flex: 1 1 auto;
    padding-right: 20px;
  }
  &__label {
    font-size: var(--font-size-standart);
    color: var(--color-gray);
  }
  &__value {
    margin-top: 2px;
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-14);
    line-height: 1.2;
  }
  &__action {
    flex: 0 0 auto;
    margin-left: auto;
    padding: 6px;
    cursor: pointer;
    color: var(--color-gray);
    transition: color 0.25s $ease;
    .svg-icon {
      font-size: var(--font-size-24);
    }
    &:hover,
    &._active {
      color: var(--color-primary);
    }
  }
}
</style>
