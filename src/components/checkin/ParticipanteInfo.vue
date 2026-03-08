<script setup lang="ts">
import type { InscricaoCompleta } from '@/types'

interface Props {
  inscricao: InscricaoCompleta
}

defineProps<Props>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 p-6">
    <!-- Avatar e nome -->
    <div class="flex items-center gap-4 mb-6">
      <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span class="text-2xl font-bold text-primary">
          {{ inscricao.participante.nome.charAt(0) }}
        </span>
      </div>
      <div class="min-w-0">
        <h3 class="text-xl font-bold text-slate-900 truncate">
          {{ inscricao.participante.nome }}
        </h3>
        <p class="text-slate-500 text-sm truncate">
          {{ inscricao.participante.email }}
        </p>
      </div>
    </div>

    <!-- Dados do participante -->
    <div class="space-y-3">
      <div v-if="inscricao.participante.telefone" class="flex items-center gap-3">
        <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span class="text-slate-600">{{ inscricao.participante.telefone }}</span>
      </div>

      <div v-if="inscricao.participante.empresa" class="flex items-center gap-3">
        <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span class="text-slate-600">{{ inscricao.participante.empresa }}</span>
      </div>

      <div v-if="inscricao.participante.cargo" class="flex items-center gap-3">
        <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span class="text-slate-600">{{ inscricao.participante.cargo }}</span>
      </div>
    </div>

    <!-- Categoria -->
    <div class="mt-6 pt-4 border-t border-slate-200">
      <span class="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
        {{ inscricao.categoria.nome }}
      </span>
    </div>

    <!-- Status do check-in -->
    <div v-if="inscricao.checkin_at" class="mt-4 flex items-center gap-2 text-green-600">
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="text-sm font-medium">Check-in ja realizado</span>
    </div>
  </div>
</template>
