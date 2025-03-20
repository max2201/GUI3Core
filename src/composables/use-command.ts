import { GetObjectDto } from '@/core/api/object.api'

type IObjectCommand = any

export interface CommandExecutionOptions {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  customHandler?: (command: IObjectCommand) => Promise<any>
}

export const useCommand = () => {
  const executeCommand = async (
    command: IObjectCommand | null,
    options: CommandExecutionOptions = {},
  ) => {
    if (!command) return

    try {
      // Если предоставлен кастомный обработчик, используем его
      if (options.customHandler) {
        return await options.customHandler(command)
      }

      // Стандартная обработка команды
      const result = await GetObjectDto({
        ModuleId: command.ModuleId,
        ObjectId: command.BaseObjectId,
        BaseObjectType: command.BaseObjectType,
        DtoViewType: command.DtoViewType,
        CustomViewName: command.CustomView || undefined,
      })

      if (!result?.data) {
        throw new Error('Не удалось получить данные объекта')
      }

      options.onSuccess?.(result.data)
      return result.data
    } catch (error) {
      options.onError?.(error) || console.error('Ошибка при выполнении команды:', error)
      throw error
    }
  }

  return {
    executeCommand,
  }
}
