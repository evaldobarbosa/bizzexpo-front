<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import ExpositorForm from '@/components/expositores/ExpositorForm.vue'
import { useForm } from '@/composables/useForm'
import { useExpositoresStore } from '@/stores/expositores'

const route = useRoute()
const router = useRouter()
const expositoresStore = useExpositoresStore()

const eventoId = route.params.eventoId as string

const { form, loading, errors, submit } = useForm({
  nome_empresa: '',
  cnpj: '',
  nome_contato: '',
  email_contato: '',
  telefone: '',
  site: '',
  descricao: '',
})

async function handleSubmit() {
  await submit(
    async (data) => {
      await expositoresStore.createExpositor(eventoId, data)
    },
    {
      onSuccess: () => {
        router.push(`/eventos/${eventoId}/expositores`)
      },
    }
  )
}

function handleCancel() {
  router.push(`/eventos/${eventoId}/expositores`)
}
</script>

<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Adicionar expositor</h1>

      <Card>
        <ExpositorForm
          :form="form"
          :loading="loading"
          :errors="errors"
          submit-label="Adicionar expositor"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </Card>
    </div>
  </AppLayout>
</template>
