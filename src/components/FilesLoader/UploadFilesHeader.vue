<template>
  <div class="uploadFilesHeader">
    <div class="uploadFilesHeader-title">
      <SvgIcon name="iconImage" />
      Фотографии

      <div v-if="uploadFilesStore.activeFolder" class="breadcrumbs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M14 16L18 12L14 8"
            stroke="#8990A2"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 12L18 12"
            stroke="#8990A2"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <span>{{ uploadFilesStore.activeFolder.Title }}</span>
      </div>
    </div>

    <div class="uploadFilesHeader__actions">
      <div class="uploadFilesHeader__actions-filter">
        Выводить

        <UiSelect1
            :additional-class="['uploadFilesHeader__actions-select']"
            v-model="uploadFilesStore.activeFilter"
            :options="uploadFilesStore.filesFilters"
        />
      </div>

      <div class="uploadFilesHeader__actions-edit">
        <UiButton1 size="large" @click="toggleEdit()">
          <SvgIcon v-if="!uploadFilesStore.editFiles" name="pencil" />
          <SvgIcon v-else name="close" />
        </UiButton1>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUploadFilesStore } from '@/core/store/uploadFiles.store'

const uploadFilesStore = useUploadFilesStore()

const toggleEdit = () => {
  uploadFilesStore.editFiles = !uploadFilesStore.editFiles
}
</script>
