<template>
  <div class="message-content">
    <template v-if="message.type === MessageType.ImageFileLink">
      <UiExternalImage
        v-for="(obj, index) in contentObject"
        :key="index"
        :src="obj.Url"
        width="134px"
        height="134px"
        class="message-content__img"
        @dblclick="onDoubleClickImg(obj)"
      />
    </template>

    <template v-else-if="message.type === MessageType.VideoFileLink">
      <video
        v-for="(obj, index) in contentObject"
        width="320"
        height="240"
        controls
        :key="index"
        class="message-content__video"
      >
        <source :src="obj.Url" />
      </video>
    </template>

    <template v-else-if="message.type === MessageType.AudioFileLink">
      <audio
        v-for="(obj, index) in contentObject"
        controls
        :key="index"
        :src="obj.Url"
        class="message-content__video"
      ></audio>
    </template>

    <template v-else-if="message.type === MessageType.DocumentFileLink">
      <FileCard
        v-for="(obj, index) in contentObject"
        :key="index"
        :name="getFileNameFromUrl(obj.Url) || ''"
        :url="obj.Url"
        :extension="getFileExtensionFromUrl(obj.Url)"
      />
    </template>

    <span v-else>{{ message.text }}</span>
    <span v-if="message.comment" class="message-content__comment">{{ message.comment }}</span>
  </div>
</template>

<script setup lang="ts">
import { type MessageTextContent, MessageType } from '@/core/interface/MessageDTO'
import type { IChatMessage } from '@/core/interface/Chat'
import { Routes, RouteNames } from '@/core/config'
import { useOpenExternalImage } from '@/composables/use-open-external-image'

const props = defineProps<{
  message: IChatMessage
}>()

const contentObject = computed<MessageTextContent[]>(() => {
  return props.message.parsedJsonText || []
})

const { openExternalImage } = useOpenExternalImage()
const onDoubleClickImg = (Obj: MessageTextContent) => {
  openExternalImage({
    url: Obj.Url,
    fileName: Obj.OriginalName || Obj.Url,
  })
}

const filenameTest = new RegExp('[a-z0-9\s]*\.[a-z0-9]*$')

const getFileNameFromUrl = (url: string) => {
  const indexOfFilename = url.lastIndexOf('filename=')

  if (indexOfFilename !== -1) {
    return url.slice(indexOfFilename + 9)
  }

  const foundedNameIndex = url.search(filenameTest)

  return foundedNameIndex === -1 ? url : url.slice(foundedNameIndex)
}

const getFileExtensionFromUrl = (url: string) => {
  const filename = getFileNameFromUrl(url)
  const extension = filename.split('.')[1]

  return extension && extension.length < 5 ? extension : ''
}
</script>

<style scoped lang="scss">
.message-content {
  display: flex;
  flex-direction: column;

  &__img {
    width: 134px;
    height: 134px;
    border-radius: 5px;
    object-fit: contain;
    cursor: pointer;
  }

  &__comment {
    display: block;
    padding-top: 10px;
  }
}
</style>
