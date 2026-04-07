<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import StaffCard from '@/components/staff/StaffCard.vue'
import Button from '@/components/ui/Button.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { useStaffStore } from '@/stores/staff'
import { useEventosStore } from '@/stores/eventos'

const route = useRoute()
const router = useRouter()
const staffStore = useStaffStore()
const eventosStore = useEventosStore()

const eventoId = route.params.eventoId as string
const removeConfirm = ref<string | null>(null)

onMounted(async () => {
  await eventosStore.fetchEvento(eventoId)
  await staffStore.fetchStaff(eventoId)
})

async function handleRemove(id: string) {
  if (removeConfirm.value !== id) {
    removeConfirm.value = id
    return
  }

  await staffStore.removeStaff(eventoId, id)
  removeConfirm.value = null
}
</script>

<template>
  <AppLayout>
    <div class="flex items-center justify-between mb-6">
      <div>
        <Button variant="ghost" size="sm" @click="router.push(`/eventos/${eventoId}`)">
          <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </Button>
        <h1 class="text-2xl font-bold text-gray-900 mt-2">
          Staff
          <span v-if="eventosStore.eventoAtual" class="text-gray-500 font-normal">
            - {{ eventosStore.eventoAtual.nome }}
          </span>
        </h1>
      </div>
      <Button @click="router.push(`/eventos/${eventoId}/staff/adicionar`)">
        Adicionar staff
      </Button>
    </div>

    <div v-if="staffStore.loading" class="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>

    <div v-else-if="staffStore.staff.length === 0" class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum staff</h3>
      <p class="mt-1 text-sm text-gray-500">Adicione membros da equipe ao evento.</p>
      <div class="mt-6">
        <Button @click="router.push(`/eventos/${eventoId}/staff/adicionar`)">
          Adicionar staff
        </Button>
      </div>
    </div>

    <div v-else class="space-y-4">
      <StaffCard
        v-for="member in staffStore.staff"
        :key="member.id"
        :staff="member"
        :evento-id="eventoId"
        @remove="handleRemove"
      />
    </div>
  </AppLayout>
</template>
