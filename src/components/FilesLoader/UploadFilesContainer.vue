<template>
  <div class="uploadFilesContainer">
    <UploadFilesHeader />
    <UploadFiles />
    <UploadFilesFooter />
  </div>
</template>

<script setup lang="ts">
import { useUploadFilesStore } from '@/core/store/uploadFiles.store'

const windowStore = useWindowStore()
const uploadFilesStore = useUploadFilesStore()

watch(
  () => windowStore.activeTabId,
  () => {
    uploadFilesStore.getLocalFiles()
  }
)

onMounted(() => {
  uploadFilesStore.getLocalFiles()
})
</script>
