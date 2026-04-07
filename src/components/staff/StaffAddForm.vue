<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  loading?: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  submit: [email: string]
  cancel: []
}>()

const email = ref('')

function handleSubmit() {
  emit('submit', email.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email do usuário *</label>
      <Input
        id="email"
        v-model="email"
        type="email"
        required
        placeholder="email@exemplo.com"
        class="mt-1"
      />
      <p class="mt-1 text-sm text-gray-500">
        O usuário já deve estar cadastrado no sistema.
      </p>
    </div>

    <div class="flex gap-3">
      <Button type="submit" :loading="loading">
        Adicionar Staff
      </Button>
      <Button type="button" variant="secondary" @click="emit('cancel')">
        Cancelar
      </Button>
    </div>
  </form>
</template>
