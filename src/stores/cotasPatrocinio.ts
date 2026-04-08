import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { CotaPatrocinio } from '@/types'

export const useCotasPatrocinioStore = defineStore('cotasPatrocinio', () => {
  const cotas = ref<CotaPatrocinio[]>([])
  const cotaAtual = ref<CotaPatrocinio | null>(null)
  const loading = ref(false)

  async function fetchCotas(eventoId: string) {
    loading.value = true
    try {
      const response = await api.get(`/eventos/${eventoId}/cotas-patrocinio`)
      cotas.value = response.data.data
    } finally {
      loading.value = false
    }
  }

  async function fetchCota(eventoId: string, cotaId: string) {
    loading.value = true
    try {
      const response = await api.get(`/eventos/${eventoId}/cotas-patrocinio/${cotaId}`)
      cotaAtual.value = response.data.data
      return response.data.data
    } finally {
      loading.value = false
    }
  }

  async function createCota(
    eventoId: string,
    data: {
      nome: string
      descricao?: string
      preco?: number
      limite_patrocinadores?: number | null
    }
  ) {
    const response = await api.post(`/eventos/${eventoId}/cotas-patrocinio`, data)
    cotas.value.unshift(response.data.data)
    return response.data.data
  }

  async function updateCota(
    eventoId: string,
    cotaId: string,
    data: {
      nome?: string
      descricao?: string
      preco?: number
      limite_patrocinadores?: number | null
    }
  ) {
    const response = await api.put(`/eventos/${eventoId}/cotas-patrocinio/${cotaId}`, data)
    const index = cotas.value.findIndex((c) => c.id === cotaId)
    if (index !== -1) {
      cotas.value[index] = response.data.data
    }
    cotaAtual.value = response.data.data
    return response.data.data
  }

  async function deleteCota(eventoId: string, cotaId: string) {
    await api.delete(`/eventos/${eventoId}/cotas-patrocinio/${cotaId}`)
    cotas.value = cotas.value.filter((c) => c.id !== cotaId)
  }

  return {
    cotas,
    cotaAtual,
    loading,
    fetchCotas,
    fetchCota,
    createCota,
    updateCota,
    deleteCota,
  }
})
