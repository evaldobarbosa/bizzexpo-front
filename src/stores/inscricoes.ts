import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { InscricaoForm, InscricaoCompleta, PaginatedResponse } from '@/types'

export const useInscricoesStore = defineStore('inscricoes', () => {
  const inscricoes = ref<InscricaoCompleta[]>([])
  const inscricaoAtual = ref<InscricaoCompleta | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const meta = ref<PaginatedResponse<any>['meta'] | null>(null)

  // Criar inscrição pública
  async function criarInscricao(slug: string, dados: InscricaoForm) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/evento/${slug}/inscricao`, dados)
      inscricaoAtual.value = response.data.data
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao realizar inscrição'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Listar inscrições (organizador)
  async function fetchInscricoes(eventoId: string, filtros?: {
    categoria_id?: string
    checkin?: boolean | null
    busca?: string
    page?: number
    per_page?: number
  }) {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (filtros?.categoria_id) params.append('categoria_id', filtros.categoria_id)
      if (filtros?.checkin !== undefined && filtros?.checkin !== null) {
        params.append('checkin', String(filtros.checkin))
      }
      if (filtros?.busca) params.append('busca', filtros.busca)
      if (filtros?.page) params.append('page', String(filtros.page))
      if (filtros?.per_page) params.append('per_page', String(filtros.per_page))

      const response = await api.get(`/eventos/${eventoId}/inscricoes?${params.toString()}`)
      inscricoes.value = response.data.data
      meta.value = response.data.meta
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar inscrições'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Cancelar inscrição (organizador)
  async function cancelarInscricao(eventoId: string, inscricaoId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.delete(`/eventos/${eventoId}/inscricoes/${inscricaoId}`)
      inscricoes.value = inscricoes.value.filter(i => i.id !== inscricaoId)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao cancelar inscrição'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Exportar inscrições (organizador)
  async function exportarInscricoes(eventoId: string, filtros?: {
    categoria_id?: string
    checkin?: boolean | null
  }) {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (filtros?.categoria_id) params.append('categoria_id', filtros.categoria_id)
      if (filtros?.checkin !== undefined && filtros?.checkin !== null) {
        params.append('checkin', String(filtros.checkin))
      }

      const response = await api.get(`/eventos/${eventoId}/inscricoes/exportar?${params.toString()}`, {
        responseType: 'blob'
      })

      // Download do arquivo
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'inscricoes.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao exportar inscrições'
      throw err
    } finally {
      loading.value = false
    }
  }

  function limpar() {
    inscricoes.value = []
    inscricaoAtual.value = null
    error.value = null
    meta.value = null
  }

  return {
    inscricoes,
    inscricaoAtual,
    loading,
    error,
    meta,
    criarInscricao,
    fetchInscricoes,
    cancelarInscricao,
    exportarInscricoes,
    limpar,
  }
})
