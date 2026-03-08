<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Badge from '@/components/ui/Badge.vue'
import type { Evento } from '@/types'

interface Props {
  eventos: Evento[]
}

defineProps<Props>()

function getStatusVariant(status: string) {
  switch (status) {
    case 'publicado':
      return 'success'
    case 'pago':
      return 'info'
    case 'encerrado':
      return 'default'
    default:
      return 'warning'
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Eventos Recentes</h3>
    </div>

    <div v-if="eventos.length === 0" class="p-6 text-center text-gray-500">
      Nenhum evento cadastrado ainda.
    </div>

    <ul v-else class="divide-y divide-gray-200">
      <li v-for="evento in eventos" :key="evento.id" class="px-6 py-4 hover:bg-gray-50">
        <RouterLink :to="`/eventos/${evento.id}`" class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900">{{ evento.nome }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(evento.data_inicio) }}</p>
          </div>
          <Badge :variant="getStatusVariant(evento.status)">
            {{ evento.status }}
          </Badge>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
