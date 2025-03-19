import axios from 'axios'
import type { IApiResponse } from '@/core/interface/Api'
import type { IFileUploadResult } from '@/core/interface/Files'

interface IPostFilesPayload {
  docServerUrl: string
  regKey: string
  objectTypeAlias: string
  baseObjectId: number
  file: File
}

export const sendFiles = (
  params: IPostFilesPayload
): Promise<IApiResponse<{ data: IFileUploadResult[] }>> => {
  const { docServerUrl, regKey, objectTypeAlias, baseObjectId, file } = params
  const formData = new FormData()
  formData.append('file', file, `${file.name}.${file.type.split('/')[1]}`)

  const fetchUrl = `${docServerUrl}?operation=uploadV2&clientId=${regKey}&objectType=${objectTypeAlias}&objectId=${baseObjectId}`

  return axios.post(fetchUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
