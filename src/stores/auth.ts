import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.is_admin ?? false)

  async function login(email: string, password: string) {
    const response = await api.post('/login', { email, password })
    token.value = response.data.token
    user.value = response.data.data
    localStorage.setItem('token', response.data.token)
  }

  async function logout() {
    try {
      await api.post('/logout')
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    }
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      const response = await api.get('/user')
      user.value = response.data.data
    } catch {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
    }
  }

  async function register(data: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) {
    const response = await api.post('/register', data)
    token.value = response.data.token
    user.value = response.data.data
    localStorage.setItem('token', response.data.token)
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    fetchUser,
    register,
  }
})
