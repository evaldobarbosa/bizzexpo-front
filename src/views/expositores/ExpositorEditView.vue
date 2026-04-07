<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import Spinner from '@/components/ui/Spinner.vue'
import ExpositorForm from '@/components/expositores/ExpositorForm.vue'
import { useForm } from '@/composables/useForm'
import { useExpositoresStore } from '@/stores/expositores'

const route = useRoute()
const router = useRouter()
const expositoresStore = useExpositoresStore()

const eventoId = route.params.eventoId as string
const expositorId = route.params.id as string

const { form, loading, errors, submit } = useForm({
  nome_empresa: '',
  cnpj: '',
  nome_contato: '',
  email_contato: '',
  telefone: '',
  site: '',
  descricao: '',
})

onMounted(async () => {
  await expositoresStore.fetchExpositor(eventoId, expositorId)
})

watch(
  () => expositoresStore.expositorAtual,
  (expositor) => {
    if (expositor) {
      form.nome_empresa = expositor.nome_empresa
      form.cnpj = expositor.cnpj || ''
      form.nome_contato = expositor.nome_contato
      form.email_contato = expositor.email_contato
      form.telefone = expositor.telefone
      form.site = expositor.site || ''
      form.descricao = expositor.descricao || ''
    }
  },
  { immediate: true }
)

async function handleSubmit() {
  await submit(
    async (data) => {
      await expositoresStore.updateExpositor(eventoId, expositorId, data)
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
    <div v-if="expositoresStore.loading && !expositoresStore.expositorAtual" class="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>

    <div v-else class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Editar expositor</h1>

      <Card>
        <ExpositorForm
          :form="form"
          :loading="loading"
          :errors="errors"
          submit-label="Salvar alterações"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </Card>
    </div>
  </AppLayout>
</template>
