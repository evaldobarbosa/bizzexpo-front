<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Spinner from '@/components/ui/Spinner.vue'
import api from '@/services/api'
import type { Evento } from '@/types'

interface MetricasFinanceiras {
  receita_mes: number
  eventos_pagos: number
  eventos_pendentes: number
}

const router = useRouter()

const metricas = ref<MetricasFinanceiras | null>(null)
const eventos = ref<Evento[]>([])
const loading = ref(true)
const loadingEventos = ref(true)
const filtroStatus = ref<string>('todos')

const eventosFiltrados = computed(() => {
  if (filtroStatus.value === 'todos') return eventos.value
  if (filtroStatus.value === 'pagos') {
    return eventos.value.filter(e => ['pago', 'publicado', 'encerrado'].includes(e.status))
  }
  return eventos.value.filter(e => e.status === 'rascunho')
})

async function carregarMetricas() {
  try {
    const response = await api.get('/admin/financeiro/metricas')
    metricas.value = response.data.data
  } catch (error) {
    console.error('Erro ao carregar métricas:', error)
  } finally {
    loading.value = false
  }
}

async function carregarEventos() {
  try {
    const response = await api.get('/admin/eventos', {
      params: { per_page: 100 }
    })
    eventos.value = response.data.data
  } catch (error) {
    console.error('Erro ao carregar eventos:', error)
  } finally {
    loadingEventos.value = false
  }
}

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

function formatarData(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR')
}

function getStatusVariant(status: string): 'default' | 'success' | 'warning' | 'danger' {
  switch (status) {
    case 'publicado':
      return 'success'
    case 'pago':
      return 'warning'
    case 'rascunho':
      return 'default'
    case 'encerrado':
      return 'danger'
    default:
      return 'default'
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'publicado':
      return 'Publicado'
    case 'pago':
      return 'Pago'
    case 'rascunho':
      return 'Pendente'
    case 'encerrado':
      return 'Encerrado'
    default:
      return status
  }
}

function verDetalhes(evento: Evento) {
  router.push(`/eventos/${evento.id}`)
}

onMounted(() => {
  carregarMetricas()
  carregarEventos()
})
</script>

<template>
  <AppLayout title="Financeiro">
    <div class="space-y-6">
      <!-- Cards de Métricas -->
      <div v-if="loading" class="flex justify-center py-12">
        <Spinner size="lg" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Receita do Mês -->
        <Card class="p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Receita do Mês</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ formatarMoeda(metricas?.receita_mes || 0) }}
              </p>
            </div>
          </div>
        </Card>

        <!-- Eventos Pagos -->
        <Card class="p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Eventos Pagos</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ metricas?.eventos_pagos || 0 }}
              </p>
            </div>
          </div>
        </Card>

        <!-- Eventos Pendentes -->
        <Card class="p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-amber-100 rounded-lg">
              <svg class="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Eventos Pendentes</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ metricas?.eventos_pendentes || 0 }}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <!-- Lista de Eventos -->
      <Card>
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Eventos</h2>

            <!-- Filtros -->
            <div class="flex gap-2">
              <button
                @click="filtroStatus = 'todos'"
                class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                :class="{
                  'bg-gray-900 text-white': filtroStatus === 'todos',
                  'bg-gray-100 text-gray-700 hover:bg-gray-200': filtroStatus !== 'todos'
                }"
              >
                Todos
              </button>
              <button
                @click="filtroStatus = 'pagos'"
                class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                :class="{
                  'bg-gray-900 text-white': filtroStatus === 'pagos',
                  'bg-gray-100 text-gray-700 hover:bg-gray-200': filtroStatus !== 'pagos'
                }"
              >
                Pagos
              </button>
              <button
                @click="filtroStatus = 'pendentes'"
                class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                :class="{
                  'bg-gray-900 text-white': filtroStatus === 'pendentes',
                  'bg-gray-100 text-gray-700 hover:bg-gray-200': filtroStatus !== 'pendentes'
                }"
              >
                Pendentes
              </button>
            </div>
          </div>
        </div>

        <div v-if="loadingEventos" class="flex justify-center py-12">
          <Spinner size="lg" />
        </div>

        <div v-else-if="eventosFiltrados.length === 0" class="p-12 text-center text-gray-500">
          Nenhum evento encontrado
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="evento in eventosFiltrados"
            :key="evento.id"
            class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="verDetalhes(evento)"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3">
                  <h3 class="text-base font-medium text-gray-900 truncate">
                    {{ evento.nome }}
                  </h3>
                  <Badge :variant="getStatusVariant(evento.status)">
                    {{ getStatusLabel(evento.status) }}
                  </Badge>
                </div>
                <div class="mt-1 flex items-center gap-4 text-sm text-gray-500">
                  <span>{{ formatarData(evento.data_inicio) }} - {{ formatarData(evento.data_fim) }}</span>
                  <span>&middot;</span>
                  <span>{{ evento.local }}</span>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <Button
                  v-if="evento.status === 'rascunho'"
                  size="sm"
                  variant="primary"
                  @click.stop="verDetalhes(evento)"
                >
                  Marcar Pago
                </Button>
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </AppLayout>
</template>
