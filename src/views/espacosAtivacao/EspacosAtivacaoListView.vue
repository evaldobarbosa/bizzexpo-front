<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import EspacoCard from '@/components/espaco/EspacoCard.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useEspacosAtivacaoStore } from '@/stores/espacosAtivacao'
import { useEventosStore } from '@/stores/eventos'

const route = useRoute()
const router = useRouter()
const espacosStore = useEspacosAtivacaoStore()
const eventosStore = useEventosStore()

const eventoId = route.params.eventoId as string
const deleteConfirm = ref<string | null>(null)

onMounted(async () => {
  await eventosStore.fetchEvento(eventoId)
  await espacosStore.fetchEspacos(eventoId)
})

function handleEdit(id: string) {
  router.push(`/eventos/${eventoId}/espacos-ativacao/${id}/editar`)
}

async function handleDelete(id: string) {
  if (deleteConfirm.value !== id) {
    deleteConfirm.value = id
    return
  }

  await espacosStore.deleteEspaco(eventoId, id)
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
          Espaços de Ativação
          <span v-if="eventosStore.eventoAtual" class="text-gray-500 font-normal">
            - {{ eventosStore.eventoAtual.nome }}
          </span>
        </h1>
        <p class="text-gray-500 mt-1 text-sm">
          Gerencie os espaços de ativação disponíveis para patrocinadores
        </p>
      </div>
      <Button @click="router.push(`/eventos/${eventoId}/espacos-ativacao/criar`)">
        Novo espaço
      </Button>
    </div>

    <div v-if="espacosStore.loading" class="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>

    <div v-else-if="espacosStore.espacos.length === 0" class="text-center py-12">
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
      <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum espaço de ativação</h3>
      <p class="mt-1 text-sm text-gray-500">Adicione o primeiro espaço de ativação ao evento.</p>
      <div class="mt-6">
        <Button @click="router.push(`/eventos/${eventoId}/espacos-ativacao/criar`)">
          Adicionar espaço
        </Button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <EspacoCard
        v-for="espaco in espacosStore.espacos"
        :key="espaco.id"
        tipo="espacoAtivacao"
        :espaco="espaco"
        :confirm-delete="deleteConfirm === espaco.id"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </AppLayout>
</template>
