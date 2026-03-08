<script setup lang="ts">
// Página inicial - será substituída pela landing page
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-primary-900 mb-4">
          BizzExpo
        </h1>
        <p class="text-xl text-primary-700 mb-8">
          Plataforma de credenciamento e check-in para feiras de negócios
        </p>
        <div class="flex gap-4 justify-center">
          <a
            href="/login"
            class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Entrar
          </a>
          <a
            href="/register"
            class="px-6 py-3 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Criar conta
          </a>
        </div>
      </div>
    </div>
  </main>
</template>
