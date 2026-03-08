<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useExpositorDashboardStore } from '@/stores/expositorDashboard'
import MetricasExpositor from '@/components/expositor/MetricasExpositor.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'

const router = useRouter()
const store = useExpositorDashboardStore()

onMounted(async () => {
  await store.fetchDashboard()
})

const irParaLeads = () => {
  router.push({ name: 'expositor-leads' })
}
</script>

<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Dashboard Expositor</h1>
          <p v-if="store.dashboard" class="text-slate-500">
            {{ store.dashboard.expositor.nome_empresa }}
          </p>
        </div>
        <Button variant="primary" @click="irParaLeads">
          Ver todos os leads
        </Button>
      </div>

      <!-- Loading -->
      <div v-if="store.loading && !store.dashboard" class="text-center py-12">
        <Spinner class="mx-auto mb-4" />
        <p class="text-slate-500">Carregando dashboard...</p>
      </div>

      <!-- Erro -->
      <div v-else-if="store.error && !store.dashboard" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-slate-900 mb-2">Erro ao carregar dashboard</h2>
        <p class="text-slate-600 mb-4">{{ store.error }}</p>
        <Button variant="primary" @click="store.fetchDashboard()">
          Tentar novamente
        </Button>
      </div>

      <!-- Dashboard -->
      <template v-else-if="store.dashboard">
        <!-- Banner do expositor -->
        <div class="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 mb-6 text-white">
          <div class="flex items-center gap-4">
            <div
              v-if="store.dashboard.expositor.logo"
              class="w-16 h-16 rounded-xl bg-white p-2 flex-shrink-0"
            >
              <img
                :src="store.dashboard.expositor.logo"
                :alt="store.dashboard.expositor.nome_empresa"
                class="w-full h-full object-contain"
              />
            </div>
            <div
              v-else
              class="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0"
            >
              <span class="text-2xl font-bold">
                {{ store.dashboard.expositor.nome_empresa.charAt(0) }}
              </span>
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ store.dashboard.expositor.nome_empresa }}</h2>
              <p class="text-white/80">{{ store.dashboard.evento.nome }}</p>
            </div>
          </div>
        </div>

        <!-- Metricas -->
        <MetricasExpositor :dashboard="store.dashboard" />
      </template>
    </div>
  </AppLayout>
</template>
