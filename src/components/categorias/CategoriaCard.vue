<script setup lang="ts">
import type { Categoria } from '@/types'
import Button from '@/components/ui/Button.vue'

interface Props {
  categoria: Categoria
  eventoId: string
}

defineProps<Props>()
const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900">{{ categoria.nome }}</h3>
        <p v-if="categoria.descricao" class="mt-1 text-sm text-gray-600">
          {{ categoria.descricao }}
        </p>
        <p v-else class="mt-1 text-sm text-gray-400 italic">
          Sem descricao
        </p>
      </div>
    </div>

    <div class="mt-4 flex gap-2">
      <Button variant="secondary" size="sm" @click="emit('edit', categoria.id)">
        Editar
      </Button>
      <Button variant="danger" size="sm" @click="emit('delete', categoria.id)">
        Excluir
      </Button>
    </div>
  </div>
</template>
