<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import EventoCard from '@/components/eventos/EventoCard.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useEventosStore } from '@/stores/eventos'

const router = useRouter()
const eventosStore = useEventosStore()

onMounted(() => {
  eventosStore.fetchEventos()
})
</script>

<template>
  <AppLayout>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Eventos</h1>
      <Button @click="router.push('/eventos/criar')">Novo Evento</Button>
    </div>

    <div v-if="eventosStore.loading" class="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>

    <div v-else-if="eventosStore.eventos.length === 0" class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum evento</h3>
      <p class="mt-1 text-sm text-gray-500">Comece criando seu primeiro evento.</p>
      <div class="mt-6">
        <Button @click="router.push('/eventos/criar')">Criar Evento</Button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <EventoCard v-for="evento in eventosStore.eventos" :key="evento.id" :evento="evento" />
    </div>
  </AppLayout>
</template>
