<script setup lang="ts">
import { computed } from 'vue'
import QRCodeVue from 'qrcode.vue'
import type { InscricaoCompleta } from '@/types'

interface Props {
  inscricao: InscricaoCompleta
}

const props = defineProps<Props>()

const dataInscricao = computed(() => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(props.inscricao.created_at))
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
    <!-- Cabecalho verde de sucesso -->
    <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold mb-1">Inscricao Confirmada!</h2>
      <p class="text-green-100">Sua inscricao foi realizada com sucesso</p>
    </div>

    <!-- Conteudo -->
    <div class="p-6 space-y-6">
      <!-- QR Code -->
      <div class="flex justify-center">
        <div class="p-4 bg-white rounded-xl border-2 border-slate-200">
          <QRCodeVue
            :value="inscricao.qrcode"
            :size="200"
            level="H"
          />
        </div>
      </div>

      <p class="text-center text-slate-600 text-sm">
        Apresente este QR Code no credenciamento do evento
      </p>

      <!-- Dados da inscricao -->
      <div class="bg-slate-50 rounded-xl p-4 space-y-3">
        <div class="flex justify-between">
          <span class="text-slate-500 text-sm">Participante</span>
          <span class="text-slate-900 font-medium text-sm">{{ inscricao.participante.nome }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500 text-sm">E-mail</span>
          <span class="text-slate-900 font-medium text-sm">{{ inscricao.participante.email }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500 text-sm">Categoria</span>
          <span class="text-slate-900 font-medium text-sm">{{ inscricao.categoria.nome }}</span>
        </div>
        <div v-if="inscricao.evento" class="flex justify-between">
          <span class="text-slate-500 text-sm">Evento</span>
          <span class="text-slate-900 font-medium text-sm">{{ inscricao.evento.nome }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500 text-sm">Data da inscricao</span>
          <span class="text-slate-900 font-medium text-sm">{{ dataInscricao }}</span>
        </div>
      </div>

      <!-- Aviso -->
      <div class="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm text-amber-800">
          Um e-mail de confirmacao foi enviado para <strong>{{ inscricao.participante.email }}</strong>.
          Salve ou imprima o QR Code para o dia do evento.
        </p>
      </div>
    </div>
  </div>
</template>
