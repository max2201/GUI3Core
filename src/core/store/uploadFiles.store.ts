import { cloneDeep } from 'lodash'
import { apiSaveFiles } from '@/core/api/modules.api'
import { GetObjectDto } from '@/core/api/object.api'
import { sendFiles } from '@/core/api/files.api'
import type { FileFolder } from '@/core/interface/Configuration'
import type { ImageInfo } from '@/core/interface/Object'
import { DtoObjectViewType } from '@/core/constants/DtoObjectViewType'
import { getDocServerUrl } from '@/core/utils/getDocServerUrl'
import { BaseFilesFilters, FilesFilter, type FileFilterSettings } from '../constants/FilesFilter'

export const useUploadFilesStore = defineStore('uploadFilesStore', () => {
  const windowStore = useWindowStore()

  const regKey = ref(sessionStorage.getItem('regKey'))
  const objectTypeAlias = ref<string | null>(null)

  const localFiles = ref<ImageInfo[]>([])
  const loadFiles = ref([])
  const editFiles = ref(false)
  const isLoadingFiles = ref(false)

  const activeFolder = ref<FileFolder | null>(null)

  const filesFilters = ref<{ label: string; value: any }[]>([...BaseFilesFilters])

  const syncFiles = ref(false)
  const filesFolder = ref<Record<number, FileFolder[]>>({})

  const objectData = computed(() => windowStore.activeTab?.object?.rawData || null)
  const objectImages = computed(() => objectData.value?.Images?.Images || [])
  const baseObjectType = computed(() => objectData.value?.BaseObjectType || null)
  const baseObjectId = computed(() => objectData.value?.BaseObjectId || null)
  const availableFolders = computed(() =>
    baseObjectType.value ? filesFolder.value[baseObjectType.value] || [] : [],
  )

  const saveFiles = async () => {
    if (!baseObjectType.value || !baseObjectId.value) {
      return
    }

    const images = objectData.value?.Images

    if (!images) {
      return
    }

    images.Images = loadFiles.value.filter((item) => !item.delete)

    const { data, error } = await apiSaveFiles({
      BaseObjectType: baseObjectType.value,
      Images: images,
      ObjectId: baseObjectId.value,
    })

    if (data) {
      localFiles.value = data.Images
      syncFiles.value = false
      editFiles.value = false
    }
  }

  const getLocalFiles = async () => {
    if (!baseObjectType.value || !baseObjectId.value) {
      return
    }

    isLoadingFiles.value = true

    const { data } = await GetObjectDto({
      ObjectId: baseObjectId.value,
      BaseObjectType: baseObjectType.value,
      DtoViewType: DtoObjectViewType.PrimaryView,
    })

    localFiles.value = cloneDeep(data?.Images?.Images || [])
    objectTypeAlias.value = data?.Images?.ObjectType || null
    isLoadingFiles.value = false
  }

  const postFiles = async (file: File) => {
    return sendFiles({
      docServerUrl: getDocServerUrl(),
      regKey: regKey.value,
      objectTypeAlias: objectTypeAlias.value,
      baseObjectId: baseObjectId.value,
      file,
    })
      .then((response) => {
        const result = response.data?.data[0]

        if (!result) return

        if (activeFolder.value) {
          result.folder = activeFolder.value?.FolderCode
        }

        localFiles.value.push(result)
        return result
      })
      .catch((error) => {
        console.error(error.response)
      })
  }

  const activeFilter = ref<FileFilterSettings>(BaseFilesFilters[0])

  const setFileFolders = (folders: Record<number, FileFolder[]>) => {
    filesFolder.value = folders
  }

  const reset = () => {
    editFiles.value = false
    localFiles.value = []
    loadFiles.value = []
  }

  return {
    regKey,
    objectTypeAlias,
    baseObjectId,
    localFiles,
    isLoadingFiles,
    getLocalFiles,
    filesFilters,
    activeFilter,
    editFiles,
    postFiles,
    activeFolder,
    filesFolder,
    availableFolders,
    saveFiles,
    syncFiles,
    loadFiles,
    setFileFolders,
    reset,
  }
})
