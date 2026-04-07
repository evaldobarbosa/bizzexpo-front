<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import Input from '@/components/ui/Input.vue'
import { useInscricoesStore } from '@/stores/inscricoes'
import { useEventosStore } from '@/stores/eventos'
import { useCategoriasStore } from '@/stores/categorias'

const route = useRoute()
const router = useRouter()
const inscricoesStore = useInscricoesStore()
const eventosStore = useEventosStore()
const categoriasStore = useCategoriasStore()

const eventoId = computed(() => route.params.eventoId as string)

// Filtros
const busca = ref('')
const categoriaFiltro = ref('')
const checkinFiltro = ref<string>('')
const paginaAtual = ref(1)

// Confirmação de cancelamento
const inscricaoParaCancelar = ref<string | null>(null)

// Debounce para busca
let buscaTimeout: ReturnType<typeof setTimeout>

onMounted(async () => {
  await eventosStore.fetchEvento(eventoId.value)
  await categoriasStore.fetchCategorias(eventoId.value)
  await carregarInscricoes()
})

async function carregarInscricoes() {
  const filtros: any = { page: paginaAtual.value }
  if (busca.value) filtros.busca = busca.value
  if (categoriaFiltro.value) filtros.categoria_id = categoriaFiltro.value
  if (checkinFiltro.value !== '') {
    filtros.checkin = checkinFiltro.value === 'true'
  }
  await inscricoesStore.fetchInscricoes(eventoId.value, filtros)
}

watch(busca, () => {
  clearTimeout(buscaTimeout)
  buscaTimeout = setTimeout(() => {
    paginaAtual.value = 1
    carregarInscricoes()
  }, 500)
})

watch([categoriaFiltro, checkinFiltro], () => {
  paginaAtual.value = 1
  carregarInscricoes()
})

async function cancelarInscricao(inscricaoId: string) {
  if (inscricaoParaCancelar.value !== inscricaoId) {
    inscricaoParaCancelar.value = inscricaoId
    return
  }
  await inscricoesStore.cancelarInscricao(eventoId.value, inscricaoId)
  inscricaoParaCancelar.value = null
}

async function exportarCSV() {
  const filtros: any = {}
  if (categoriaFiltro.value) filtros.categoria_id = categoriaFiltro.value
  if (checkinFiltro.value !== '') {
    filtros.checkin = checkinFiltro.value === 'true'
  }
  await inscricoesStore.exportarInscricoes(eventoId.value, filtros)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function mudaPagina(pagina: number) {
  paginaAtual.value = pagina
  carregarInscricoes()
}
</script>

<template>
  <AppLayout>
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <Button variant="ghost" size="sm" @click="router.push(`/eventos/${eventoId}`)">
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Button>
          <h1 class="text-2xl font-bold text-gray-900 mt-2">Inscrições</h1>
          <p class="text-gray-500" v-if="eventosStore.eventoAtual">
            {{ eventosStore.eventoAtual.nome }}
          </p>
        </div>
        <Button @click="exportarCSV" :loading="inscricoesStore.loading">
          <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar CSV
        </Button>
      </div>

      <Card class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <Input
              v-model="busca"
              placeholder="Buscar por nome ou email..."
              type="search"
            />
          </div>
          <div>
            <select
              v-model="categoriaFiltro"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todas as categorias</option>
              <option
                v-for="categoria in categoriasStore.categorias"
                :key="categoria.id"
                :value="categoria.id"
              >
                {{ categoria.nome }}
              </option>
            </select>
          </div>
          <div>
            <select
              v-model="checkinFiltro"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos os status</option>
              <option value="true">Com check-in</option>
              <option value="false">Sem check-in</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div v-if="inscricoesStore.loading" class="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>

        <div v-else-if="inscricoesStore.inscricoes.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma inscrição encontrada</h3>
          <p class="mt-1 text-sm text-gray-500">Compartilhe o link do evento para receber inscrições.</p>
        </div>

        <div v-else>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participante
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data inscrição
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="inscricao in inscricoesStore.inscricoes" :key="inscricao.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span class="text-primary-700 font-medium text-sm">
                          {{ inscricao.participante?.nome?.charAt(0)?.toUpperCase() || '?' }}
                        </span>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ inscricao.participante?.nome }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ inscricao.participante?.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {{ inscricao.categoria?.nome || '-' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      v-if="inscricao.checkin_at"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                    >
                      {{ formatDate(inscricao.checkin_at) }}
                    </span>
                    <span
                      v-else
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                    >
                      Pendente
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(inscricao.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      v-if="!inscricao.checkin_at && !inscricao.cancelado_em"
                      variant="danger"
                      size="sm"
                      @click="cancelarInscricao(inscricao.id)"
                    >
                      {{ inscricaoParaCancelar === inscricao.id ? 'Confirmar' : 'Cancelar' }}
                    </Button>
                    <span v-else-if="inscricao.cancelado_em" class="text-red-500">
                      Cancelada
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="inscricoesStore.meta && inscricoesStore.meta.last_page > 1"
            class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4"
          >
            <div class="text-sm text-gray-700">
              Mostrando {{ inscricoesStore.meta.from }} a {{ inscricoesStore.meta.to }} de {{ inscricoesStore.meta.total }} resultados
            </div>
            <div class="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                :disabled="paginaAtual === 1"
                @click="mudaPagina(paginaAtual - 1)"
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                :disabled="paginaAtual === inscricoesStore.meta.last_page"
                @click="mudaPagina(paginaAtual + 1)"
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </AppLayout>
</template>
