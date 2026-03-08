<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useEventoPublicoStore } from '@/stores/eventoPublico'
import { useInscricoesStore } from '@/stores/inscricoes'
import QRCodeConfirmacao from '@/components/evento/QRCodeConfirmacao.vue'
import AdicionarCalendario from '@/components/evento/AdicionarCalendario.vue'
import Spinner from '@/components/ui/Spinner.vue'

const route = useRoute()
const eventoStore = useEventoPublicoStore()
const inscricoesStore = useInscricoesStore()

const slug = route.params.slug as string

onMounted(async () => {
  // Carrega evento se ainda nao foi carregado
  if (!eventoStore.evento || eventoStore.evento.slug !== slug) {
    await eventoStore.fetchEvento(slug)
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Loading state -->
    <div v-if="eventoStore.loading && !eventoStore.evento" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Spinner class="mx-auto mb-4" />
        <p class="text-slate-500">Carregando...</p>
      </div>
    </div>

    <!-- Confirmacao -->
    <template v-else>
      <!-- Header -->
      <header class="bg-white border-b border-slate-200 py-4 px-4">
        <div class="max-w-2xl mx-auto flex items-center gap-4">
          <router-link
            :to="{ name: 'evento-publico', params: { slug } }"
            class="text-slate-500 hover:text-slate-700"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <div>
            <h1 class="font-semibold text-slate-900">Confirmacao de Inscricao</h1>
            <p v-if="eventoStore.evento" class="text-sm text-slate-500">{{ eventoStore.evento.nome }}</p>
          </div>
        </div>
      </header>

      <!-- Conteudo -->
      <main class="py-8 px-4">
        <div class="max-w-lg mx-auto">
          <!-- QR Code e dados da inscricao -->
          <QRCodeConfirmacao
            v-if="inscricoesStore.inscricaoAtual"
            :inscricao="inscricoesStore.inscricaoAtual"
          />

          <!-- Acoes adicionais -->
          <div class="mt-6 flex flex-col items-center gap-4">
            <AdicionarCalendario v-if="eventoStore.evento" :evento="eventoStore.evento" />

            <router-link
              :to="{ name: 'evento-publico', params: { slug } }"
              class="text-primary hover:underline text-sm font-medium"
            >
              Voltar para a pagina do evento
            </router-link>
          </div>
        </div>
      </main>
    </template>
  </div>
</template>
