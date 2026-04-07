<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import type { LeadFiltros } from '@/stores/leads'
import LeadsTable from '@/components/expositor/LeadsTable.vue'
import FiltrosLeads from '@/components/expositor/FiltrosLeads.vue'
import ExportarLeadsButton from '@/components/expositor/ExportarLeadsButton.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import Spinner from '@/components/ui/Spinner.vue'

const router = useRouter()
const store = useLeadsStore()

const filtrosAtuais = ref<LeadFiltros>({
  page: 1,
  per_page: 20,
})
const exportando = ref(false)

onMounted(async () => {
  await store.fetchLeads(filtrosAtuais.value)
})

const handleFiltrar = async (filtros: { nivel_interesse?: string; busca?: string }) => {
  filtrosAtuais.value = {
    ...filtrosAtuais.value,
    ...filtros,
    page: 1, // Volta para primeira página ao filtrar
  }
  await store.fetchLeads(filtrosAtuais.value)
}

const handlePaginar = async (page: number) => {
  filtrosAtuais.value.page = page
  await store.fetchLeads(filtrosAtuais.value)
}

const handleExportar = async () => {
  exportando.value = true
  try {
    await store.exportarLeads({
      nivel_interesse: filtrosAtuais.value.nivel_interesse,
    })
  } finally {
    exportando.value = false
  }
}

const voltarDashboard = () => {
  router.push({ name: 'expositor-dashboard' })
}
</script>

<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <button
          @click="voltarDashboard"
          class="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao dashboard
        </button>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Meus Leads</h1>
            <p class="text-slate-500">
              {{ store.meta?.total || 0 }} leads capturados
            </p>
          </div>
          <ExportarLeadsButton :loading="exportando" @exportar="handleExportar" />
        </div>
      </div>

      <!-- Filtros -->
      <div class="mb-6">
        <FiltrosLeads :loading="store.loading" @filtrar="handleFiltrar" />
      </div>

      <!-- Conteúdo -->
      <div class="bg-white rounded-2xl border border-slate-200">
        <!-- Loading -->
        <div v-if="store.loading && store.leads.length === 0" class="text-center py-12">
          <Spinner class="mx-auto mb-4" />
          <p class="text-slate-500">Carregando leads...</p>
        </div>

        <!-- Tabela -->
        <div v-else class="p-4">
          <LeadsTable
            :leads="store.leads"
            :meta="store.meta"
            :loading="store.loading"
            @paginar="handlePaginar"
          />
        </div>
      </div>
    </div>
  </AppLayout>
</template>
