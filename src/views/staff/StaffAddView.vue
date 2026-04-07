<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import StaffAddForm from '@/components/staff/StaffAddForm.vue'
import Button from '@/components/ui/Button.vue'
import { useStaffStore } from '@/stores/staff'

const route = useRoute()
const router = useRouter()
const staffStore = useStaffStore()

const eventoId = route.params.eventoId as string
const loading = ref(false)

async function handleSubmit(email: string) {
  loading.value = true
  try {
    await staffStore.addStaff(eventoId, email)
    router.push(`/eventos/${eventoId}/staff`)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="mb-6">
      <Button variant="ghost" size="sm" @click="router.push(`/eventos/${eventoId}/staff`)">
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
      <h1 class="text-2xl font-bold text-gray-900 mt-2">Adicionar staff</h1>
    </div>

    <div class="max-w-xl">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <StaffAddForm
          :loading="loading"
          @submit="handleSubmit"
          @cancel="router.push(`/eventos/${eventoId}/staff`)"
        />
      </div>
    </div>
  </AppLayout>
</template>
