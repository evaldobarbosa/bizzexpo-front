<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
  },
  {
    name: 'Eventos',
    path: '/eventos',
    icon: 'event',
  },
  {
    name: 'Minhas faturas',
    path: '/minhas-faturas',
    icon: 'receipt_long',
  },
  {
    name: 'Meu perfil',
    path: '/perfil',
    icon: 'person',
  },
]

const adminMenuItems = [
  {
    name: 'Financeiro',
    path: '/admin/financeiro',
    icon: 'payments',
  },
  {
    name: 'Faturas',
    path: '/admin/faturas',
    icon: 'receipt_long',
  },
  {
    name: 'Catálogo',
    path: '/admin/catalogo',
    icon: 'inventory_2',
  },
]

function isActive(path: string) {
  return route.path.startsWith(path)
}

function getInitials(name: string | undefined) {
  if (!name) return 'AD'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <aside class="hidden lg:flex lg:flex-col w-64 bg-surface-container-low">
    <!-- Logo -->
    <div class="flex items-center gap-3 h-20 px-6">
      <img src="/logo-icon.png" alt="" class="h-9" />
      <div>
        <span class="text-xl font-bold tracking-tight text-on-surface font-headline">Duevento</span>
        <p class="text-xs text-on-surface-variant opacity-70">Event Management</p>
      </div>
    </div>

    <!-- Menu -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
        :class="{
          'bg-secondary-container text-on-secondary-container font-semibold': isActive(item.path),
          'text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary': !isActive(item.path),
        }"
      >
        <span class="material-symbols-outlined text-[20px]">{{ item.icon }}</span>
        <span>{{ item.name }}</span>
      </RouterLink>

      <!-- Menu Admin -->
      <template v-if="authStore.isAdmin && !authStore.isImpersonating">
        <div class="pt-4 mt-4">
          <p class="px-4 mb-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider opacity-60">
            Admin
          </p>
          <RouterLink
            v-for="item in adminMenuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
            :class="{
              'bg-secondary-container text-on-secondary-container font-semibold': isActive(item.path),
              'text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary': !isActive(item.path),
            }"
          >
            <span class="material-symbols-outlined text-[20px]">{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </RouterLink>
        </div>
      </template>
    </nav>

    <!-- Usuário -->
    <div class="px-4 py-4">
      <div class="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-container-lowest">
        <div
          class="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center text-sm font-semibold"
        >
          {{ getInitials(authStore.user?.name) }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-on-surface truncate">
            {{ authStore.user?.name || 'Admin' }}
          </p>
          <p class="text-xs text-on-surface-variant truncate">
            {{ authStore.user?.email || 'admin@duevento.pt' }}
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>
