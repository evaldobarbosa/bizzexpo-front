<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import SocialLoginButtons from '@/components/auth/SocialLoginButtons.vue'
import { useForm } from '@/composables/useForm'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showPassword = ref(false)
const acceptedTerms = ref(false)

const { form, loading, generalError, getError, submit } = useForm({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

async function handleSubmit() {
  if (!acceptedTerms.value) {
    return
  }

  await submit(
    async (data) => {
      await authStore.register(data)
    },
    {
      onSuccess: () => {
        router.push('/organizador/cadastro')
      },
    }
  )
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background-light dark:bg-background-dark">
    <!-- Logo -->
    <div class="mb-8">
      <BrandLogo size="lg" />
    </div>

    <div class="w-full max-w-md bg-white dark:bg-slate-800/50 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <!-- Header -->
      <div class="p-6 pb-0">
        <h1 class="text-2xl font-bold leading-tight mb-2 text-slate-900 dark:text-slate-100">
          Crie sua conta
        </h1>
        <p class="text-slate-500 dark:text-slate-400 text-sm">
          Junte-se a rede BizzExpo e faca seus negocios crescerem.
        </p>
      </div>

      <form class="p-6 space-y-4" @submit.prevent="handleSubmit">
        <!-- Erro geral -->
        <div v-if="generalError" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {{ generalError }}
        </div>

        <!-- Full Name -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Nome completo</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              person
            </span>
            <input
              v-model="form.name"
              type="text"
              placeholder="Joao Silva"
              class="w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-slate-100"
              :class="{ 'border-red-500': getError('name') }"
            />
          </div>
          <span v-if="getError('name')" class="text-red-500 text-xs">{{ getError('name') }}</span>
        </div>

        <!-- Email -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              mail
            </span>
            <input
              v-model="form.email"
              type="email"
              placeholder="joao@empresa.com"
              class="w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-slate-100"
              :class="{ 'border-red-500': getError('email') }"
            />
          </div>
          <span v-if="getError('email')" class="text-red-500 text-xs">{{ getError('email') }}</span>
        </div>

        <!-- Password Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                lock
              </span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-10 pr-10 py-2.5 bg-background-light dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-slate-100"
                :class="{ 'border-red-500': getError('password') }"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                @click="showPassword = !showPassword"
              >
                <span class="material-symbols-outlined text-[20px]">
                  {{ showPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
            <span v-if="getError('password')" class="text-red-500 text-xs">{{ getError('password') }}</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Confirmar</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                shield
              </span>
              <input
                v-model="form.password_confirmation"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full pl-10 pr-4 py-2.5 bg-background-light dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-slate-100"
                :class="{ 'border-red-500': getError('password_confirmation') }"
              />
            </div>
            <span v-if="getError('password_confirmation')" class="text-red-500 text-xs">
              {{ getError('password_confirmation') }}
            </span>
          </div>
        </div>

        <!-- Terms -->
        <div class="flex items-start gap-3 py-2">
          <input
            id="terms"
            v-model="acceptedTerms"
            type="checkbox"
            class="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
          />
          <label for="terms" class="text-sm text-slate-600 dark:text-slate-400 leading-snug cursor-pointer">
            Eu concordo com os
            <a href="#" class="text-primary hover:underline font-medium">Termos de Servico</a>
            e a
            <a href="#" class="text-primary hover:underline font-medium">Politica de Privacidade</a>.
          </label>
        </div>

        <!-- Sign Up Button -->
        <button
          type="submit"
          :disabled="loading || !acceptedTerms"
          class="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Criando conta...</span>
          <template v-else>
            Criar conta
            <span class="material-symbols-outlined">arrow_forward</span>
          </template>
        </button>

        <!-- Social Logins -->
        <SocialLoginButtons />
      </form>

      <!-- Footer Link -->
      <div class="p-6 bg-slate-50 dark:bg-slate-900/50 text-center border-t border-slate-200 dark:border-slate-700">
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Ja tem uma conta?
          <RouterLink to="/login" class="text-primary font-bold hover:underline">
            Entrar
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
