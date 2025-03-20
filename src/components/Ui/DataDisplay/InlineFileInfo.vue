<template>
  <div class="inline-file-info">
    <SvgIcon :width="20" :height="20" name="text" class="file-type-icon" />
    <div class="inline-file-info__main">
      <div class="inline-file-info__label mr-1">
        <span class="inline-file-info__label__text">{{ label }}</span>
      </div>
      <SvgIcon :width="11" :height="11" name="open-here" class="c-gray" />
    </div>
    <SvgIcon :width="20" :height="20" name="printer" class="c-gray" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
}>()
</script>

<style scoped lang="scss">
.inline-file-info {
  display: grid;
  align-items: center;
  grid-template-columns: 20px 180px 20px;
  grid-template-rows: 20px;
  gap: 6px;
  width: 100%;
  height: 20px;
  overflow: hidden;
}

.inline-file-info__main {
  display: flex;
  align-items: center;
  cursor: pointer;
  max-width: 100%;
}

.inline-file-info__label {
  overflow: hidden;
}

.inline-file-info__label__text {
  display: inline-block;
  border-bottom: 1px dashed var(--color-font);
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}

.file-type-icon {
  color: var(--color-border);
  cursor: default;
}
</style>
