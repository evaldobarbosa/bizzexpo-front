import { ref, reactive } from 'vue'
import type { AxiosError } from 'axios'

interface ValidationErrors {
  [key: string]: string[]
}

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const form = reactive({ ...initialValues })
  const errors = ref<ValidationErrors>({})
  const loading = ref(false)
  const generalError = ref<string | null>(null)

  function reset() {
    Object.assign(form, initialValues)
    errors.value = {}
    generalError.value = null
  }

  function setErrors(newErrors: ValidationErrors) {
    errors.value = newErrors
  }

  function clearErrors() {
    errors.value = {}
    generalError.value = null
  }

  function getError(field: string): string | undefined {
    return errors.value[field]?.[0]
  }

  function hasError(field: string): boolean {
    return !!errors.value[field]?.length
  }

  async function submit<R>(
    submitFn: (data: T) => Promise<R>,
    options?: {
      onSuccess?: (result: R) => void
      onError?: (error: unknown) => void
    }
  ) {
    loading.value = true
    clearErrors()

    try {
      const result = await submitFn(form as T)
      options?.onSuccess?.(result)
      return result
    } catch (error) {
      const axiosError = error as AxiosError<{ errors?: ValidationErrors; message?: string }>

      if (axiosError.response?.status === 422 && axiosError.response.data.errors) {
        setErrors(axiosError.response.data.errors)
      } else if (axiosError.response?.data?.message) {
        generalError.value = axiosError.response.data.message
      } else {
        generalError.value = 'Ocorreu um erro inesperado'
      }

      options?.onError?.(error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    errors,
    loading,
    generalError,
    reset,
    setErrors,
    clearErrors,
    getError,
    hasError,
    submit,
  }
}
