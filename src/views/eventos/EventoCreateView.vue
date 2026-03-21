<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import EventoForm from '@/components/eventos/EventoForm.vue'
import { useForm } from '@/composables/useForm'
import { useEventosStore } from '@/stores/eventos'
import type { PlanoEvento } from '@/types'

const router = useRouter()
const eventosStore = useEventosStore()

interface FormData {
  nome: string
  descricao: string
  data_inicio: string
  data_fim: string
  local: string
  plano?: PlanoEvento
}

const { form, loading, errors, submit } = useForm<FormData>({
  nome: '',
  descricao: '',
  data_inicio: '',
  data_fim: '',
  local: '',
  plano: undefined,
})

async function handleSubmit() {
  await submit(
    async (data) => {
      if (!data.plano) {
        throw new Error('Plano e obrigatorio')
      }
      const evento = await eventosStore.createEvento({
        ...data,
        plano: data.plano,
      })
      return evento
    },
    {
      onSuccess: (evento) => {
        router.push(`/eventos/${evento.id}`)
      },
    }
  )
}

function handleCancel() {
  router.push('/eventos')
}
</script>

<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Criar Evento</h1>

      <Card>
        <EventoForm
          :form="form"
          :loading="loading"
          :errors="errors"
          submit-label="Criar Evento"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </Card>
    </div>
  </AppLayout>
</template>
