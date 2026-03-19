<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/Button.vue'

const authStore = useAuthStore()
const loading = ref(false)

async function voltarParaAdmin() {
  loading.value = true
  try {
    await authStore.endImpersonation()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    v-if="authStore.isImpersonating"
    class="bg-amber-500 text-amber-950 px-4 py-2"
  >
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <div class="flex items-center gap-2">
        <!-- Icone de aviso -->
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span class="font-medium">
          Visualizando como:
          <strong>{{ authStore.impersonatedOrganizador?.empresa }}</strong>
          ({{ authStore.impersonatedOrganizador?.user.name }})
        </span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        :loading="loading"
        class="bg-amber-600 hover:bg-amber-700 text-white"
        @click="voltarParaAdmin"
      >
        Voltar para Admin
      </Button>
    </div>
  </div>
</template>
