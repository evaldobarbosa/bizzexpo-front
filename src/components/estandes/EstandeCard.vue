<script setup lang="ts">
import type { Estande } from '@/types'
import Button from '@/components/ui/Button.vue'
import QRCodeDisplay from './QRCodeDisplay.vue'

interface Props {
  estande: Estande
  eventoId: string
  expositorId: string
}

defineProps<Props>()
const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex items-start gap-4">
      <QRCodeDisplay :code="estande.qrcode" size="sm" />

      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900">{{ estande.nome }}</h3>
        <p v-if="estande.localizacao" class="mt-1 text-sm text-gray-600">
          <svg class="inline-block h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ estande.localizacao }}
        </p>
        <p v-else class="mt-1 text-sm text-gray-400 italic">
          Sem localizacao
        </p>
      </div>
    </div>

    <div class="mt-4 flex gap-2">
      <Button variant="secondary" size="sm" @click="emit('edit', estande.id)">
        Editar
      </Button>
      <Button variant="danger" size="sm" @click="emit('delete', estande.id)">
        Excluir
      </Button>
    </div>
  </div>
</template>
