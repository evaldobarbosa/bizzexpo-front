<script setup lang="ts">
import { ref } from 'vue'
import type { Categoria, InscricaoForm } from '@/types'
import FormField from '@/components/forms/FormField.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  categorias: Categoria[]
  loading?: boolean
  errors?: Record<string, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'submit', dados: InscricaoForm): void
  (e: 'cancelar'): void
}>()

const form = ref<InscricaoForm>({
  nome: '',
  email: '',
  telefone: '',
  empresa: '',
  cargo: '',
  cidade_uf: '',
  categoria_id: '',
  aceite_termos: true, // Walk-in assume aceite
})

const getError = (field: string) => {
  return props.errors?.[field]?.[0]
}

const handleSubmit = () => {
  emit('submit', { ...form.value })
}

const formatTelefone = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  } else {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
}

const handleTelefoneInput = (value: string) => {
  form.value.telefone = formatTelefone(value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Titulo -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-slate-900">Cadastro Walk-in</h3>
      <p class="text-slate-500 text-sm">Cadastre um participante presencial</p>
    </div>

    <!-- Nome -->
    <FormField label="Nome completo" id="walkin-nome" :error="getError('nome')" required>
      <Input
        id="walkin-nome"
        v-model="form.nome"
        placeholder="Nome do participante"
        :error="getError('nome')"
      />
    </FormField>

    <!-- Email e Telefone lado a lado -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="E-mail" id="walkin-email" :error="getError('email')" required>
        <Input
          id="walkin-email"
          type="email"
          v-model="form.email"
          placeholder="email@exemplo.com"
          :error="getError('email')"
        />
      </FormField>

      <FormField label="Telefone" id="walkin-telefone" :error="getError('telefone')" required>
        <Input
          id="walkin-telefone"
          type="tel"
          :model-value="form.telefone"
          @update:model-value="handleTelefoneInput"
          placeholder="(11) 99999-9999"
          :error="getError('telefone')"
        />
      </FormField>
    </div>

    <!-- Empresa e Cargo -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Empresa" id="walkin-empresa" :error="getError('empresa')">
        <Input
          id="walkin-empresa"
          v-model="form.empresa"
          placeholder="Nome da empresa"
          :error="getError('empresa')"
        />
      </FormField>

      <FormField label="Cargo" id="walkin-cargo" :error="getError('cargo')">
        <Input
          id="walkin-cargo"
          v-model="form.cargo"
          placeholder="Cargo"
          :error="getError('cargo')"
        />
      </FormField>
    </div>

    <!-- Cidade/UF -->
    <FormField label="Cidade/UF" id="walkin-cidade" :error="getError('cidade_uf')">
      <Input
        id="walkin-cidade"
        v-model="form.cidade_uf"
        placeholder="Sao Paulo/SP"
        :error="getError('cidade_uf')"
      />
    </FormField>

    <!-- Categoria -->
    <FormField label="Categoria" id="walkin-categoria" :error="getError('categoria_id')" required>
      <select
        id="walkin-categoria"
        v-model="form.categoria_id"
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        :class="{
          'border-gray-300': !getError('categoria_id'),
          'border-red-500 focus:ring-red-500': getError('categoria_id'),
        }"
      >
        <option value="" disabled>Selecione uma categoria</option>
        <option
          v-for="categoria in categorias"
          :key="categoria.id"
          :value="categoria.id"
        >
          {{ categoria.nome }}
        </option>
      </select>
    </FormField>

    <!-- Botoes -->
    <div class="flex gap-3 pt-4">
      <Button
        type="button"
        variant="secondary"
        @click="emit('cancelar')"
        class="flex-1"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="loading"
        class="flex-1"
      >
        Cadastrar e Fazer Check-in
      </Button>
    </div>
  </form>
</template>
