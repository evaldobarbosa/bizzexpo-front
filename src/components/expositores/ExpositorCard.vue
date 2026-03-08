<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import type { Expositor } from '@/types'

interface Props {
  expositor: Expositor
  eventoId: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <Card padding="none" class="overflow-hidden">
    <div class="p-6">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-medium text-gray-900">{{ expositor.nome_empresa }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ expositor.nome_contato }}</p>
        </div>
      </div>

      <div class="mt-4 space-y-2 text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>{{ expositor.email_contato }}</span>
        </div>
        <div class="flex items-center gap-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span>{{ expositor.telefone }}</span>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" @click="emit('edit', expositor.id)">Editar</Button>
        <Button variant="danger" size="sm" @click="emit('delete', expositor.id)">Excluir</Button>
      </div>
    </div>
  </Card>
</template>
