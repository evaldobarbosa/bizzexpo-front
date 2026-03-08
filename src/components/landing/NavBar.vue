<script setup lang="ts">
import { useRouter } from 'vue-router'
import BrandLogo from '@/components/ui/BrandLogo.vue'

const router = useRouter()
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div class="flex items-center justify-between p-4 max-w-7xl mx-auto">
      <BrandLogo size="md" />

      <div class="hidden md:flex items-center gap-6">
        <a href="#problemas" class="text-slate-600 hover:text-primary font-medium text-sm">Problemas</a>
        <a href="#solucao" class="text-slate-600 hover:text-primary font-medium text-sm">Solucao</a>
        <a href="#funcionalidades" class="text-slate-600 hover:text-primary font-medium text-sm">Funcionalidades</a>
        <a href="#precos" class="text-slate-600 hover:text-primary font-medium text-sm">Precos</a>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="router.push('/login')"
          class="text-slate-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Entrar
        </button>
        <button
          @click="router.push('/register')"
          class="text-white bg-primary text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Criar conta
        </button>
      </div>
    </div>
  </nav>
</template>
