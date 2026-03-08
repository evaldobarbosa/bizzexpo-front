<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="bg-white border-b border-gray-200">
    <div class="flex items-center justify-between h-16 px-6">
      <div class="flex items-center gap-4">
        <button class="lg:hidden p-2 text-gray-600 hover:text-gray-900">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 class="text-xl font-semibold text-gray-900">BizzExpo</h1>
      </div>

      <div class="flex items-center gap-4">
        <span v-if="authStore.user" class="text-sm text-gray-600">
          {{ authStore.user.name }}
        </span>
        <Button variant="ghost" size="sm" @click="handleLogout">Sair</Button>
      </div>
    </div>
  </header>
</template>
