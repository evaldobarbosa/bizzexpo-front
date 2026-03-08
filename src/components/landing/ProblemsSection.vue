<script setup lang="ts">
const problems = [
  {
    icon: 'timer',
    title: 'Filas longas',
    description: 'Evite gargalos no credenciamento com check-in ultra rapido via QR Code.',
    color: 'red',
  },
  {
    icon: 'database',
    title: 'Dados perdidos',
    description: 'Centralize todas as informacoes em um so lugar, com backup em nuvem em tempo real.',
    color: 'blue',
  },
  {
    icon: 'chart',
    title: 'ROI invisivel',
    description: 'Saiba exatamente o retorno financeiro do seu evento com metricas precisas.',
    color: 'yellow',
  },
  {
    icon: 'link',
    title: 'Sem integracao',
    description: 'Sincronize com RD Station, HubSpot e Salesforce automaticamente.',
    color: 'gray',
  },
  {
    icon: 'cog',
    title: 'Processos manuais',
    description: 'Reduza o trabalho manual em ate 80% com automacao de fluxo de e-mails.',
    color: 'gray',
  },
  {
    icon: 'users',
    title: 'Expositores sem leads',
    description: 'Forneca ferramentas de coleta de dados de alta performance para seus parceiros.',
    color: 'gray',
  },
]
</script>

<template>
  <section id="problemas" class="bg-slate-100 py-16 px-4">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-slate-900 text-3xl font-black leading-tight mb-2">Desafios todos os dias</h2>
      <p class="text-slate-600 mb-8">Gerenciar um evento nao precisa ser um pesadelo logistico.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="problem in problems"
          :key="problem.title"
          class="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary/50 transition-colors group"
        >
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors"
            :class="{
              'bg-accent-red/10 text-accent-red group-hover:bg-accent-red group-hover:text-white': problem.color === 'red',
              'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white': problem.color === 'blue',
              'bg-accent-yellow/10 text-slate-800 group-hover:bg-accent-yellow': problem.color === 'yellow',
              'bg-slate-100 text-slate-600 group-hover:bg-primary group-hover:text-white': problem.color === 'gray',
            }"
          >
            <svg v-if="problem.icon === 'timer'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-if="problem.icon === 'database'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            <svg v-if="problem.icon === 'chart'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <svg v-if="problem.icon === 'link'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <svg v-if="problem.icon === 'cog'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-if="problem.icon === 'users'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 class="text-slate-900 text-lg font-bold mb-2">{{ problem.title }}</h3>
          <p class="text-slate-600 text-sm">{{ problem.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
