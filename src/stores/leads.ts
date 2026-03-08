import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { LeadCompleto, PaginatedResponse } from '@/types'

export interface LeadFiltros {
  nivel_interesse?: string
  busca?: string
  page?: number
  per_page?: number
}

export const useLeadsStore = defineStore('leads', () => {
  const leads = ref<LeadCompleto[]>([])
  const meta = ref<PaginatedResponse<any>['meta'] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchLeads(filtros?: LeadFiltros) {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (filtros?.nivel_interesse) params.append('nivel_interesse', filtros.nivel_interesse)
      if (filtros?.busca) params.append('busca', filtros.busca)
      if (filtros?.page) params.append('page', String(filtros.page))
      if (filtros?.per_page) params.append('per_page', String(filtros.per_page))

      const response = await api.get(`/expositor/leads?${params.toString()}`)
      leads.value = response.data.data
      meta.value = response.data.meta
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar leads'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function exportarLeads(filtros?: Pick<LeadFiltros, 'nivel_interesse'>) {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (filtros?.nivel_interesse) params.append('nivel_interesse', filtros.nivel_interesse)

      const response = await api.get(`/expositor/leads/exportar?${params.toString()}`, {
        responseType: 'blob',
      })

      // Download do arquivo
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'leads.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao exportar leads'
      throw err
    } finally {
      loading.value = false
    }
  }

  function limpar() {
    leads.value = []
    meta.value = null
    error.value = null
  }

  return {
    leads,
    meta,
    loading,
    error,
    fetchLeads,
    exportarLeads,
    limpar,
  }
})
