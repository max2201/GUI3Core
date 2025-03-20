import { sendFiles } from '@/core/api/files.api'
import { useUploadFilesStore } from '@/core/store/uploadFiles.store'
import { getDocServerUrl } from '@/core/utils/getDocServerUrl'

export const usePostFiles = () => {
  const uploadFilesStore = useUploadFilesStore()
  const { regKey, objectTypeAlias, baseObjectId } = storeToRefs(uploadFilesStore)

  const postFiles = (file: File) => {
    return sendFiles({
      docServerUrl: getDocServerUrl(),
      regKey: regKey.value,
      objectTypeAlias: objectTypeAlias.value,
      baseObjectId: baseObjectId.value,
      file,
    })
      .then((response) => {
        return response.data?.data[0]
      })
      .catch((error) => {
        console.error(error.response)
      })
  }

  return { postFiles }
}
