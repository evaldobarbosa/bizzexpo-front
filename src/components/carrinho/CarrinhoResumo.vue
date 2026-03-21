<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

interface Props {
  total: number
  quantidadeItens: number
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'finalizar'): void
}>()

function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
</script>

<template>
  <div class="bg-white border rounded-lg p-6 space-y-4">
    <h3 class="text-lg font-semibold text-gray-900">Resumo do Pedido</h3>

    <div class="space-y-2 text-sm">
      <div class="flex justify-between text-gray-600">
        <span>Itens ({{ quantidadeItens }})</span>
        <span>{{ formatPrice(total) }}</span>
      </div>
    </div>

    <hr class="border-gray-200" />

    <div class="flex justify-between text-lg font-semibold">
      <span>Total</span>
      <span class="text-blue-600">{{ formatPrice(total) }}</span>
    </div>

    <Button
      class="w-full"
      :loading="loading"
      :disabled="quantidadeItens === 0"
      @click="emit('finalizar')"
    >
      Finalizar Pedido
    </Button>

    <p class="text-xs text-gray-500 text-center">
      Ao finalizar, uma fatura sera gerada automaticamente
    </p>
  </div>
</template>
