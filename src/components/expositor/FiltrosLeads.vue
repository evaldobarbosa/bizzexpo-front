<script setup lang="ts">
import { ref, watch } from 'vue'
import Input from '@/components/ui/Input.vue'

interface Props {
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'filtrar', filtros: { nivel_interesse?: string; busca?: string }): void
}>()

const nivelInteresse = ref('')
const busca = ref('')

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const niveisInteresse = [
  { value: '', label: 'Todos os niveis' },
  { value: 'orcamento', label: 'Orcamento' },
  { value: 'profissional', label: 'Interesse Profissional' },
  { value: 'entusiasta', label: 'Entusiasta' },
  { value: 'conhecendo', label: 'Apenas Conhecendo' },
]

const emitFiltros = () => {
  emit('filtrar', {
    nivel_interesse: nivelInteresse.value || undefined,
    busca: busca.value || undefined,
  })
}

const handleBuscaInput = (value: string) => {
  busca.value = value

  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    emitFiltros()
  }, 300)
}

watch(nivelInteresse, () => {
  emitFiltros()
})
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4">
    <!-- Busca -->
    <div class="flex-1 relative">
      <Input
        :model-value="busca"
        @update:model-value="handleBuscaInput"
        placeholder="Buscar por nome ou email..."
        :disabled="loading"
      />
      <svg
        class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- Filtro por nivel de interesse -->
    <select
      v-model="nivelInteresse"
      :disabled="loading"
      class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white disabled:bg-gray-100"
    >
      <option
        v-for="nivel in niveisInteresse"
        :key="nivel.value"
        :value="nivel.value"
      >
        {{ nivel.label }}
      </option>
    </select>
  </div>
</template>
