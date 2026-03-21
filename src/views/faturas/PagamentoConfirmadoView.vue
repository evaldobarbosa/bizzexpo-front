<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useFaturasStore } from '@/stores/faturas'

const route = useRoute()
const router = useRouter()
const faturasStore = useFaturasStore()

const pagamentoId = computed(() => route.params.id as string)

onMounted(() => {
  faturasStore.fetchPagamento(pagamentoId.value)
})

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getMetodoLabel(metodo: string) {
  switch (metodo) {
    case 'pix':
      return 'PIX'
    case 'credit_card':
      return 'Cartao de Credito'
    case 'debit_card':
      return 'Cartao de Debito'
    case 'manual':
      return 'Pagamento Manual'
    default:
      return metodo
  }
}

function handleVerFaturas() {
  router.push('/minhas-faturas')
}

function handleVoltarDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <AppLayout title="Pagamento Confirmado">
    <div class="max-w-lg mx-auto">
      <div v-if="faturasStore.loading" class="flex justify-center py-12">
        <Spinner size="lg" />
      </div>

      <Card v-else-if="faturasStore.pagamentoAtual" class="text-center">
        <!-- Icone de Sucesso -->
        <div class="mb-6">
          <div class="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <!-- Mensagem -->
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Pagamento Confirmado!
        </h1>
        <p class="text-gray-500 mb-8">
          Seu pagamento foi processado com sucesso.
        </p>

        <!-- Detalhes do Pagamento -->
        <div class="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-500">Valor pago</span>
              <span class="font-semibold text-gray-900">
                {{ formatPrice(faturasStore.pagamentoAtual.valor) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Metodo</span>
              <span class="font-medium text-gray-900">
                {{ getMetodoLabel(faturasStore.pagamentoAtual.metodo) }}
              </span>
            </div>
            <div v-if="faturasStore.pagamentoAtual.parcelas && faturasStore.pagamentoAtual.parcelas > 1" class="flex justify-between">
              <span class="text-gray-500">Parcelas</span>
              <span class="font-medium text-gray-900">
                {{ faturasStore.pagamentoAtual.parcelas }}x de
                {{ formatPrice(faturasStore.pagamentoAtual.valor_parcela ?? 0) }}
              </span>
            </div>
            <div v-if="faturasStore.pagamentoAtual.paid_at" class="flex justify-between">
              <span class="text-gray-500">Data do pagamento</span>
              <span class="font-medium text-gray-900">
                {{ formatDate(faturasStore.pagamentoAtual.paid_at) }}
              </span>
            </div>
            <div class="flex justify-between pt-4 border-t border-gray-200">
              <span class="text-gray-500">ID da transacao</span>
              <span class="font-mono text-sm text-gray-600">
                {{ faturasStore.pagamentoAtual.gateway_id ?? faturasStore.pagamentoAtual.id }}
              </span>
            </div>
          </div>
        </div>

        <!-- Acoes -->
        <div class="space-y-3">
          <Button class="w-full" @click="handleVoltarDashboard">
            Voltar ao Dashboard
          </Button>
          <Button class="w-full" variant="ghost" @click="handleVerFaturas">
            Ver Minhas Faturas
          </Button>
        </div>
      </Card>

      <!-- Erro -->
      <Card v-else-if="faturasStore.error" class="text-center">
        <div class="mb-6">
          <div class="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h1 class="text-xl font-bold text-gray-900 mb-2">
          Erro ao carregar pagamento
        </h1>
        <p class="text-gray-500 mb-6">{{ faturasStore.error }}</p>
        <Button @click="handleVerFaturas">Ver Minhas Faturas</Button>
      </Card>
    </div>
  </AppLayout>
</template>
