<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import CotaForm from '@/components/cotasPatrocinio/CotaForm.vue'
import Button from '@/components/ui/Button.vue'
import { useCotasPatrocinioStore } from '@/stores/cotasPatrocinio'

const route = useRoute()
const router = useRouter()
const cotasStore = useCotasPatrocinioStore()

const eventoId = route.params.eventoId as string
const loading = ref(false)

async function handleSubmit(data: {
  nome: string
  descricao?: string
  preco?: number
  limite_patrocinadores?: number | null
}) {
  loading.value = true
  try {
    await cotasStore.createCota(eventoId, data)
    router.push(`/eventos/${eventoId}/cotas-patrocinio`)
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
        @click="router.push(`/eventos/${eventoId}/cotas-patrocinio`)"
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
      <h1 class="text-2xl font-bold text-gray-900 mt-2">Nova cota de patrocínio</h1>
    </div>

    <div class="max-w-xl">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <CotaForm
          :loading="loading"
          @submit="handleSubmit"
          @cancel="router.push(`/eventos/${eventoId}/cotas-patrocinio`)"
        />
      </div>
    </div>
  </AppLayout>
</template>
