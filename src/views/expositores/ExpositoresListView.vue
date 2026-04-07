<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import ExpositorCard from '@/components/expositores/ExpositorCard.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useExpositoresStore } from '@/stores/expositores'
import { useEventosStore } from '@/stores/eventos'

const route = useRoute()
const router = useRouter()
const expositoresStore = useExpositoresStore()
const eventosStore = useEventosStore()

const eventoId = route.params.eventoId as string
const deleteConfirm = ref<string | null>(null)

onMounted(async () => {
  await eventosStore.fetchEvento(eventoId)
  await expositoresStore.fetchExpositores(eventoId)
})

function handleEdit(id: string) {
  router.push(`/eventos/${eventoId}/expositores/${id}/editar`)
}

async function handleDelete(id: string) {
  if (deleteConfirm.value !== id) {
    deleteConfirm.value = id
    return
  }

  await expositoresStore.deleteExpositor(eventoId, id)
  deleteConfirm.value = null
}
</script>

<template>
  <AppLayout>
    <div class="flex items-center justify-between mb-6">
      <div>
        <Button variant="ghost" size="sm" @click="router.push(`/eventos/${eventoId}`)">
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
        <h1 class="text-2xl font-bold text-gray-900 mt-2">
          Expositores
          <span v-if="eventosStore.eventoAtual" class="text-gray-500 font-normal">
            - {{ eventosStore.eventoAtual.nome }}
          </span>
        </h1>
      </div>
      <Button @click="router.push(`/eventos/${eventoId}/expositores/criar`)">
        Novo expositor
      </Button>
    </div>

    <div v-if="expositoresStore.loading" class="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>

    <div v-else-if="expositoresStore.expositores.length === 0" class="text-center py-12">
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
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum expositor</h3>
      <p class="mt-1 text-sm text-gray-500">Adicione o primeiro expositor ao evento.</p>
      <div class="mt-6">
        <Button @click="router.push(`/eventos/${eventoId}/expositores/criar`)">
          Adicionar expositor
        </Button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ExpositorCard
        v-for="expositor in expositoresStore.expositores"
        :key="expositor.id"
        :expositor="expositor"
        :evento-id="eventoId"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </AppLayout>
</template>
