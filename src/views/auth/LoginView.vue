<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import AuthHeroImage from '@/components/auth/AuthHeroImage.vue'
import SocialLoginButtons from '@/components/auth/SocialLoginButtons.vue'
import { useForm } from '@/composables/useForm'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showPassword = ref(false)

const { form, loading, generalError, getError, submit } = useForm({
  email: '',
  password: '',
})

async function handleSubmit() {
  await submit(
    async (data) => {
      await authStore.login(data.email, data.password)
    },
    {
      onSuccess: () => {
        router.push('/dashboard')
      },
    }
  )
}
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
    <!-- Logo -->
    <div class="mb-8 mt-4 flex items-center justify-center">
      <BrandLogo size="lg" />
    </div>

    <!-- Hero Image -->
    <div class="px-4">
      <AuthHeroImage />
    </div>

    <!-- Welcome Headline -->
    <div class="px-4 pt-6 pb-2">
      <h1 class="text-slate-900 dark:text-slate-100 tracking-tight text-[32px] font-bold leading-tight text-center">
        Bem-vindo de volta
      </h1>
      <p class="text-slate-500 dark:text-slate-400 text-center text-sm mt-1">
        Por favor, insira seus dados para entrar
      </p>
    </div>

    <!-- Login Form -->
    <form class="flex flex-col gap-1 px-4 py-3" @submit.prevent="handleSubmit">
      <!-- Erro geral -->
      <div v-if="generalError" class="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
        {{ generalError }}
      </div>

      <!-- Email -->
      <div class="flex flex-col w-full py-2">
        <label class="flex flex-col flex-1">
          <p class="text-slate-700 dark:text-slate-300 text-sm font-semibold leading-normal pb-2">
            Email
          </p>
          <input
            v-model="form.email"
            type="email"
            placeholder="alex@empresa.com"
            class="form-input flex w-full rounded-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 h-14 placeholder:text-slate-400 p-[15px] text-base font-normal"
            :class="{ 'border-red-500': getError('email') }"
          />
          <span v-if="getError('email')" class="text-red-500 text-xs mt-1">{{ getError('email') }}</span>
        </label>
      </div>

      <!-- Password -->
      <div class="flex flex-col w-full py-2">
        <label class="flex flex-col flex-1">
          <p class="text-slate-700 dark:text-slate-300 text-sm font-semibold leading-normal pb-2">
            Senha
          </p>
          <div class="flex w-full flex-1 items-stretch">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="form-input flex w-full min-w-0 flex-1 rounded-l-lg text-slate-900 dark:text-slate-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 h-14 placeholder:text-slate-400 p-[15px] border-r-0 text-base font-normal"
              :class="{ 'border-red-500': getError('password') }"
            />
            <button
              type="button"
              class="text-slate-400 flex border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 items-center justify-center pr-[15px] rounded-r-lg border-l-0 hover:text-slate-600 transition-colors"
              @click="showPassword = !showPassword"
            >
              <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
          <span v-if="getError('password')" class="text-red-500 text-xs mt-1">{{ getError('password') }}</span>
        </label>
      </div>

      <!-- Forgot Password -->
      <div class="flex justify-end pt-1">
        <RouterLink to="/forgot-password" class="text-primary text-sm font-semibold hover:underline">
          Esqueceu a senha?
        </RouterLink>
      </div>

      <!-- Login Button -->
      <div class="pt-6">
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Entrando...</span>
          <template v-else>
            Entrar
            <span class="material-symbols-outlined text-xl">login</span>
          </template>
        </button>
      </div>

      <!-- Social Logins -->
      <div class="py-6">
        <SocialLoginButtons />
      </div>
    </form>

    <!-- Signup Footer -->
    <div class="mt-auto p-8 border-t border-slate-200 dark:border-slate-800 flex justify-center bg-white dark:bg-slate-900/50">
      <p class="text-slate-600 dark:text-slate-400 text-sm">
        Nao tem uma conta?
        <RouterLink to="/register" class="text-primary font-bold hover:underline ml-1">
          Criar conta
        </RouterLink>
      </p>
    </div>

    <!-- Accent Brand Elements -->
    <div class="absolute bottom-0 left-0 w-full h-1 flex">
      <div class="h-full bg-primary flex-1"></div>
      <div class="h-full bg-accent-yellow w-1/4"></div>
      <div class="h-full bg-accent-red w-1/4"></div>
    </div>
  </div>
</template>
