<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue'

interface Props {
  status: string
}

defineProps<Props>()

function getVariant(status: string) {
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

function getLabel(status: string) {
  switch (status) {
    case 'rascunho':
      return 'Rascunho'
    case 'pago':
      return 'Pago'
    case 'publicado':
      return 'Publicado'
    case 'encerrado':
      return 'Encerrado'
    default:
      return status
  }
}
</script>

<template>
  <Badge :variant="getVariant(status)">
    {{ getLabel(status) }}
  </Badge>
</template>
