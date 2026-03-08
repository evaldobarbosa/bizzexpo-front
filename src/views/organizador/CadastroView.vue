<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import FormField from '@/components/forms/FormField.vue'
import { useForm } from '@/composables/useForm'
import { useOrganizadorStore } from '@/stores/organizador'

const router = useRouter()
const organizadorStore = useOrganizadorStore()

const { form, loading, generalError, getError, submit } = useForm({
  telefone: '',
  empresa: '',
  cnpj: '',
  cargo: '',
})

async function handleSubmit() {
  await submit(
    async (data) => {
      await organizadorStore.createOrganizador(data)
    },
    {
      onSuccess: () => {
        router.push('/dashboard')
      },
    }
  )
}
</script>

<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Cadastro de Organizador</h1>

      <Card>
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <p class="text-gray-600 mb-4">
            Complete seu cadastro como organizador para comecar a criar eventos.
          </p>

          <div v-if="generalError" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ generalError }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Empresa" id="empresa" :error="getError('empresa')" required>
              <Input
                id="empresa"
                v-model="form.empresa"
                placeholder="Nome da empresa"
                :error="getError('empresa')"
              />
            </FormField>

            <FormField label="CNPJ" id="cnpj" :error="getError('cnpj')" required>
              <Input
                id="cnpj"
                v-model="form.cnpj"
                placeholder="00.000.000/0000-00"
                :error="getError('cnpj')"
              />
            </FormField>

            <FormField label="Telefone" id="telefone" :error="getError('telefone')" required>
              <Input
                id="telefone"
                v-model="form.telefone"
                placeholder="(00) 00000-0000"
                :error="getError('telefone')"
              />
            </FormField>

            <FormField label="Cargo" id="cargo" :error="getError('cargo')">
              <Input
                id="cargo"
                v-model="form.cargo"
                placeholder="Seu cargo na empresa"
                :error="getError('cargo')"
              />
            </FormField>
          </div>

          <div class="flex justify-end">
            <Button type="submit" :loading="loading">Cadastrar</Button>
          </div>
        </form>
      </Card>
    </div>
  </AppLayout>
</template>
