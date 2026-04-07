<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import FormField from '@/components/forms/FormField.vue'
import { useForm } from '@/composables/useForm'
import api from '@/services/api'

const router = useRouter()

const { form, loading, generalError, getError, submit } = useForm({
  senha_atual: '',
  nova_senha: '',
  nova_senha_confirmation: '',
})

const showSenhaAtual = ref(false)
const showNovaSenha = ref(false)
const showConfirmacao = ref(false)
const successMessage = ref<string | null>(null)

async function handleSubmit() {
  successMessage.value = null
  await submit(
    async (data) => {
      await api.put('/auth/senha', data)
    },
    {
      onSuccess: () => {
        successMessage.value = 'Senha alterada com sucesso! Você será redirecionado...'
        // Limpa o formulário
        form.senha_atual = ''
        form.nova_senha = ''
        form.nova_senha_confirmation = ''
        // Redireciona após 2 segundos
        setTimeout(() => {
          router.push('/perfil')
        }, 2000)
      },
    }
  )
}
</script>

<template>
  <AppLayout title="Alterar senha">
    <div class="max-w-md mx-auto">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <RouterLink
          to="/perfil"
          class="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-sm"
        >
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
          Voltar para o perfil
        </RouterLink>
      </div>

      <Card>
        <h2 class="text-xl font-semibold text-on-surface mb-2">Alterar senha</h2>
        <p class="text-on-surface-variant mb-6">
          Para sua segurança, informe sua senha atual e escolha uma nova senha.
        </p>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div v-if="generalError" class="p-3 bg-error-container text-on-error-container rounded-lg">
            {{ generalError }}
          </div>

          <div
            v-if="successMessage"
            class="p-3 bg-tertiary-container text-on-tertiary-container rounded-lg"
          >
            {{ successMessage }}
          </div>

          <FormField label="Senha atual" id="senha_atual" :error="getError('senha_atual')" required>
            <div class="relative">
              <Input
                id="senha_atual"
                v-model="form.senha_atual"
                :type="showSenhaAtual ? 'text' : 'password'"
                placeholder="Digite sua senha atual"
                :error="getError('senha_atual')"
                class="pr-10"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                @click="showSenhaAtual = !showSenhaAtual"
              >
                <span class="material-symbols-outlined text-[20px]">
                  {{ showSenhaAtual ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
          </FormField>

          <FormField label="Nova senha" id="nova_senha" :error="getError('nova_senha')" required>
            <div class="relative">
              <Input
                id="nova_senha"
                v-model="form.nova_senha"
                :type="showNovaSenha ? 'text' : 'password'"
                placeholder="Digite a nova senha"
                :error="getError('nova_senha')"
                class="pr-10"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                @click="showNovaSenha = !showNovaSenha"
              >
                <span class="material-symbols-outlined text-[20px]">
                  {{ showNovaSenha ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
            <p class="mt-1 text-xs text-on-surface-variant">
              Mínimo de 8 caracteres, incluindo letras maiúsculas, minúsculas e números.
            </p>
          </FormField>

          <FormField
            label="Confirmar nova senha"
            id="nova_senha_confirmation"
            :error="getError('nova_senha_confirmation')"
            required
          >
            <div class="relative">
              <Input
                id="nova_senha_confirmation"
                v-model="form.nova_senha_confirmation"
                :type="showConfirmacao ? 'text' : 'password'"
                placeholder="Confirme a nova senha"
                :error="getError('nova_senha_confirmation')"
                class="pr-10"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                @click="showConfirmacao = !showConfirmacao"
              >
                <span class="material-symbols-outlined text-[20px]">
                  {{ showConfirmacao ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
          </FormField>

          <div class="flex justify-end gap-3 pt-4">
            <Button variant="tertiary" type="button" @click="router.push('/perfil')">
              Cancelar
            </Button>
            <Button type="submit" :loading="loading">Alterar senha</Button>
          </div>
        </form>
      </Card>
    </div>
  </AppLayout>
</template>
