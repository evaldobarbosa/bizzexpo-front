<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import EstandeCard from '@/components/estandes/EstandeCard.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useEstandesStore } from '@/stores/estandes'
import { useExpositoresStore } from '@/stores/expositores'

const route = useRoute()
const router = useRouter()
const estandesStore = useEstandesStore()
const expositoresStore = useExpositoresStore()

const eventoId = route.params.eventoId as string
const expositorId = route.params.expositorId as string
const deleteConfirm = ref<string | null>(null)

onMounted(async () => {
  await expositoresStore.fetchExpositor(eventoId, expositorId)
  await estandesStore.fetchEstandes(eventoId, expositorId)
})

function handleEdit(id: string) {
  router.push(`/eventos/${eventoId}/expositores/${expositorId}/estandes/${id}/editar`)
}

async function handleDelete(id: string) {
  if (deleteConfirm.value !== id) {
    deleteConfirm.value = id
    return
  }

  await estandesStore.deleteEstande(eventoId, expositorId, id)
  deleteConfirm.value = null
}
</script>

<template>
  <AppLayout>
    <div class="flex items-center justify-between mb-6">
      <div>
        <Button variant="ghost" size="sm" @click="router.push(`/eventos/${eventoId}/expositores`)">
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
          Estandes
          <span v-if="expositoresStore.expositorAtual" class="text-gray-500 font-normal">
            - {{ expositoresStore.expositorAtual.nome_empresa }}
          </span>
        </h1>
      </div>
      <Button @click="router.push(`/eventos/${eventoId}/expositores/${expositorId}/estandes/criar`)">
        Novo estande
      </Button>
    </div>

    <div v-if="estandesStore.loading" class="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>

    <div v-else-if="estandesStore.estandes.length === 0" class="text-center py-12">
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
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum estande</h3>
      <p class="mt-1 text-sm text-gray-500">Adicione o primeiro estande ao expositor.</p>
      <div class="mt-6">
        <Button @click="router.push(`/eventos/${eventoId}/expositores/${expositorId}/estandes/criar`)">
          Adicionar estande
        </Button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <EstandeCard
        v-for="estande in estandesStore.estandes"
        :key="estande.id"
        :estande="estande"
        :evento-id="eventoId"
        :expositor-id="expositorId"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </AppLayout>
</template>
