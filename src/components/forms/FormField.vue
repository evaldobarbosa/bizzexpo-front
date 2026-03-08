<script setup lang="ts">
interface Props {
  label: string
  id?: string
  error?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
})
</script>

<template>
  <div class="space-y-1">
    <label v-if="props.label" :for="props.id" class="block text-sm font-medium text-gray-700">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
    <slot />
    <p v-if="props.error" class="text-sm text-red-600">{{ props.error }}</p>
  </div>
</template>
