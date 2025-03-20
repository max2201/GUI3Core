<template>
  <span :title="name.length > 26 ? name : ''" class="file-card" @dblclick="onDblClick">
    <SvgIcon name="file" />

    <span>{{ name.length > 26 ? `${name.slice(0, 26).trim()}...` : name }}</span>
    <span v-if="extension" class="file-card__extension">{{ extension }}</span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  url?: string
  extension?: string
}>()

const onDblClick = () => {
  window.open(props.url, '_blank')
}
</script>

<style lang="scss" scoped>
.file-card {
  display: grid;
  padding: 30px 12px 12px;
  grid-template-columns: auto;
  grid-template-rows: 48px 35px;
  gap: 3px;
  align-items: center;
  justify-content: center;
  height: 134px;
  width: 134px;
  border-radius: 5px;
  background: var(--color-background);
  cursor: pointer;
  width: 100%;
  font-size: var(--font-size-14);
  font-style: normal;
  font-weight: var(--font-weight-400);
  line-height: 120%;
  overflow: hidden;
  color: var(--color-font);
  text-overflow: ellipsis;
  position: relative;
  user-select: none;

  &__extension {
    position: absolute;
    top: 50px;
    left: 0px;
    font-size: var(--font-size-16);
    font-weight: var(--font-weight-600);
  }

  svg {
    justify-self: center;
    height: 48px;
    font-size: 48px;
    margin-bottom: 6px;
  }

  span {
    width: 110px;
    height: 35px;
    overflow: hidden;
    text-align: center;
    word-break: break-word;
  }
}
</style>
