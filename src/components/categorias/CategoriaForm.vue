<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Categoria } from '@/types'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  categoria?: Categoria
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [data: { nome: string; descricao?: string }]
  cancel: []
}>()

const nome = ref('')
const descricao = ref('')

onMounted(() => {
  if (props.categoria) {
    nome.value = props.categoria.nome
    descricao.value = props.categoria.descricao || ''
  }
})

function handleSubmit() {
  emit('submit', {
    nome: nome.value,
    descricao: descricao.value || undefined,
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="nome" class="block text-sm font-medium text-gray-700">Nome *</label>
      <Input
        id="nome"
        v-model="nome"
        type="text"
        required
        placeholder="Ex: VIP, Standard, Premium"
        class="mt-1"
      />
    </div>

    <div>
      <label for="descricao" class="block text-sm font-medium text-gray-700">Descricao</label>
      <textarea
        id="descricao"
        v-model="descricao"
        rows="3"
        class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
        placeholder="Descricao da categoria (opcional)"
      />
    </div>

    <div class="flex gap-3">
      <Button type="submit" :loading="loading">
        {{ categoria ? 'Salvar' : 'Criar Categoria' }}
      </Button>
      <Button type="button" variant="secondary" @click="emit('cancel')">
        Cancelar
      </Button>
    </div>
  </form>
</template>
