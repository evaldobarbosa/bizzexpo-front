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
}>()

const form = ref<InscricaoForm>({
  nome: '',
  email: '',
  telefone: '',
  empresa: '',
  cargo: '',
  cidade_uf: '',
  categoria_id: '',
  aceite_termos: false,
})

const getError = (field: string) => {
  return props.errors?.[field]?.[0]
}

const handleSubmit = () => {
  emit('submit', { ...form.value })
}

const formatTelefone = (value: string) => {
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, '')

  // Aplica mascara
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
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Nome -->
    <FormField label="Nome completo" id="nome" :error="getError('nome')" required>
      <Input
        id="nome"
        v-model="form.nome"
        placeholder="Seu nome completo"
        :error="getError('nome')"
      />
    </FormField>

    <!-- Email -->
    <FormField label="E-mail" id="email" :error="getError('email')" required>
      <Input
        id="email"
        type="email"
        v-model="form.email"
        placeholder="seu@email.com"
        :error="getError('email')"
      />
    </FormField>

    <!-- Telefone -->
    <FormField label="Telefone" id="telefone" :error="getError('telefone')" required>
      <Input
        id="telefone"
        type="tel"
        :model-value="form.telefone"
        @update:model-value="handleTelefoneInput"
        placeholder="(11) 99999-9999"
        :error="getError('telefone')"
      />
    </FormField>

    <!-- Empresa e Cargo em grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Empresa" id="empresa" :error="getError('empresa')">
        <Input
          id="empresa"
          v-model="form.empresa"
          placeholder="Nome da empresa"
          :error="getError('empresa')"
        />
      </FormField>

      <FormField label="Cargo" id="cargo" :error="getError('cargo')">
        <Input
          id="cargo"
          v-model="form.cargo"
          placeholder="Seu cargo"
          :error="getError('cargo')"
        />
      </FormField>
    </div>

    <!-- Cidade/UF -->
    <FormField label="Cidade/UF" id="cidade_uf" :error="getError('cidade_uf')">
      <Input
        id="cidade_uf"
        v-model="form.cidade_uf"
        placeholder="São Paulo/SP"
        :error="getError('cidade_uf')"
      />
    </FormField>

    <!-- Categoria -->
    <FormField label="Categoria de participação" id="categoria_id" :error="getError('categoria_id')" required>
      <select
        id="categoria_id"
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

    <!-- Aceite de termos -->
    <div class="space-y-2">
      <label class="flex items-start gap-3">
        <input
          type="checkbox"
          v-model="form.aceite_termos"
          class="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span class="text-sm text-slate-600">
          Li e aceito os
          <a href="#" class="text-primary hover:underline">termos de uso</a>
          e a
          <a href="#" class="text-primary hover:underline">política de privacidade</a>
          do evento.
        </span>
      </label>
      <p v-if="getError('aceite_termos')" class="text-sm text-red-600">
        {{ getError('aceite_termos') }}
      </p>
    </div>

    <!-- Botao de envio -->
    <Button
      type="submit"
      variant="primary"
      size="lg"
      :loading="loading"
      :disabled="loading"
      class="w-full"
    >
      Confirmar inscrição
    </Button>
  </form>
</template>
