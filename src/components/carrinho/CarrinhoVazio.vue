<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

const emit = defineEmits<{
  (e: 'adicionar'): void
}>()
</script>

<template>
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
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
    <h3 class="mt-4 text-lg font-medium text-gray-900">Seu carrinho esta vazio</h3>
    <p class="mt-2 text-sm text-gray-500">
      Adicione produtos ao seu carrinho para continuar
    </p>
    <div class="mt-6">
      <Button variant="secondary" @click="emit('adicionar')">
        Ver Produtos Disponiveis
      </Button>
    </div>
  </div>
</template>
