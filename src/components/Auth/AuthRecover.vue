<template>
  <AuthBox
    :error="apiError"
    title="Восстановить пароль"
    :description="[
      'Восстановление доступа в XLombard',
      'Ошибка. Пользователь не найден. Попробуйте еще раз.',
    ]"
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
        @update:model-value="setFieldValue('login', $event)"
        :error="!!errors.login"
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
        Восстановить
      </UiButton1>
      <UiButton1 class="auth__recover" type="text" to="/auth" size="extra-large" variant="text">
        Войти
      </UiButton1>
    </template>
  </AuthBox>
</template>

<script setup lang="ts">
import { AuthBox } from '@c/Auth'
import { useToast } from 'vue-toastification/dist/index.mjs'

const authStore = useAuthStore()

const router = useRouter()
const toast = useToast()

const loading = ref(false)

const { errors, setErrors, setFieldValue, validate } = useForm({
  initialValues: { login: '' },
})

const { value: login, meta: metaLogin } = useField<string>('login', (v) => {
  return clearString(v) ? true : 'Введите логин'
})

const nextDisabled = computed(() => {
  return !metaLogin.dirty || Object.keys(errors.value).length !== 0
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
  const { valid, errors } = await validate()
  if (!valid) return

  loading.value = true
  apiError.value = false
  setErrors({})

  const { data, error } = await authStore.recover({ Login: login.value })

  if (data?.UserProfile) {
    router.push('/')
  }

  if (error) {
    apiError.value = true
    setErrors({
      login: 'ошибка апи',
    })
  }

  loading.value = false
}
</script>
