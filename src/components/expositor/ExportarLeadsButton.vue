<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

interface Props {
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'exportar'): void
}>()
</script>

<template>
  <Button
    variant="secondary"
    :loading="loading"
    :disabled="loading"
    @click="emit('exportar')"
  >
    <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    Exportar CSV
  </Button>
</template>
