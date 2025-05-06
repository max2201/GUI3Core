import { CodeConfirmModal, ConfirmMerge, ExistLockModal } from '@/core/constants/ModalsNames'
export const useSharedModalsStore = defineStore('sharedModals', {
  state: () => {
    return {
      mobileMenuOffset: 0,
      modal: [] as string[],
      modalParams: null as {
        [key: string]: any
      } | null,
    }
  },
  actions: {
    setModal({
      name,
      params,
      keepPrevious = false,
    }: {
      name: string
      params?: any
      keepPrevious?: boolean
    }) {
      if (keepPrevious) {
        this.modal.push(name)
      } else {
        this.modal = [name]
      }
      if (params) {
        this.modalParams = params
      }
    },

    closeModal(reason?: string) {
      if (!reason && this.modalParams?.onCancel) {
        this.modalParams.onCancel()
      }

      this.modal = this.modal.slice(0, -1)
      this.modalParams = null
    },

    closeAllModals() {
      this.modal = []
      this.modalParams = null
    },

    confirmByCode({ keepPrevious }: { keepPrevious?: boolean }): Promise<boolean> {
      return new Promise((resolve) => {
        this.setModal({
          name: CodeConfirmModal,
          params: {
            keepPrevious: true,
            onCodeVerified: () => {
              resolve(true)
              this.closeModal('success')
            },
            onCancel: () => {
              resolve(false)
            },
          },
        })
      })
    },
    // ======== Exist Lock Modal ========
    showExistLockModal({
      lockedObjectName,
      lockDateTime,
      userName,
      isActions,
      keepPrevious,
    }: {
      lockedObjectName: string
      lockDateTime: string
      userName: string | number
      isActions?: boolean
      keepPrevious?: boolean
    }): Promise<boolean> {
      return new Promise((resolve) => {
        this.setModal({
          name: ExistLockModal,
          params: {
            lockedObjectName: lockedObjectName,
            lockDateTime: lockDateTime,
            userName: userName,
            isActions: isActions,
            keepPrevious: keepPrevious,
            onForceUnlock: () => {
              resolve(true)
              // this.closeModal('force-unlock')
            },
            onCancel: () => {
              resolve(false)
              this.closeModal('force-unlock')
            },
          },
        })
      })
    },
    // ======== Exist Lock Modal ========
    showActionModal({
      name,
      params,
      isActions = true,
      keepPrevious = false,
    }: {
      name: string
      params?: any
      keepPrevious?: boolean
      isActions?: true
    }): Promise<boolean> {
      return new Promise((resolve) => {
        this.setModal({
          name: name,
          params: {
            ...params,
            isActions: isActions,
            onSave: (data: any) => {
              resolve(data || true)
              this.closeModal('force-unlock')
            },
            onCancel: () => {
              resolve(false)
              this.closeModal('cancel')
            },
          },
        })
      })
    },
    // ======== Confirm Merge Modal ========
    showConfirmMergeModal(data): Promise<boolean> {
      return new Promise((resolve) => {
        this.setModal({
          name: ConfirmMerge,
          params: {
            data: data,
            isActions: true,
            onSave: (data) => {
              resolve(data)
              this.closeModal('success')
            },
            onCancel: () => {
              resolve(false)
              this.closeModal('cancel')
            },
          },
        })
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSharedModalsStore, import.meta.hot))
}
