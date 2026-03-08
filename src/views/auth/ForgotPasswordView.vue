<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import { useForm } from '@/composables/useForm'
import api from '@/services/api'

const emailSent = ref(false)

const { form, loading, generalError, getError, submit } = useForm({
  email: '',
})

async function handleSubmit() {
  await submit(
    async (data) => {
      await api.post('/forgot-password', data)
    },
    {
      onSuccess: () => {
        emailSent.value = true
      },
    }
  )
}
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark">
    <!-- Main Container -->
    <div class="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <!-- Top Navigation Header -->
      <div class="flex items-center p-4 border-b border-slate-100 dark:border-slate-800">
        <RouterLink
          to="/login"
          class="text-slate-900 dark:text-slate-100 flex size-10 items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <span class="material-symbols-outlined">arrow_back</span>
        </RouterLink>
        <h2 class="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 ml-2">
          Recuperar senha
        </h2>
      </div>

      <div class="p-6 md:p-8">
        <!-- Logo -->
        <div class="mb-8">
          <BrandLogo size="lg" />
        </div>

        <!-- Sucesso -->
        <div v-if="emailSent" class="space-y-6">
          <div class="flex items-center justify-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <span class="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
            </div>
          </div>
          <div class="text-center">
            <h1 class="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight mb-3">
              Email enviado!
            </h1>
            <p class="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed">
              Enviamos um link de recuperacao para <strong>{{ form.email }}</strong>.
              Verifique sua caixa de entrada e siga as instrucoes.
            </p>
          </div>
          <RouterLink
            to="/login"
            class="flex w-full cursor-pointer items-center justify-center rounded-lg h-14 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-wide transition-colors"
          >
            Voltar para o login
          </RouterLink>
        </div>

        <!-- Formulario -->
        <template v-else>
          <!-- Headline & Description -->
          <div class="mb-8">
            <h1 class="text-slate-900 dark:text-slate-100 text-[32px] font-bold leading-tight pb-3">
              Esqueceu sua senha?
            </h1>
            <p class="text-slate-600 dark:text-slate-400 text-base font-normal leading-relaxed">
              Sem problemas, acontece. Digite o email associado a sua conta e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          <!-- Recovery Form -->
          <form class="space-y-6" @submit.prevent="handleSubmit">
            <!-- Erro geral -->
            <div v-if="generalError" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {{ generalError }}
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-slate-900 dark:text-slate-100 text-sm font-semibold leading-normal">
                Email
              </label>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  mail
                </span>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="nome@empresa.com"
                  required
                  class="form-input flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary h-14 pl-12 pr-4 placeholder:text-slate-400 text-base font-normal transition-all"
                  :class="{ 'border-red-500': getError('email') }"
                />
              </div>
              <span v-if="getError('email')" class="text-red-500 text-xs">{{ getError('email') }}</span>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-wide transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Enviando...</span>
              <span v-else>Enviar link de recuperacao</span>
            </button>
          </form>

          <!-- Footer Action -->
          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <RouterLink
              to="/login"
              class="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
            >
              <span class="material-symbols-outlined text-[18px]">arrow_back</span>
              Voltar para o login
            </RouterLink>
          </div>
        </template>
      </div>
    </div>

    <!-- Decorative Background Elements -->
    <div class="fixed top-20 right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
    <div class="fixed bottom-10 left-[-5%] w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10"></div>

    <footer class="mt-8 text-slate-400 text-xs">
      BizzExpo Platform. Todos os direitos reservados.
    </footer>
  </div>
</template>
