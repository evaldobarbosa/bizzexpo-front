<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import Spinner from '@/components/ui/Spinner.vue'
import CarrinhoItem from '@/components/carrinho/CarrinhoItem.vue'
import CarrinhoResumo from '@/components/carrinho/CarrinhoResumo.vue'
import CarrinhoVazio from '@/components/carrinho/CarrinhoVazio.vue'
import { useCarrinhoStore } from '@/stores/carrinho'
import { useExpositorDashboardStore } from '@/stores/expositorDashboard'

const router = useRouter()
const carrinhoStore = useCarrinhoStore()
const expositorStore = useExpositorDashboardStore()

const eventoId = computed(() => expositorStore.dashboard?.evento?.id ?? '')
const eventoNome = computed(() => expositorStore.dashboard?.evento?.nome ?? 'Evento')

onMounted(async () => {
  // Primeiro busca o dashboard para ter o evento_id
  if (!expositorStore.dashboard) {
    await expositorStore.fetchDashboard()
  }
  if (eventoId.value) {
    await carrinhoStore.fetchCarrinho(eventoId.value)
  }
})

async function handleAtualizarQuantidade(itemId: string, quantidade: number) {
  if (eventoId.value) {
    await carrinhoStore.atualizarQuantidade(eventoId.value, itemId, quantidade)
  }
}

async function handleRemoverItem(itemId: string) {
  if (eventoId.value) {
    await carrinhoStore.removerItem(eventoId.value, itemId)
  }
}

async function handleFinalizar() {
  if (!eventoId.value) return

  try {
    const resultado = await carrinhoStore.fecharCarrinho(eventoId.value)
    router.push({
      name: 'expositor-pedido-confirmado',
      params: { faturaId: resultado.fatura_id },
    })
  } catch {
    // Erro já tratado no store
  }
}

function handleAdicionarProdutos() {
  router.push({ name: 'expositor-catalogo' })
}
</script>

<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Meu Carrinho</h1>
        <p class="text-gray-500">{{ eventoNome }}</p>
      </div>

      <div v-if="carrinhoStore.loading && !carrinhoStore.carrinho" class="flex justify-center py-12">
        <Spinner />
      </div>

      <template v-else>
        <div v-if="carrinhoStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-600">{{ carrinhoStore.error }}</p>
        </div>

        <div v-if="carrinhoStore.estaVazio">
          <Card>
            <CarrinhoVazio @adicionar="handleAdicionarProdutos" />
          </Card>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <CarrinhoItem
              v-for="item in carrinhoStore.carrinho?.itens"
              :key="item.id"
              :item="item"
              :loading="carrinhoStore.loading"
              @update:quantidade="(qtd) => handleAtualizarQuantidade(item.id, qtd)"
              @remover="handleRemoverItem(item.id)"
            />
          </div>

          <div>
            <CarrinhoResumo
              :total="carrinhoStore.total"
              :quantidade-itens="carrinhoStore.quantidadeItens"
              :loading="carrinhoStore.loading"
              @finalizar="handleFinalizar"
            />
          </div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>
