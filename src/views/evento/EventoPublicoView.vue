<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventoPublicoStore } from '@/stores/eventoPublico'
import HeroEvento from '@/components/evento/HeroEvento.vue'
import SobreEvento from '@/components/evento/SobreEvento.vue'
import ExpositoresCarrossel from '@/components/evento/ExpositoresCarrossel.vue'
import LocalizacaoEvento from '@/components/evento/LocalizacaoEvento.vue'
import AdicionarCalendario from '@/components/evento/AdicionarCalendario.vue'
import TicketSelector from '@/components/evento/TicketSelector.vue'
import Spinner from '@/components/ui/Spinner.vue'
import WhatsAppFAB from '@/components/ui/WhatsAppFAB.vue'

const route = useRoute()
const router = useRouter()
const store = useEventoPublicoStore()

const slug = computed(() => route.params.slug as string)

// Detecta modo preview pela ancora #preview na URL
const isPreviewMode = computed(() => route.hash === '#preview')

// CSS Variables para cores customizadas do evento
const cssVars = computed(() => {
  const customizacao = store.evento?.customizacao
  return {
    '--evento-primary': customizacao?.cor_primaria || '#006b44',
    '--evento-secondary': customizacao?.cor_secundaria || '#1EC6B6',
    '--evento-bg': customizacao?.cor_fundo || '#ffffff',
    '--evento-text': customizacao?.cor_texto || '#1e293b',
  }
})

function voltarParaEdicao() {
  if (store.evento) {
    router.push(`/eventos/${store.evento.id}/editar`)
  }
}

onMounted(async () => {
  const preview = isPreviewMode.value
  await Promise.all([
    store.fetchEvento(slug.value, preview),
    store.fetchExpositores(slug.value, preview),
    store.fetchTiposIngresso(slug.value, preview),
  ])
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Loading state -->
    <div v-if="store.loading && !store.evento" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Spinner class="mx-auto mb-4" />
        <p class="text-slate-500">Carregando evento...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="store.error && !store.evento" class="min-h-screen flex items-center justify-center p-4">
      <div class="text-center max-w-md">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-slate-900 mb-2">Evento não encontrado</h2>
        <p class="text-slate-600 mb-6">{{ store.error }}</p>
        <router-link
          to="/"
          class="inline-flex items-center justify-center bg-primary text-white h-11 px-6 rounded-lg font-medium"
        >
          Voltar para o início
        </router-link>
      </div>
    </div>

    <!-- Evento carregado -->
    <template v-else-if="store.evento">
      <div :style="cssVars">
        <!-- Barra de Preview -->
        <div
          v-if="store.isPreview"
          class="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white py-2 px-4"
        >
          <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span class="font-semibold">Modo Preview</span>
              <span class="text-amber-100 text-sm hidden sm:inline">
                - Esta página ainda não está publicada
              </span>
            </div>
            <button
              @click="voltarParaEdicao"
              class="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 rounded-lg text-sm font-medium transition-colors"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar evento
            </button>
          </div>
        </div>

        <!-- Hero -->
        <HeroEvento :evento="store.evento" :class="{ 'mt-12': store.isPreview }" />

      <!-- Barra de acoes flutuante -->
      <div
        class="sticky z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 py-3 px-4"
        :class="store.isPreview ? 'top-12' : 'top-0'"
      >
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img
              v-if="store.evento.logo"
              :src="store.evento.logo"
              :alt="store.evento.nome"
              class="h-8 w-auto"
            />
            <h2 class="font-semibold text-slate-900 hidden sm:block">{{ store.evento.nome }}</h2>
          </div>
          <div class="flex items-center gap-3">
            <AdicionarCalendario :evento="store.evento" />
            <router-link
              :to="{ name: 'evento-inscricao', params: { slug: store.evento.slug } }"
              class="inline-flex items-center justify-center h-10 px-5 rounded-lg font-medium text-sm text-white"
              style="background-color: var(--evento-primary)"
            >
              Inscreva-se
            </router-link>
          </div>
        </div>
      </div>

      <!-- Conteudo principal com layout de duas colunas -->
      <div class="max-w-6xl mx-auto px-4 py-12">
        <div class="lg:flex lg:gap-10">
          <!-- Coluna principal (conteudo) -->
          <div class="lg:flex-1 min-w-0">
            <!-- Sobre -->
            <SobreEvento :evento="store.evento" class="mb-12" />

            <!-- Secao de tickets mobile -->
            <div class="lg:hidden mb-12">
              <TicketSelector
                :tipos-ingresso="store.tiposIngresso"
                :evento-slug="store.evento.slug"
              />
            </div>

            <!-- Expositores (oculta se nao houver expositores) -->
            <ExpositoresCarrossel
              v-if="store.expositores.length > 0"
              :expositores="store.expositores"
              class="mb-12"
            />

            <!-- Localizacao -->
            <LocalizacaoEvento :evento="store.evento" />
          </div>

          <!-- Coluna lateral de tickets (desktop) - sticky -->
          <div class="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <div class="sticky" :class="store.isPreview ? 'top-[120px]' : 'top-[72px]'">
              <TicketSelector
                :tipos-ingresso="store.tiposIngresso"
                :evento-slug="store.evento.slug"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Final -->
      <section class="py-16 px-4" style="background-color: var(--evento-primary)">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
            Garanta sua vaga!
          </h2>
          <p class="text-white/80 mb-8">
            Faca sua inscricao agora e aproveite tudo que o {{ store.evento.nome }} tem a oferecer.
          </p>
          <router-link
            :to="{ name: 'evento-inscricao', params: { slug: store.evento.slug } }"
            class="inline-flex items-center justify-center bg-white h-14 px-10 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors"
            style="color: var(--evento-primary)"
          >
            Fazer inscricao
          </router-link>
        </div>
      </section>

      <!-- WhatsApp FAB -->
      <WhatsAppFAB
        v-if="store.evento.whatsapp_contato"
        :numero="store.evento.whatsapp_contato"
        :nome-evento="store.evento.nome"
        :data-fim-evento="store.evento.data_fim"
      />

      <!-- Footer simples -->
      <footer class="bg-slate-900 text-white py-8 px-4">
        <div class="max-w-7xl mx-auto text-center">
          <p class="text-slate-400 text-sm">
            &copy; {{ new Date().getFullYear() }} {{ store.evento.nome }}.
            <a href="https://duevento.com.br" target="_blank" class="hover:underline" style="color: var(--evento-primary)">Duevento</a>
          </p>
          <p class="text-slate-500 text-xs mt-1">
            Feito por <a href="https://code2.com.br" target="_blank" class="hover:underline">code2.com.br</a>
          </p>
        </div>
      </footer>
      </div>
    </template>
  </div>
</template>
