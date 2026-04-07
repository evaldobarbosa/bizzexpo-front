<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import EstandeForm from '@/components/estandes/EstandeForm.vue'
import Button from '@/components/ui/Button.vue'
import { useEstandesStore } from '@/stores/estandes'

const route = useRoute()
const router = useRouter()
const estandesStore = useEstandesStore()

const eventoId = route.params.eventoId as string
const expositorId = route.params.expositorId as string
const loading = ref(false)

async function handleSubmit(data: { nome: string; localizacao?: string }) {
  loading.value = true
  try {
    await estandesStore.createEstande(eventoId, expositorId, data)
    router.push(`/eventos/${eventoId}/expositores/${expositorId}/estandes`)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="mb-6">
      <Button variant="ghost" size="sm" @click="router.push(`/eventos/${eventoId}/expositores/${expositorId}/estandes`)">
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
      <h1 class="text-2xl font-bold text-gray-900 mt-2">Novo estande</h1>
    </div>

    <div class="max-w-xl">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <EstandeForm
          :loading="loading"
          @submit="handleSubmit"
          @cancel="router.push(`/eventos/${eventoId}/expositores/${expositorId}/estandes`)"
        />
      </div>
    </div>
  </AppLayout>
</template>
