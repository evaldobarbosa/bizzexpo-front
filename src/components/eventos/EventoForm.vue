<script setup lang="ts">
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import FormField from '@/components/forms/FormField.vue'

interface FormData {
  nome: string
  descricao: string
  data_inicio: string
  data_fim: string
  local: string
}

interface Props {
  loading?: boolean
  errors?: Record<string, string[]>
  submitLabel?: string
}

const form = defineModel<FormData>('form', { required: true })

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  errors: () => ({}),
  submitLabel: 'Salvar',
})

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

function getError(field: string): string | undefined {
  return props.errors[field]?.[0]
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="emit('submit')">
    <FormField label="Nome do Evento" id="nome" :error="getError('nome')" required>
      <Input
        id="nome"
        v-model="form.nome"
        placeholder="Ex: Expo Tech 2026"
        :error="getError('nome')"
      />
    </FormField>

    <FormField label="Descricao" id="descricao" :error="getError('descricao')" required>
      <textarea
        id="descricao"
        v-model="form.descricao"
        rows="4"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        :class="{
          'border-gray-300': !getError('descricao'),
          'border-red-500 focus:ring-red-500': getError('descricao'),
        }"
        placeholder="Descricao do evento"
      />
    </FormField>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField label="Data de Inicio" id="data_inicio" :error="getError('data_inicio')" required>
        <Input
          id="data_inicio"
          v-model="form.data_inicio"
          type="datetime-local"
          :error="getError('data_inicio')"
        />
      </FormField>

      <FormField label="Data de Termino" id="data_fim" :error="getError('data_fim')" required>
        <Input
          id="data_fim"
          v-model="form.data_fim"
          type="datetime-local"
          :error="getError('data_fim')"
        />
      </FormField>
    </div>

    <FormField label="Local" id="local" :error="getError('local')" required>
      <Input
        id="local"
        v-model="form.local"
        placeholder="Ex: Centro de Convencoes"
        :error="getError('local')"
      />
    </FormField>

    <div class="flex justify-end gap-4">
      <Button type="button" variant="ghost" @click="emit('cancel')">Cancelar</Button>
      <Button type="submit" :loading="loading">{{ submitLabel }}</Button>
    </div>
  </form>
</template>
