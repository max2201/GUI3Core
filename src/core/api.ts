import { ofetch } from 'ofetch'
import type { IError } from '@/core/interface/Api'

export const useApi = async (method: string, options: any = {}) => {
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)
  const router = useRouter()

  const fetchUrl = import.meta.env.DEV
    ? `/handlers/IntegrationApi/${method}`
    : `${import.meta.env.VITE_API_URL}/handlers/IntegrationApi/JsonRpc.ashx`

  //  const fetchUrl = `${import.meta.env.VITE_API_URL}/handlers/IntegrationApi/JsonRpc.ashx`
  let error = null as IError | null

  const requestObject = {
    method: 'POST',
    headers: {},
    body: {
      ApiKey: user.value?.CurrentUserToken ? '' : import.meta.env.VITE_API_CLIENT,
      ApiVersion: '100',
      ModuleId: options.moduleId,
      Method: method,
      UserKey: user.value?.CurrentUserToken,
      Parameters: { ...(options.body || null) },
    },
  }

  const data: any = await ofetch(fetchUrl, requestObject)
    .then((res) => {
      if (res.Result) {
        return res.Result
      }

      if (res.Errors?.length) {
        const firstMessage = res.Errors[0]

        if (
          firstMessage.Code === -5 ||
          firstMessage.ExceptionMessage === 'пользователь не авторизован'
        ) {
          authStore.clear()

          if (router.currentRoute.value.path !== Routes.auth.index) {
            router.push(Routes.auth.index)
          }

          return
        }

        throw new Error(res.Errors, {
          cause: res.Errors,
        })
      }

      return {}
    })
    .catch((err) => {
      console.error(`❌ FETCH ${method}`)
      error = err.cause
    })

  return { error, data }
}

export const uploadFiles = (file, serverUrl, regKey, objectTypeAlias, objectId) => {}
