<script setup lang="ts">
const features = [
  'Gestao completa do ciclo de vida do evento',
  'Dashboard de KPIs em tempo real',
  'Aplicativo exclusivo para expositores',
  'Suporte tecnico especializado 24/7',
]
</script>

<template>
  <section id="solucao" class="py-16 px-4 bg-primary text-white overflow-hidden">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
      <div class="w-full lg:w-1/2">
        <div class="rounded-3xl shadow-2xl border-4 border-white/20 bg-white/10 aspect-video flex items-center justify-center">
          <svg class="h-24 w-24 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>
      <div class="w-full lg:w-1/2">
        <h2 class="text-4xl font-black mb-6 leading-tight">BizzExpo resolve tudo isso</h2>
        <p class="text-white/80 text-lg mb-8">
          Nossa plataforma foi desenhada para eliminar atritos e maximizar o valor gerado para organizadores e visitantes.
        </p>
        <ul class="space-y-4">
          <li
            v-for="feature in features"
            :key="feature"
            class="flex items-center gap-3"
          >
            <svg class="h-6 w-6 text-accent-yellow flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">{{ feature }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
