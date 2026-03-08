import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { DashboardExpositor } from '@/types'

export const useExpositorDashboardStore = defineStore('expositorDashboard', () => {
  const dashboard = ref<DashboardExpositor | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/expositor/dashboard')
      dashboard.value = response.data.data
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar dashboard'
      throw err
    } finally {
      loading.value = false
    }
  }

  function limpar() {
    dashboard.value = null
    error.value = null
  }

  return {
    dashboard,
    loading,
    error,
    fetchDashboard,
    limpar,
  }
})
