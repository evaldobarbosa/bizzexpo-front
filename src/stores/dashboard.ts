import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { DashboardMetrics, RankingExpositor, HorarioPico, Evento } from '@/types'

export const useDashboardStore = defineStore('dashboard', () => {
  const metricas = ref<DashboardMetrics | null>(null)
  const eventosRecentes = ref<Evento[]>([])
  const rankingExpositores = ref<RankingExpositor[]>([])
  const horariosPico = ref<HorarioPico[]>([])
  const loading = ref(false)
  const loadingRanking = ref(false)
  const loadingHorarios = ref(false)

  async function fetchDashboard() {
    loading.value = true
    try {
      const response = await api.get('/dashboard')
      metricas.value = response.data.metricas
      eventosRecentes.value = response.data.eventos_recentes
    } finally {
      loading.value = false
    }
  }

  async function fetchRankingExpositores(eventoId: string) {
    loadingRanking.value = true
    try {
      const response = await api.get('/dashboard/ranking-expositores', {
        params: { evento_id: eventoId }
      })
      rankingExpositores.value = response.data.data
    } finally {
      loadingRanking.value = false
    }
  }

  async function fetchHorariosPico(eventoId: string) {
    loadingHorarios.value = true
    try {
      const response = await api.get('/dashboard/horarios-pico', {
        params: { evento_id: eventoId }
      })
      horariosPico.value = response.data.data
    } finally {
      loadingHorarios.value = false
    }
  }

  return {
    metricas,
    eventosRecentes,
    rankingExpositores,
    horariosPico,
    loading,
    loadingRanking,
    loadingHorarios,
    fetchDashboard,
    fetchRankingExpositores,
    fetchHorariosPico,
  }
})
