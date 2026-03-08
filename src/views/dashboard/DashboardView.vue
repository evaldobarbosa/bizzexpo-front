<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import EventosList from '@/components/dashboard/EventosList.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import api from '@/services/api'
import type { Evento } from '@/types'

const router = useRouter()
const loading = ref(true)
const error = ref<string | null>(null)

const metricas = ref({
  total_eventos: 0,
  eventos_ativos: 0,
  total_expositores: 0,
})
const eventosRecentes = ref<Evento[]>([])

onMounted(async () => {
  try {
    const response = await api.get('/dashboard')
    metricas.value = response.data.data.metricas
    eventosRecentes.value = response.data.data.eventos_recentes
  } catch (e: any) {
    if (e.response?.status === 403) {
      // Usuario nao e organizador, redirecionar para cadastro
      router.push('/organizador/cadastro')
    } else {
      error.value = 'Erro ao carregar dashboard'
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppLayout>
    <div v-if="loading" class="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>

    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button @click="router.push('/eventos/criar')">Novo Evento</Button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Total de Eventos"
          :value="metricas.total_eventos"
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
        <MetricCard
          title="Eventos Ativos"
          :value="metricas.eventos_ativos"
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <MetricCard
          title="Total de Expositores"
          :value="metricas.total_expositores"
          icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </div>

      <EventosList :eventos="eventosRecentes" />
    </div>
  </AppLayout>
</template>
