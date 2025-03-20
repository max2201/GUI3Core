<template>
  <AuthBox
    :error="apiError"
    :description="[
      'Авторизуйтесь для работы в XLombard',
      'Вход не выполнен. Неверно введены логин или пароль. Попробуйте еще раз.',
    ]"
    title="Добро пожаловать"
  >
    <template #fields>
      <UiInput1
        clearable
        name="login"
        size="large"
        type="text"
        label="Логин или электронная почта"
        placeholder="Логин"
        :model-value="login"
        :error="!!errors.login"
        @update:model-value="setFieldValue('login', $event)"
        @keyup="key_event"
      />

      <UiInput1
        clearable
        name="password"
        size="large"
        type="password"
        label="Пароль"
        placeholder="Пароль"
        :model-value="password"
        :error="!!errors.password"
        @update:model-value="setFieldValue('password', $event)"
        @keyup="key_event"
      />
    </template>
    <template #actions>
      <UiButton1
        full-width
        :disabled="nextDisabled"
        :loading="loading"
        size="extra-large"
        @click="next"
      >
        Продолжить
      </UiButton1>

      <UiButton1 class="auth__recover" to="/auth/recover" size="extra-large" variant="text">
        Восстановить пароль
      </UiButton1>
    </template>
  </AuthBox>
</template>

<script setup lang="ts">
import { AuthBox } from '@c/Auth'
import { DashboardModuleId } from '@/core/constants/DashboardModuleId'

const authStore = useAuthStore()
const windowStore = useWindowStore()
const router = useRouter()
const loading = ref(false)

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: { login: '', password: '' },
})

const { value: login, meta: metaLogin } = useField<string>('login', (v) => {
  return clearString(v) ? true : 'Введите логин'
})

const { value: password, meta: metaPassword } = useField<string>('password', (v) => {
  return clearString(v).length >= 3 ? true : 'Введите пароль'
})

const nextDisabled = computed(() => {
  return Object.keys(errors.value).length !== 0
})

const key_event = (e: KeyboardEvent) => {
  if (e.keyCode === 13) {
    e.preventDefault()
    e.stopPropagation()

    next()
  }
}

const apiError = ref(false)
const next = async () => {
  const { valid } = await validate()
  if (!valid) return

  loading.value = true
  apiError.value = false

  const { data, error } = await authStore.login({ Login: login.value, Password: password.value })

  if (error) {
    apiError.value = true
    loading.value = false
  }

  const dashboardModule = data?.UserProfile.AvailableModules.find(
    (mod) => mod.Id === DashboardModuleId,
  )

  if (dashboardModule) {
    windowStore.clearTabs()
    router.push(`/desktop/${dashboardModule.Id}`)
  }

  loading.value = false
}
</script>
