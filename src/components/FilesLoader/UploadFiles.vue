<template>
  <div class="uploadFiles-wrapper">
    <UiLoader v-if="isLoadingFiles" :loading="isLoadingFiles" theme="page" />

    <div class="uploadFiles">
      <div v-if="activeFolder" class="back" @click="backToHome">
        <SvgIcon name="corner-up-left" />
        Вернуться
      </div>

      <template v-if="!activeFolder && activeFilter.value === FilesFilter.Group">
        <div v-for="(folder, index) in availableFolders" :key="index" class="folder-wrapper">
          <div class="folder" @click="onClickFolder(folder)">
            <div class="folder__icon">
              <div v-if="isFolderEmpty(folder)" class="folder__icon-empty">
                <SvgIcon name="folder-empty" />
              </div>

              <div class="folder__icon-notEmpty" v-else>
                <span class="count">{{ countFiles(folder).length }}</span>
                <SvgIcon name="folder" />
              </div>
            </div>

            <p>{{ folder.Title }}</p>
          </div>
        </div>
      </template>

      <div v-for="(imageInfo, index) in showedFiles" :key="index" class="images">
        <div class="delete-wrapper" v-if="imageInfo.delete">
          <span class="delete-title">Будет удален</span>
        </div>

        <UiCheckbox1
            v-if="uploadFilesStore.editFiles"
            v-model="imageInfo.delete"
            :error="imageInfo.delete"
            :class="imageInfo.delete ? 'check-red' : ''"
        />

        <a :href="imageInfo.url" :class="imageInfo.delete ? 'delete' : ''" target="_blank">
          <img
            v-if="isImage(imageInfo.MimeType)"
            :src="imageInfo.surl"
            :title="imageInfo.originalName"
            :alt="imageInfo.originalName"
          />

          <span
            v-else
            :title="imageInfo.originalName.length > 26 ? imageInfo.originalName : ''"
            class="other-files"
          >
            <SvgIcon name="file" />
            <span>{{
              imageInfo.originalName.length > 26
                ? `${imageInfo.originalName.slice(0, 26).trim()}...`
                : imageInfo.originalName
            }}</span>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useUploadFilesStore } from '@/core/store/uploadFiles.store'
import { cloneDeep } from 'lodash'
import type { FileFolder } from '@/core/interface/Configuration'
import {
  BaseFilesFilters,
  FilesFilter,
  type FileFilterSettings,
} from '@/core/constants/FilesFilter'

const isImage = (mimeType: string) => {
  return ['image/jpeg', 'image/png'].includes(mimeType)
}

const uploadFilesStore = useUploadFilesStore()
const windowStore = useWindowStore()
const { localFiles, activeFolder, availableFolders, activeFilter, isLoadingFiles } =
  storeToRefs(uploadFilesStore)

uploadFilesStore.reset()

watch(
  () => windowStore.isOpened,
  (isOpened) => {
    if (isOpened) {
      uploadFilesStore.getLocalFiles()
    }
  }
)

watch(
  () => windowStore.activeTabId,
  () => {
    uploadFilesStore.reset()
  }
)

const availableFoldersCodes = computed(() =>
  availableFolders.value.map((folder) => folder.FolderCode)
)

const showedFiles = computed(() => {
  if (activeFolder.value) {
    return localFiles.value.filter((file) => file.folder === activeFolder.value?.FolderCode)
  }

  if (
    activeFilter.value.value === FilesFilter.Group ||
    activeFilter.value.value === FilesFilter.WithoutFolder
  ) {
    return localFiles.value.filter((file) => !availableFoldersCodes.value.includes(file.folder))
  }

  return localFiles.value
})

const countFiles = (folder: FileFolder) => {
  return cloneDeep(localFiles.value).filter((item) => item.folder === folder.FolderCode)
}

const isFolderEmpty = (folder) => {
  const isEmpty = countFiles(folder)
  return !isEmpty.length
}

const onClickFolder = (folder) => {
  uploadFilesStore.activeFilter = {
    value: folder.FolderCode,
    label: folder.Title,
  }

  uploadFilesStore.activeFolder = folder
}

const backToHome = () => {
  uploadFilesStore.activeFilter = BaseFilesFilters[0]
  uploadFilesStore.activeFolder = null
}

const hideFolderFile = (array) => {
  return array.filter((item) => !item.folder)
}

const setFilter = (filter: FileFilterSettings) => {
  if (filter.value) return

  if (filter.value === FilesFilter.Group) {
    localFiles.value = hideFolderFile(cloneDeep(uploadFilesStore.localFiles)).sort((a, b) => {
      // Перемещаем объекты без папок в конец массива
      if (a.folder === '' && b.folder !== '') {
        return 1
      } else if (a.folder !== '' && b.folder === '') {
        return -1
      }

      // Если у объектов одинаковые папки,
      // сортируем их по порядку появления в массиве
      if (a.folder === b.folder) {
        return (
          cloneDeep(uploadFilesStore.localFiles).indexOf(a) -
          cloneDeep(uploadFilesStore.localFiles).indexOf(b)
        )
      }

      // Сортируем по алфавиту по названию папки
      return a.folder.localeCompare(b.folder)
    })

    return
  }

  if (filter.value === FilesFilter.Ungroup) {
    localFiles.value = hideFolderFile(cloneDeep(uploadFilesStore.localFiles))
    return
  }
}

watch(
  () => uploadFilesStore.activeFilter,
  (filter) => {
    setFilter(filter)
  }
)

watch(
  () => uploadFilesStore.localFiles,
  () => {
    setFilter(uploadFilesStore.activeFilter)
  }
)

watch(
  () => uploadFilesStore.syncFiles,
  (syncFiles) => {
    if (!syncFiles) return

    uploadFilesStore.loadFiles = [
      ...new Set(localFiles.value.concat(uploadFilesStore.localFiles)),
    ].reduce((acc, curr) => {
      const index = acc.findIndex((item) => item.url === curr.url)

      if (index === -1) {
        acc.push(curr)
      }

      return acc
    }, [])
  },
  { immediate: true }
)
</script>
