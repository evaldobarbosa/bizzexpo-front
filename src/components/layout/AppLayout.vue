<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import ImpersonationBanner from '@/components/admin/ImpersonationBanner.vue'

interface Props {
  title?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Banner de impersonation no topo -->
    <ImpersonationBanner />

    <div class="flex flex-1 overflow-hidden">
      <Sidebar />

      <div class="flex-1 flex flex-col overflow-hidden">
        <Header :title="title">
          <template #actions>
            <slot name="actions" />
          </template>
        </Header>

        <main class="flex-1 overflow-y-auto p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
