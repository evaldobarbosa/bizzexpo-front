<script setup lang="ts">
interface Props {
  message?: string
}

defineProps<Props>()
</script>

<template>
  <p v-if="message" class="text-sm text-red-600">{{ message }}</p>
</template>
