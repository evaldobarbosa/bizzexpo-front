<script setup lang="ts">
import type { ItemCarrinho } from '@/types'

interface Props {
  item: ItemCarrinho
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:quantidade', quantidade: number): void
  (e: 'remover'): void
}>()

function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function incrementar(item: ItemCarrinho) {
  emit('update:quantidade', item.quantidade + 1)
}

function decrementar(item: ItemCarrinho) {
  if (item.quantidade > 1) {
    emit('update:quantidade', item.quantidade - 1)
  }
}
</script>

<template>
  <div class="flex items-center gap-4 p-4 bg-white border rounded-lg">
    <div class="flex-1">
      <h4 class="font-medium text-gray-900">{{ item.produto?.nome ?? 'Produto' }}</h4>
      <p class="text-sm text-gray-500">{{ formatPrice(item.preco_unitario) }} /unidade</p>
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
        :disabled="loading || item.quantidade <= 1"
        @click="decrementar(item)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
      <span class="w-8 text-center font-medium">{{ item.quantidade }}</span>
      <button
        type="button"
        class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
        :disabled="loading"
        @click="incrementar(item)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <div class="text-right min-w-[100px]">
      <p class="font-semibold text-gray-900">{{ formatPrice(item.subtotal) }}</p>
    </div>

    <button
      type="button"
      class="p-2 text-gray-400 hover:text-red-500 transition-colors"
      :disabled="loading"
      @click="emit('remover')"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  </div>
</template>
