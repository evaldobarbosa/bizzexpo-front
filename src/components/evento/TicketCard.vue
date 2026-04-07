<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: string
  nome: string
  descricao?: string
  quantidade: number
  maxQuantidade?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxQuantidade: 10,
})

const emit = defineEmits<{
  (e: 'update:quantidade', value: number): void
}>()

const canDecrease = computed(() => props.quantidade > 0)
const canIncrease = computed(() => props.quantidade < props.maxQuantidade)

function decrease() {
  if (canDecrease.value) {
    emit('update:quantidade', props.quantidade - 1)
  }
}

function increase() {
  if (canIncrease.value) {
    emit('update:quantidade', props.quantidade + 1)
  }
}
</script>

<template>
  <div class="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0">
    <div class="flex-1 pr-4">
      <h4 class="font-medium text-slate-900">{{ nome }}</h4>
      <p v-if="descricao" class="text-sm text-slate-500 mt-0.5">{{ descricao }}</p>
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        :disabled="!canDecrease"
        class="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="decrease"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>

      <span class="w-8 text-center font-medium text-slate-900">{{ quantidade }}</span>

      <button
        type="button"
        :disabled="!canIncrease"
        class="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        @click="increase"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  </div>
</template>
