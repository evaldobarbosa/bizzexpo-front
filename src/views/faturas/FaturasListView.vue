<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useFaturasStore } from '@/stores/faturas'
import type { Fatura, StatusFatura } from '@/types'

const router = useRouter()
const faturasStore = useFaturasStore()

onMounted(() => {
  faturasStore.fetchFaturas()
})

function getStatusBadge(status: StatusFatura) {
  switch (status) {
    case 'pendente':
      return { label: 'Pendente', class: 'bg-amber-100 text-amber-700' }
    case 'paga':
      return { label: 'Paga', class: 'bg-green-100 text-green-700' }
    case 'vencida':
      return { label: 'Vencida', class: 'bg-red-100 text-red-700' }
    case 'cancelada':
      return { label: 'Cancelada', class: 'bg-gray-100 text-gray-600' }
    case 'rascunho':
      return { label: 'Rascunho', class: 'bg-blue-100 text-blue-600' }
    default:
      return { label: status, class: 'bg-gray-100 text-gray-600' }
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function podesPagar(fatura: Fatura) {
  return fatura.status === 'pendente'
}

function handlePagar(fatura: Fatura) {
  router.push(`/faturas/${fatura.id}/pagar`)
}

function handleVerDetalhes(fatura: Fatura) {
  router.push(`/faturas/${fatura.id}`)
}
</script>

<template>
  <AppLayout title="Minhas faturas">
    <div class="max-w-4xl mx-auto">
      <div v-if="faturasStore.loading && faturasStore.faturas.length === 0" class="flex justify-center py-12">
        <Spinner size="lg" />
      </div>

      <div v-else-if="faturasStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600">{{ faturasStore.error }}</p>
      </div>

      <div v-else-if="faturasStore.faturas.length === 0">
        <Card>
          <div class="text-center py-12">
            <svg
              class="mx-auto h-16 w-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhuma fatura encontrada</h3>
            <p class="mt-2 text-sm text-gray-500">
              Suas faturas aparecerão aqui quando você criar eventos ou comprar produtos.
            </p>
          </div>
        </Card>
      </div>

      <div v-else class="space-y-4">
        <Card v-for="fatura in faturasStore.faturas" :key="fatura.id">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-semibold text-gray-900">{{ fatura.numero }}</h3>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusBadge(fatura.status).class"
                >
                  {{ getStatusBadge(fatura.status).label }}
                </span>
              </div>
              <p v-if="fatura.evento" class="text-sm text-gray-500 mt-1">
                {{ fatura.evento.nome }}
              </p>
              <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>Vencimento: {{ formatDate(fatura.vencimento) }}</span>
                <span>Criada em: {{ formatDate(fatura.created_at) }}</span>
              </div>
            </div>

            <div class="text-right">
              <p class="text-2xl font-bold text-gray-900">{{ formatPrice(fatura.total) }}</p>
              <div class="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" @click="handleVerDetalhes(fatura)">
                  Ver detalhes
                </Button>
                <Button v-if="podesPagar(fatura)" size="sm" @click="handlePagar(fatura)">
                  Pagar
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>
