<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { OrganizadorBusca } from '@/types'
import Spinner from '@/components/ui/Spinner.vue'

const emit = defineEmits<{
  (e: 'selecionar', organizador: OrganizadorBusca): void
}>()

const authStore = useAuthStore()

const searchTerm = ref('')
const resultados = ref<OrganizadorBusca[]>([])
const loading = ref(false)
const isOpen = ref(false)
const error = ref<string | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchTerm, (valor) => {
  // Limpa timer anterior
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Limpa resultados se termo for menor que 3 caracteres
  if (valor.length < 3) {
    resultados.value = []
    isOpen.value = false
    return
  }

  // Debounce de 300ms
  debounceTimer = setTimeout(async () => {
    loading.value = true
    error.value = null
    try {
      resultados.value = await authStore.searchOrganizadores(valor)
      isOpen.value = resultados.value.length > 0
    } catch {
      error.value = 'Erro ao buscar organizadores'
      resultados.value = []
    } finally {
      loading.value = false
    }
  }, 300)
})

function selecionarOrganizador(organizador: OrganizadorBusca) {
  emit('selecionar', organizador)
  searchTerm.value = ''
  resultados.value = []
  isOpen.value = false
}

function fechar() {
  isOpen.value = false
}

function handleBlur() {
  setTimeout(() => fechar(), 200)
}
</script>

<template>
  <div class="relative">
    <!-- Input de busca -->
    <div class="relative">
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Buscar organizador..."
        class="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @focus="isOpen = resultados.length > 0"
        @blur="handleBlur"
      />
      <Spinner
        v-if="loading"
        class="absolute right-3 top-1/2 -translate-y-1/2"
        size="sm"
      />
    </div>

    <!-- Dropdown de resultados -->
    <div
      v-if="isOpen && resultados.length > 0"
      class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
    >
      <button
        v-for="org in resultados"
        :key="org.id"
        type="button"
        class="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
        @click="selecionarOrganizador(org)"
      >
        <div class="font-medium text-gray-900">{{ org.empresa }}</div>
        <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <span>{{ org.user.name }}</span>
          <span>&middot;</span>
          <span>{{ org.user.email }}</span>
        </div>
        <div v-if="org.cnpj" class="text-xs text-gray-400 mt-1">
          CNPJ: {{ org.cnpj }}
        </div>
      </button>
    </div>

    <!-- Mensagem sem resultados -->
    <div
      v-if="isOpen && searchTerm.length >= 3 && resultados.length === 0 && !loading"
      class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500"
    >
      Nenhum organizador encontrado
    </div>

    <!-- Erro -->
    <div
      v-if="error"
      class="absolute z-50 mt-1 w-full bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600"
    >
      {{ error }}
    </div>
  </div>
</template>
