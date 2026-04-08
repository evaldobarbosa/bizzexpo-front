<script setup lang="ts">
import { computed } from 'vue'
import type { Stand, EspacoAtivacao } from '@/types'
import Button from '@/components/ui/Button.vue'

interface Props {
  tipo: 'stand' | 'espacoAtivacao'
  espaco: Stand | EspacoAtivacao
  confirmDelete?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const dimensoes = computed(() => {
  if (props.espaco.largura && props.espaco.profundidade) {
    return `${props.espaco.largura}m x ${props.espaco.profundidade}m`
  }
  if (props.espaco.largura) {
    return `${props.espaco.largura}m de largura`
  }
  if (props.espaco.profundidade) {
    return `${props.espaco.profundidade}m de profundidade`
  }
  return null
})

const tipoLabel = computed(() => {
  return props.tipo === 'stand' ? 'Stand' : 'Espaço de Ativação'
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <span
          class="inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-2"
          :class="tipo === 'stand' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
        >
          {{ tipoLabel }}
        </span>
        <h3 class="font-semibold text-gray-900">{{ espaco.nome }}</h3>
        <p v-if="espaco.localizacao" class="text-sm text-gray-500 mt-1">
          <svg class="inline-block w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {{ espaco.localizacao }}
        </p>
        <p v-if="dimensoes" class="text-sm text-gray-500 mt-1">
          <svg class="inline-block w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
          {{ dimensoes }}
        </p>
        <p class="text-lg font-bold text-gray-900 mt-2">
          {{ formatCurrency(espaco.preco) }}
        </p>
      </div>
    </div>

    <div class="flex gap-2 mt-4">
      <Button size="sm" variant="secondary" @click="emit('edit', espaco.id)"> Editar </Button>
      <Button
        size="sm"
        :variant="confirmDelete ? 'danger' : 'ghost'"
        @click="emit('delete', espaco.id)"
      >
        {{ confirmDelete ? 'Confirmar' : 'Excluir' }}
      </Button>
    </div>
  </div>
</template>
