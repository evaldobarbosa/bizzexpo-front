import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { User, OrganizadorBusca } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  // Estado de impersonation
  const adminToken = ref<string | null>(localStorage.getItem('admin_token'))
  const adminUser = ref<User | null>(null)
  const impersonatedOrganizador = ref<OrganizadorBusca | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.is_admin ?? false)
  const isImpersonating = computed(() => !!adminToken.value && !!impersonatedOrganizador.value)

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

  // Busca organizadores para impersonation
  async function searchOrganizadores(termo: string): Promise<OrganizadorBusca[]> {
    const response = await api.get('/admin/impersonation/buscar', {
      params: { q: termo },
    })
    return response.data.data
  }

  // Inicia impersonation de um organizador
  async function startImpersonation(organizadorId: string) {
    // Salva token e user admin atuais
    if (token.value && user.value) {
      adminToken.value = token.value
      adminUser.value = { ...user.value }
      localStorage.setItem('admin_token', token.value)
    }

    const response = await api.post('/admin/impersonation/iniciar', {
      organizador_id: organizadorId,
    })

    // Troca para o token do organizador
    token.value = response.data.token
    localStorage.setItem('token', response.data.token)

    // Guarda informações do organizador impersonado
    impersonatedOrganizador.value = {
      id: response.data.organizador.id,
      empresa: response.data.organizador.empresa,
      cnpj: null,
      user: response.data.user,
    }

    // Recarrega dados do user impersonado
    await fetchUser()
  }

  // Encerra impersonation e volta para admin
  async function endImpersonation() {
    try {
      await api.post('/impersonation/encerrar')
    } catch {
      // Ignora erro, pois o token pode já ter sido revogado
    }

    // Restaura token e user admin
    if (adminToken.value && adminUser.value) {
      token.value = adminToken.value
      user.value = adminUser.value
      localStorage.setItem('token', adminToken.value)
    }

    // Limpa estado de impersonation
    adminToken.value = null
    adminUser.value = null
    impersonatedOrganizador.value = null
    localStorage.removeItem('admin_token')

    // Recarrega dados do admin
    await fetchUser()
  }

  // Restaura estado de impersonation ao carregar a aplicação
  async function restoreImpersonationState() {
    const storedAdminToken = localStorage.getItem('admin_token')
    if (storedAdminToken && token.value && token.value !== storedAdminToken) {
      // Estamos em modo impersonation
      adminToken.value = storedAdminToken
      // O organizador impersonado será recuperado quando fetchUser for chamado
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isImpersonating,
    adminToken,
    adminUser,
    impersonatedOrganizador,
    login,
    logout,
    fetchUser,
    register,
    searchOrganizadores,
    startImpersonation,
    endImpersonation,
    restoreImpersonationState,
  }
})
