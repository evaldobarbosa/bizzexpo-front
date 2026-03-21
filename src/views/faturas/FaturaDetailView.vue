<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useFaturasStore } from '@/stores/faturas'
import type { StatusFatura } from '@/types'

const route = useRoute()
const router = useRouter()
const faturasStore = useFaturasStore()

const faturaId = computed(() => route.params.id as string)

onMounted(() => {
  faturasStore.fetchFatura(faturaId.value)
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

const podePagar = computed(() => {
  return faturasStore.faturaAtual?.status === 'pendente'
})

function handlePagar() {
  router.push(`/faturas/${faturaId.value}/pagar`)
}

function handleVoltar() {
  router.push('/minhas-faturas')
}
</script>

<template>
  <AppLayout title="Detalhes da Fatura">
    <div class="max-w-3xl mx-auto">
      <div v-if="faturasStore.loading" class="flex justify-center py-12">
        <Spinner size="lg" />
      </div>

      <div v-else-if="faturasStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600">{{ faturasStore.error }}</p>
        <Button variant="ghost" class="mt-4" @click="handleVoltar">Voltar</Button>
      </div>

      <template v-else-if="faturasStore.faturaAtual">
        <div class="mb-6">
          <button
            @click="handleVoltar"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para faturas
          </button>
        </div>

        <Card>
          <!-- Cabecalho -->
          <div class="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-gray-900">
                  Fatura {{ faturasStore.faturaAtual.numero }}
                </h1>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusBadge(faturasStore.faturaAtual.status).class"
                >
                  {{ getStatusBadge(faturasStore.faturaAtual.status).label }}
                </span>
              </div>
              <p v-if="faturasStore.faturaAtual.evento" class="text-gray-500 mt-1">
                {{ faturasStore.faturaAtual.evento.nome }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">Total</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ formatPrice(faturasStore.faturaAtual.total) }}
              </p>
            </div>
          </div>

          <!-- Datas -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-sm text-gray-500">Data de emissao</p>
              <p class="font-medium text-gray-900">
                {{ formatDate(faturasStore.faturaAtual.created_at) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Vencimento</p>
              <p class="font-medium text-gray-900">
                {{ formatDate(faturasStore.faturaAtual.vencimento) }}
              </p>
            </div>
          </div>

          <!-- Itens -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Itens</h3>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Descricao
                    </th>
                    <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Qtd
                    </th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Preco Unit.
                    </th>
                    <th class="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in faturasStore.faturaAtual.itens" :key="item.id">
                    <td class="px-4 py-3 text-gray-900">{{ item.descricao }}</td>
                    <td class="px-4 py-3 text-center text-gray-600">{{ item.quantidade }}</td>
                    <td class="px-4 py-3 text-right text-gray-600">
                      {{ formatPrice(item.preco_unitario) }}
                    </td>
                    <td class="px-4 py-3 text-right font-medium text-gray-900">
                      {{ formatPrice(item.subtotal) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Totais -->
          <div class="border-t border-gray-200 pt-4 space-y-2">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{{ formatPrice(faturasStore.faturaAtual.subtotal) }}</span>
            </div>
            <div v-if="faturasStore.faturaAtual.desconto > 0" class="flex justify-between text-green-600">
              <span>Desconto</span>
              <span>- {{ formatPrice(faturasStore.faturaAtual.desconto) }}</span>
            </div>
            <div class="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{{ formatPrice(faturasStore.faturaAtual.total) }}</span>
            </div>
          </div>

          <!-- Acoes -->
          <div v-if="podePagar" class="mt-8 pt-6 border-t border-gray-200">
            <Button class="w-full" size="lg" @click="handlePagar">
              Pagar Agora
            </Button>
          </div>
        </Card>
      </template>
    </div>
  </AppLayout>
</template>
