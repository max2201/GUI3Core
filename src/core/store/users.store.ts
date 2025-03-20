import { GetUsers } from '@/core/api/users.api'
import type { UserSimple } from '@/core/interface/User'

export const useUsersStore = defineStore('users', () => {
  const users = ref<UserSimple[]>([])
  const usersByFIO = computed(() =>
    users.value.reduce((acc, user) => {
      acc[user.FIO] = user
      return acc
    })
  )

  const isLoadingUsers = ref(false)

  const loadUsers = () => {
    isLoadingUsers.value = true

    return GetUsers({ ids: [], searchIds: [] })
      .then((result) => {
        if (Array.isArray(result.data)) {
          users.value = result.data
        }
      })
      .finally(() => {
        isLoadingUsers.value = false
      })
  }

  return {
    users,
    usersByFIO,
    isLoadingUsers,
    loadUsers,
  }
})
