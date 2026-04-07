<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('gestao')

const tabs = [
  { id: 'gestao', label: 'Gestão' },
  { id: 'inscricao', label: 'Inscrição' },
  { id: 'checkin', label: 'Check-in' },
  { id: 'leads', label: 'Leads' },
]

const tabContent = {
  gestao: {
    title: 'Gestão de ponta a ponta',
    description: 'Controle financeiro, gestão de palestrantes e cronograma do evento em uma interface intuitiva. Nossa ferramenta de gestão permite que você tenha visão 360 de cada detalhe, evitando imprevistos e otimizando recursos.',
    tags: ['Financeiro', 'Agenda'],
  },
  inscricao: {
    title: 'Inscrições simplificadas',
    description: 'Formulários personalizáveis, pagamento integrado e confirmação automática. Ofereça uma experiência sem fricção para seus participantes desde o primeiro contato.',
    tags: ['Formulários', 'Pagamentos'],
  },
  checkin: {
    title: 'Check-in instantâneo',
    description: 'QR Code, reconhecimento facial ou lista manual. Você escolhe a melhor opção para seu evento e elimina filas desnecessárias.',
    tags: ['QR Code', 'Rápido'],
  },
  leads: {
    title: 'Captura de leads',
    description: 'App exclusivo para expositores coletarem leads com escaneamento de crachás. Dados sincronizados em tempo real com seu CRM.',
    tags: ['App', 'CRM'],
  },
}
</script>

<template>
  <section id="funcionalidades" class="py-16 px-4 max-w-7xl mx-auto">
    <h2 class="text-slate-900 text-3xl font-black text-center mb-10">Tudo o que você precisa</h2>

    <div class="flex flex-wrap justify-center gap-2 mb-8 bg-slate-100 p-1 rounded-xl">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex-1 min-w-[100px] py-3 px-4 rounded-lg font-medium text-sm transition-colors"
        :class="activeTab === tab.id ? 'bg-white text-primary shadow-sm font-bold' : 'text-slate-500'"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
      <div class="w-full md:w-1/2">
        <h3 class="text-2xl font-black text-slate-900 mb-4">{{ tabContent[activeTab as keyof typeof tabContent].title }}</h3>
        <p class="text-slate-600 mb-6 leading-relaxed">
          {{ tabContent[activeTab as keyof typeof tabContent].description }}
        </p>
        <div class="flex flex-wrap gap-4">
          <div
            v-for="tag in tabContent[activeTab as keyof typeof tabContent].tags"
            :key="tag"
            class="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100"
          >
            <span class="text-xs font-bold uppercase tracking-wider text-primary">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2">
        <div class="bg-primary/5 rounded-2xl p-4">
          <div class="rounded-xl shadow-lg w-full aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent-yellow/10 flex items-center justify-center">
            <svg class="h-16 w-16 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
