<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <header class="relative overflow-hidden pt-8 pb-16 px-4 max-w-7xl mx-auto">
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-6">
        <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold w-fit">
          <span class="w-2 h-2 rounded-full bg-accent-red"></span>
          NOVA PLATAFORMA 2.0
        </div>
        <h1 class="text-slate-900 text-4xl md:text-5xl font-black leading-[1.1] tracking-tight">
          Transforme seu evento em <span class="text-primary">inteligencia comercial</span>
        </h1>
        <p class="text-slate-600 text-lg leading-relaxed max-w-2xl">
          Credenciamento inteligente, captura de leads em tempo real e analytics avancado para feiras e exposicoes.
        </p>
        <div class="flex flex-col gap-3 sm:flex-row">
          <button
            @click="router.push('/register')"
            class="flex items-center justify-center bg-primary text-white h-14 px-8 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
          >
            Comecar agora
          </button>
          <button
            class="flex items-center justify-center bg-white text-slate-900 border-2 border-slate-200 h-14 px-8 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors"
          >
            Ver demonstracao
          </button>
        </div>
      </div>
      <div class="relative mt-8">
        <div class="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/20 blur-[100px] rounded-full"></div>
        <div class="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
          <div class="rounded-xl w-full aspect-video bg-gradient-to-br from-primary/10 to-accent-yellow/10 flex items-center justify-center">
            <div class="text-center">
              <svg class="h-16 w-16 mx-auto text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p class="mt-2 text-slate-500 font-medium">Dashboard BizzExpo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
