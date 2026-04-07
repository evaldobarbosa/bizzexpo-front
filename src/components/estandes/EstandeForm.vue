<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Estande } from '@/types'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  estande?: Estande
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [data: { nome: string; localizacao?: string }]
  cancel: []
}>()

const nome = ref('')
const localizacao = ref('')

onMounted(() => {
  if (props.estande) {
    nome.value = props.estande.nome
    localizacao.value = props.estande.localizacao || ''
  }
})

function handleSubmit() {
  emit('submit', {
    nome: nome.value,
    localizacao: localizacao.value || undefined,
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
        placeholder="Ex: Estande Principal, Stand A1"
        class="mt-1"
      />
    </div>

    <div>
      <label for="localizacao" class="block text-sm font-medium text-gray-700">Localização</label>
      <Input
        id="localizacao"
        v-model="localizacao"
        type="text"
        placeholder="Ex: Pavilhão A, Stand 15"
        class="mt-1"
      />
    </div>

    <div class="flex gap-3">
      <Button type="submit" :loading="loading">
        {{ estande ? 'Salvar' : 'Criar Estande' }}
      </Button>
      <Button type="button" variant="secondary" @click="emit('cancel')">
        Cancelar
      </Button>
    </div>
  </form>
</template>
