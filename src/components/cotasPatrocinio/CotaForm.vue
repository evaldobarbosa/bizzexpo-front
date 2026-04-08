<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CotaPatrocinio } from '@/types'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  cota?: CotaPatrocinio
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [
    data: {
      nome: string
      descricao?: string
      preco?: number
      limite_patrocinadores?: number | null
    },
  ]
  cancel: []
}>()

const nome = ref('')
const descricao = ref('')
const preco = ref<number>(0)
const limitePatrocinadores = ref<number | undefined>(undefined)
const semLimite = ref(true)

onMounted(() => {
  if (props.cota) {
    nome.value = props.cota.nome
    descricao.value = props.cota.descricao || ''
    preco.value = props.cota.preco
    limitePatrocinadores.value = props.cota.limite_patrocinadores ?? undefined
    semLimite.value = props.cota.limite_patrocinadores === null
  }
})

function handleSubmit() {
  emit('submit', {
    nome: nome.value,
    descricao: descricao.value || undefined,
    preco: preco.value,
    limite_patrocinadores: semLimite.value ? null : (limitePatrocinadores.value ?? null),
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
        placeholder="Ex: Cota Ouro, Cota Diamante"
        class="mt-1"
      />
    </div>

    <div>
      <label for="descricao" class="block text-sm font-medium text-gray-700">Descrição</label>
      <textarea
        id="descricao"
        v-model="descricao"
        rows="3"
        class="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
        placeholder="Descrição dos benefícios da cota (opcional)"
      />
    </div>

    <div>
      <label for="preco" class="block text-sm font-medium text-gray-700">Preço (R$)</label>
      <Input
        id="preco"
        v-model.number="preco"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        class="mt-1"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Limite de Patrocinadores</label>
      <div class="flex items-center gap-4">
        <label class="inline-flex items-center">
          <input
            type="checkbox"
            v-model="semLimite"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-700">Sem limite (ilimitado)</span>
        </label>
      </div>
      <Input
        v-if="!semLimite"
        id="limite"
        v-model.number="limitePatrocinadores"
        type="number"
        min="1"
        placeholder="Número máximo de patrocinadores"
        class="mt-2"
      />
    </div>

    <div class="flex gap-3">
      <Button type="submit" :loading="loading">
        {{ cota ? 'Salvar' : 'Criar Cota' }}
      </Button>
      <Button type="button" variant="secondary" @click="emit('cancel')"> Cancelar </Button>
    </div>
  </form>
</template>
