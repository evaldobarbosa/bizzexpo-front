<script setup lang="ts">
import { ref } from 'vue'
import type { InscricaoCompleta } from '@/types'
import Input from '@/components/ui/Input.vue'
import Spinner from '@/components/ui/Spinner.vue'

interface Props {
  resultados: InscricaoCompleta[]
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'buscar', termo: string): void
  (e: 'selecionar', inscricao: InscricaoCompleta): void
}>()

const termo = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const handleInput = (value: string) => {
  termo.value = value

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  if (value.length >= 3) {
    debounceTimer = setTimeout(() => {
      emit('buscar', value)
    }, 300)
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Campo de busca -->
    <div class="relative">
      <Input
        :model-value="termo"
        @update:model-value="handleInput"
        placeholder="Buscar por nome ou email..."
      />
      <div v-if="loading" class="absolute right-3 top-1/2 -translate-y-1/2">
        <Spinner class="w-5 h-5" />
      </div>
      <svg
        v-else
        class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- Instrução -->
    <p v-if="termo.length < 3 && termo.length > 0" class="text-slate-500 text-sm">
      Digite pelo menos 3 caracteres para buscar
    </p>

    <!-- Resultados -->
    <div v-if="resultados.length > 0" class="space-y-2">
      <p class="text-slate-500 text-sm">
        {{ resultados.length }} resultado(s) encontrado(s)
      </p>

      <div class="space-y-2 max-h-96 overflow-y-auto">
        <button
          v-for="inscricao in resultados"
          :key="inscricao.id"
          @click="emit('selecionar', inscricao)"
          class="w-full text-left bg-white rounded-xl border border-slate-200 p-4 hover:border-primary/50 hover:shadow-sm transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span class="font-bold text-primary">
                {{ inscricao.participante.nome.charAt(0) }}
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h4 class="font-semibold text-slate-900 truncate">
                  {{ inscricao.participante.nome }}
                </h4>
                <span
                  v-if="inscricao.checkin_at"
                  class="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium"
                >
                  Check-in realizado
                </span>
              </div>
              <p class="text-slate-500 text-sm truncate">
                {{ inscricao.participante.email }}
              </p>
            </div>
            <svg class="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <!-- Sem resultados -->
    <div
      v-else-if="termo.length >= 3 && !loading && resultados.length === 0"
      class="text-center py-8"
    >
      <svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p class="text-slate-500">Nenhum participante encontrado</p>
    </div>
  </div>
</template>
