<script setup lang="ts">
import type { Staff } from '@/types'
import Button from '@/components/ui/Button.vue'

interface Props {
  staff: Staff
  eventoId: string
}

defineProps<Props>()
const emit = defineEmits<{
  remove: [id: string]
}>()
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span class="text-blue-600 font-semibold text-sm">
            {{ staff.user?.name?.charAt(0).toUpperCase() || 'U' }}
          </span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">{{ staff.user?.name }}</h3>
          <p class="text-sm text-gray-500">{{ staff.user?.email }}</p>
        </div>
      </div>

      <Button variant="danger" size="sm" @click="emit('remove', staff.id)">
        Remover
      </Button>
    </div>
  </div>
</template>
