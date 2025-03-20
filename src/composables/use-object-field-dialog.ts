import { unref, toRaw } from 'vue'

export interface IFieldDialog {
  fieldType: string
  fieldName: string
  params: any
}

const ObjectsFieldsOpenedDialogs: Record<string, IFieldDialog> = {}

export const useObjectFieldDialog = (objectType: number, objectId: string | number) => {
  const objectKey = `${objectType}-${objectId}`
  const saveOpenedDialog = (data: IFieldDialog) => {
    ObjectsFieldsOpenedDialogs[objectKey] = toRaw(unref(data))
  }

  const closeOpenedDialog = () => {
    delete ObjectsFieldsOpenedDialogs[objectKey]
  }

  const getOpenedDialog = () => {
    return ObjectsFieldsOpenedDialogs[objectKey]
  }

  return {
    saveOpenedDialog,
    closeOpenedDialog,
    getOpenedDialog,
  }
}

type voidCallback = (args?: any[]) => void

export const useFieldInputEvents = (
  fieldName: string,
  fieldType: string,
  fieldAction: voidCallback
) => {
  const onEvent = (data: IFieldDialog) => {
    if (data.fieldName !== fieldName || data.fieldType !== fieldType) return

    fieldAction(data.params)
  }

  onMounted(() => {
    EventBus.on(GlobalEvents.ShowObjectFieldDialog, onEvent)
  })

  onBeforeUnmount(() => {
    EventBus.off(GlobalEvents.ShowObjectFieldDialog, onEvent)
  })
}
