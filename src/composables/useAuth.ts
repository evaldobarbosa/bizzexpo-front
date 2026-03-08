import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)

  async function login(email: string, password: string) {
    await authStore.login(email, password)
    router.push('/dashboard')
  }

  async function register(data: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) {
    await authStore.register(data)
    router.push('/organizador/cadastro')
  }

  async function logout() {
    await authStore.logout()
    router.push('/login')
  }

  async function checkAuth() {
    if (authStore.token && !authStore.user) {
      await authStore.fetchUser()
    }
    return authStore.isAuthenticated
  }

  return {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    checkAuth,
  }
}
