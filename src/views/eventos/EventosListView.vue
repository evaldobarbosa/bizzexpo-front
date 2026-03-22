<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useEventosStore } from '@/stores/eventos'
import type { Evento } from '@/types'

const router = useRouter()
const eventosStore = useEventosStore()

const filtroAtivo = ref<'todos' | 'publicado' | 'rascunho'>('todos')

const eventosFiltrados = computed(() => {
  if (filtroAtivo.value === 'todos') {
    return eventosStore.eventos
  }
  return eventosStore.eventos.filter((e) => e.status === filtroAtivo.value)
})

onMounted(() => {
  eventosStore.fetchEventos()
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'publicado':
      return { label: 'Publicado', class: 'bg-green-100 text-green-700' }
    case 'rascunho':
      return { label: 'Rascunho', class: 'bg-amber-100 text-amber-700' }
    case 'encerrado':
      return { label: 'Encerrado', class: 'bg-gray-100 text-gray-600' }
    default:
      return { label: status, class: 'bg-gray-100 text-gray-600' }
  }
}

function getFaturaBadge(evento: Evento) {
  if (evento.fatura_paga) {
    return { label: 'Pago', class: 'bg-emerald-500 text-white' }
  }
  return { label: 'Nao pago', class: 'bg-red-500 text-white' }
}

function navigateToEvento(id: string) {
  router.push(`/eventos/${id}`)
}
</script>

<template>
  <AppLayout>
    <!-- Page Title and Action -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">Eventos</h1>
        <p class="text-gray-500">Gerencie e acompanhe todos os seus eventos ativos e rascunhos.</p>
      </div>
      <button
        @click="router.push('/eventos/criar')"
        class="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Novo Evento</span>
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap">
      <button
        @click="filtroAtivo = 'todos'"
        class="px-6 py-4 text-sm font-bold border-b-2 transition-colors"
        :class="filtroAtivo === 'todos' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'"
      >
        Todos
      </button>
      <button
        @click="filtroAtivo = 'publicado'"
        class="px-6 py-4 text-sm font-medium border-b-2 transition-colors"
        :class="filtroAtivo === 'publicado' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'"
      >
        Publicados
      </button>
      <button
        @click="filtroAtivo = 'rascunho'"
        class="px-6 py-4 text-sm font-medium border-b-2 transition-colors"
        :class="filtroAtivo === 'rascunho' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'"
      >
        Rascunhos
      </button>
    </div>

    <!-- Loading -->
    <div v-if="eventosStore.loading" class="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>

    <!-- Empty State -->
    <div v-else-if="eventosFiltrados.length === 0" class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900">Nenhum evento</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ filtroAtivo === 'todos' ? 'Comece criando seu primeiro evento.' : `Nenhum evento com status "${filtroAtivo}".` }}
      </p>
      <div v-if="filtroAtivo === 'todos'" class="mt-6">
        <button
          @click="router.push('/eventos/criar')"
          class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Criar Evento
        </button>
      </div>
    </div>

    <!-- Events Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="evento in eventosFiltrados"
        :key="evento.id"
        @click="navigateToEvento(evento.id)"
        class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 group hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        <!-- Image -->
        <div class="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
          <!-- Placeholder com inicial do evento -->
          <div class="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <span class="text-6xl font-black text-primary/30">{{ evento.nome.charAt(0).toUpperCase() }}</span>
          </div>
          <!-- Status Badge -->
          <div class="absolute top-3 left-3">
            <span
              class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
              :class="getStatusBadge(evento.status).class"
            >
              {{ getStatusBadge(evento.status).label }}
            </span>
          </div>
          <!-- Fatura Badge -->
          <div class="absolute top-3 right-3">
            <span
              class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
              :class="getFaturaBadge(evento).class"
            >
              {{ getFaturaBadge(evento).label }}
            </span>
          </div>
        </div>
        <!-- Content -->
        <div class="p-5">
          <h3 class="text-lg font-bold text-gray-900 mb-2 truncate">{{ evento.nome }}</h3>
          <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ evento.local }}</p>
          <div class="flex items-center gap-2 text-primary text-sm font-semibold">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{{ formatDate(evento.data_inicio) }}</span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
