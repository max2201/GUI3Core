<template>
  <div class="uploadFilesFooter">
    <div v-if="uploadFilesStore.editFiles" class="uploadFilesFooterEdit">
      <input
        ref="fileInput"
        id="input__file"
        name="file"
        type="file"
        class="input input__file"
        multiple
        @change="handleFileChange"
      />
      <UiButton1 variant="outline" @click="triggerFileInput">Добавить файл</UiButton1>
      <UiButton1 @click="save">Сохранить изменения</UiButton1>
      <UiButton1 theme="secondary" @click="cancel">Отменить</UiButton1>
    </div>
    <div class="uploadFilesFooterStatic">
      <UiButton1 @click="toggleEdit">Изменить</UiButton1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { delay } from 'lodash'
import { useUploadFilesStore } from '@/core/store/uploadFiles.store'

const uploadFilesStore = useUploadFilesStore()

const fileInput = ref(null)
const triggerFileInput = () => {
  fileInput.value.click()
}
const toggleEdit = () => {
  uploadFilesStore.editFiles = !uploadFilesStore.editFiles
}

const save = () => {
  uploadFilesStore.syncFiles = true

  delay(() => {
    uploadFilesStore.saveFiles()
  }, 500)
}

const cancel = () => {
  uploadFilesStore.editFiles = false
}

const handleFileChange = (event) => {
  const selectedFiles = event.target.files

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i]
    uploadFilesStore.postFiles(file)
  }
}
</script>
