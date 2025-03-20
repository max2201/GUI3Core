<template>
  <div class="profile">
    <div class="row">
      <div class="col">
        <div class="profile__image">
          <!-- <img src="" alt="profile" /> -->
        </div>
      </div>

      <div v-for="block in blocks" :key="block.Code" class="col col-auto">
        <DisplayGroup
          v-for="field in block.Fields"
          :key="field.Title"
          :label="field.Title"
          :value="field.Value"
          primary
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IObjectDto } from '@/core/interface/Object'
import type { LiteViewBlockGroup } from '@/core/interface/Object'

const props = defineProps<{
  object: IObjectDto
}>()

const blocks = computed<LiteViewBlockGroup[]>(() => props.object.PrimaryBlockGroups || [])
</script>

<style lang="scss" scoped>
.profile {
  padding: 12px 0;
  &__image {
    position: relative;
    width: 240px;
    z-index: 1;
    background: #d9d9d9;
    border-radius: 5px;
    padding-bottom: 100%;
    overflow: hidden;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }
}
</style>
