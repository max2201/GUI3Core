import type { FreeModalArgs, FreeModalTarget } from '@/core/interface/FreeModal'

export const openFreeModal = (args: FreeModalArgs) => {
  EventBus.emit(GlobalEvents.OpenFreeModal, args)
}
