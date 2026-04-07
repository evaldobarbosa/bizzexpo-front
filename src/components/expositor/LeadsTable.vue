<script setup lang="ts">
import { computed } from 'vue'
import type { LeadCompleto, PaginatedResponse } from '@/types'

interface Props {
  leads: LeadCompleto[]
  meta?: PaginatedResponse<any>['meta'] | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'paginar', page: number): void
}>()

const getInteresseBadgeClass = (nivel: string) => {
  const classes: Record<string, string> = {
    orcamento: 'bg-red-100 text-red-700',
    profissional: 'bg-amber-100 text-amber-700',
    entusiasta: 'bg-blue-100 text-blue-700',
    conhecendo: 'bg-slate-100 text-slate-700',
  }
  return classes[nivel] || 'bg-slate-100 text-slate-700'
}

const formatarData = (data: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(data))
}

const paginas = computed(() => {
  if (!props.meta) return []

  const pages: number[] = []
  const current = props.meta.current_page
  const total = props.meta.last_page

  // Sempre mostra primeira página
  if (current > 3) pages.push(1)

  // Mostra ... se houver gap
  if (current > 4) pages.push(-1)

  // Páginas ao redor da atual
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }

  // Mostra ... se houver gap
  if (current < total - 3) pages.push(-1)

  // Sempre mostra última página
  if (current < total - 2) pages.push(total)

  return pages
})
</script>

<template>
  <div>
    <!-- Tabela -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-200">
            <th class="text-left py-3 px-4 text-sm font-semibold text-slate-700">Participante</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-slate-700">Contato</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-slate-700">Empresa</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-slate-700">Interesse</th>
            <th class="text-left py-3 px-4 text-sm font-semibold text-slate-700">Data</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="lead in leads"
            :key="lead.id"
            class="border-b border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <td class="py-3 px-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span class="font-bold text-primary">{{ lead.participante.nome.charAt(0) }}</span>
                </div>
                <div>
                  <p class="font-medium text-slate-900">{{ lead.participante.nome }}</p>
                  <p v-if="lead.participante.cargo" class="text-sm text-slate-500">
                    {{ lead.participante.cargo }}
                  </p>
                </div>
              </div>
            </td>
            <td class="py-3 px-4">
              <p class="text-slate-900">{{ lead.participante.email }}</p>
              <p v-if="lead.participante.telefone" class="text-sm text-slate-500">
                {{ lead.participante.telefone }}
              </p>
            </td>
            <td class="py-3 px-4">
              <p class="text-slate-900">{{ lead.participante.empresa || '-' }}</p>
              <p v-if="lead.participante.cidade_uf" class="text-sm text-slate-500">
                {{ lead.participante.cidade_uf }}
              </p>
            </td>
            <td class="py-3 px-4">
              <span
                :class="getInteresseBadgeClass(lead.nivel_interesse)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ lead.nivel_interesse_label }}
              </span>
            </td>
            <td class="py-3 px-4">
              <p class="text-slate-600 text-sm">{{ formatarData(lead.created_at) }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado vazio -->
    <div v-if="leads.length === 0 && !loading" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <p class="text-slate-500">Nenhum lead encontrado</p>
    </div>

    <!-- Paginação -->
    <div v-if="meta && meta.last_page > 1" class="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
      <p class="text-sm text-slate-500">
        Mostrando {{ (meta.current_page - 1) * meta.per_page + 1 }} a
        {{ Math.min(meta.current_page * meta.per_page, meta.total) }} de
        {{ meta.total }} resultados
      </p>

      <div class="flex items-center gap-1">
        <button
          :disabled="meta.current_page === 1"
          @click="emit('paginar', meta.current_page - 1)"
          class="px-3 py-1.5 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
        >
          Anterior
        </button>

        <template v-for="(page, index) in paginas" :key="index">
          <span v-if="page === -1" class="px-2 text-slate-400">...</span>
          <button
            v-else
            @click="emit('paginar', page)"
            :class="[
              'px-3 py-1.5 text-sm rounded-lg',
              page === meta.current_page
                ? 'bg-primary text-white'
                : 'hover:bg-slate-100',
            ]"
          >
            {{ page }}
          </button>
        </template>

        <button
          :disabled="meta.current_page === meta.last_page"
          @click="emit('paginar', meta.current_page + 1)"
          class="px-3 py-1.5 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
        >
          Próximo
        </button>
      </div>
    </div>
  </div>
</template>
