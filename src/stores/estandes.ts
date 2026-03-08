import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { Estande } from '@/types'

export const useEstandesStore = defineStore('estandes', () => {
  const estandes = ref<Estande[]>([])
  const estandeAtual = ref<Estande | null>(null)
  const loading = ref(false)

  async function fetchEstandes(eventoId: string, expositorId: string) {
    loading.value = true
    try {
      const response = await api.get(`/eventos/${eventoId}/expositores/${expositorId}/estandes`)
      estandes.value = response.data.data
    } finally {
      loading.value = false
    }
  }

  async function fetchEstande(eventoId: string, expositorId: string, estandeId: string) {
    loading.value = true
    try {
      const response = await api.get(`/eventos/${eventoId}/expositores/${expositorId}/estandes/${estandeId}`)
      estandeAtual.value = response.data.data
      return response.data.data
    } finally {
      loading.value = false
    }
  }

  async function createEstande(
    eventoId: string,
    expositorId: string,
    data: {
      nome: string
      localizacao?: string
    }
  ) {
    const response = await api.post(`/eventos/${eventoId}/expositores/${expositorId}/estandes`, data)
    estandes.value.unshift(response.data.data)
    return response.data.data
  }

  async function updateEstande(
    eventoId: string,
    expositorId: string,
    estandeId: string,
    data: {
      nome?: string
      localizacao?: string
    }
  ) {
    const response = await api.put(`/eventos/${eventoId}/expositores/${expositorId}/estandes/${estandeId}`, data)
    const index = estandes.value.findIndex((e) => e.id === estandeId)
    if (index !== -1) {
      estandes.value[index] = response.data.data
    }
    estandeAtual.value = response.data.data
    return response.data.data
  }

  async function deleteEstande(eventoId: string, expositorId: string, estandeId: string) {
    await api.delete(`/eventos/${eventoId}/expositores/${expositorId}/estandes/${estandeId}`)
    estandes.value = estandes.value.filter((e) => e.id !== estandeId)
  }

  return {
    estandes,
    estandeAtual,
    loading,
    fetchEstandes,
    fetchEstande,
    createEstande,
    updateEstande,
    deleteEstande,
  }
})
