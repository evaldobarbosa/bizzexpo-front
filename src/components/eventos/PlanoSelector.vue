<script setup lang="ts">
import type { PlanoEvento, PlanoInfo } from '@/types'

interface Props {
  modelValue?: PlanoEvento
  error?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PlanoEvento): void
}>()

const planos: PlanoInfo[] = [
  {
    value: 'essencial',
    label: 'Essencial',
    preco: 299,
    participantes: 'Ate 500 participantes',
    descricao: 'Ideal para eventos pequenos e medios',
  },
  {
    value: 'profissional',
    label: 'Profissional',
    preco: 899,
    participantes: 'Ate 5.000 participantes',
    descricao: 'Perfeito para feiras e congressos',
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    preco: null,
    participantes: 'Ilimitado',
    descricao: 'Solucao personalizada para grandes eventos',
  },
]

function selectPlano(plano: PlanoEvento) {
  emit('update:modelValue', plano)
}

function formatPrice(preco: number | null): string {
  if (preco === null) return 'Sob consulta'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(preco)
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="plano in planos"
      :key="plano.value"
      class="relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all"
      :class="{
        'border-blue-500 bg-blue-50': modelValue === plano.value,
        'border-gray-200 hover:border-gray-300': modelValue !== plano.value,
        'border-red-500': error && !modelValue,
      }"
      @click="selectPlano(plano.value)"
    >
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-gray-900">{{ plano.label }}</span>
            <span
              v-if="plano.value === 'profissional'"
              class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
            >
              Popular
            </span>
          </div>
          <span class="font-bold text-gray-900">{{ formatPrice(plano.preco) }}</span>
        </div>
        <p class="mt-1 text-sm text-gray-500">{{ plano.participantes }}</p>
        <p class="mt-1 text-xs text-gray-400">{{ plano.descricao }}</p>
      </div>
      <div class="ml-4 flex items-center">
        <div
          class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
          :class="{
            'border-blue-500 bg-blue-500': modelValue === plano.value,
            'border-gray-300': modelValue !== plano.value,
          }"
        >
          <svg
            v-if="modelValue === plano.value"
            class="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
    <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
  </div>
</template>
