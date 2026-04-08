<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import EspacoForm from '@/components/espaco/EspacoForm.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useEspacosAtivacaoStore } from '@/stores/espacosAtivacao'

const route = useRoute()
const router = useRouter()
const espacosStore = useEspacosAtivacaoStore()

const eventoId = route.params.eventoId as string
const espacoId = route.params.id as string
const loading = ref(false)

onMounted(async () => {
  await espacosStore.fetchEspaco(eventoId, espacoId)
})

async function handleSubmit(data: {
  nome?: string
  descricao?: string
  localizacao?: string
  largura?: number
  profundidade?: number
  preco?: number
}) {
  loading.value = true
  try {
    await espacosStore.updateEspaco(eventoId, espacoId, data)
    router.push(`/eventos/${eventoId}/espacos-ativacao`)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="mb-6">
      <Button
        variant="ghost"
        size="sm"
        @click="router.push(`/eventos/${eventoId}/espacos-ativacao`)"
      >
        <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Voltar
      </Button>
      <h1 class="text-2xl font-bold text-gray-900 mt-2">Editar espaço de ativação</h1>
    </div>

    <div v-if="espacosStore.loading" class="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>

    <div v-else class="max-w-xl">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <EspacoForm
          tipo="espacoAtivacao"
          :espaco="espacosStore.espacoAtual || undefined"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="router.push(`/eventos/${eventoId}/espacos-ativacao`)"
        />
      </div>
    </div>
  </AppLayout>
</template>
