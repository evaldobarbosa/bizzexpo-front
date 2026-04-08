<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import EspacoForm from '@/components/espaco/EspacoForm.vue'
import Button from '@/components/ui/Button.vue'
import { useStandsStore } from '@/stores/stands'

const route = useRoute()
const router = useRouter()
const standsStore = useStandsStore()

const eventoId = route.params.eventoId as string
const loading = ref(false)

async function handleSubmit(data: {
  nome: string
  descricao?: string
  localizacao?: string
  largura?: number
  profundidade?: number
  preco?: number
}) {
  loading.value = true
  try {
    await standsStore.createStand(eventoId, data)
    router.push(`/eventos/${eventoId}/stands`)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="mb-6">
      <Button variant="ghost" size="sm" @click="router.push(`/eventos/${eventoId}/stands`)">
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
      <h1 class="text-2xl font-bold text-gray-900 mt-2">Novo stand</h1>
    </div>

    <div class="max-w-xl">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <EspacoForm
          tipo="stand"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="router.push(`/eventos/${eventoId}/stands`)"
        />
      </div>
    </div>
  </AppLayout>
</template>
