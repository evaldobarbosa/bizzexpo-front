<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const plans = [
  {
    name: 'Pequeno',
    description: 'Ideal para webinars e encontros locais.',
    price: 'R$ 499',
    period: '/evento',
    features: [
      { text: 'Ate 200 participantes', included: true },
      { text: 'Credenciamento App', included: true },
      { text: 'Analytics Avancado', included: false },
    ],
    popular: false,
    buttonText: 'Contratar',
    buttonStyle: 'outline',
  },
  {
    name: 'Popular',
    description: 'Para conferencias e workshops corporativos.',
    price: 'R$ 1.299',
    period: '/evento',
    features: [
      { text: 'Ate 1.000 participantes', included: true },
      { text: 'Captura de Leads Ilimitada', included: true },
      { text: 'Suporte Prioritario', included: true },
      { text: 'Integracao CRM', included: true },
    ],
    popular: true,
    buttonText: 'Comecar Agora',
    buttonStyle: 'primary',
  },
  {
    name: 'Grande',
    description: 'Grandes exposicoes e feiras internacionais.',
    price: 'R$ 4.999',
    period: '/evento',
    features: [
      { text: 'Participantes Ilimitados', included: true },
      { text: 'White Label Completo', included: true },
      { text: 'Gerente de Conta Dedicado', included: true },
    ],
    popular: false,
    buttonText: 'Falar com Consultor',
    buttonStyle: 'secondary',
  },
]
</script>

<template>
  <section id="precos" class="py-16 px-4 bg-slate-50">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-slate-900 text-3xl font-black mb-4">Planos que crescem com voce</h2>
        <p class="text-slate-600">Transparencia total, sem taxas escondidas.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="plan in plans"
          :key="plan.name"
          class="bg-white p-8 rounded-3xl flex flex-col relative"
          :class="{
            'border-2 border-primary ring-4 ring-primary/10 scale-105 z-10': plan.popular,
            'border border-slate-200': !plan.popular,
          }"
        >
          <div
            v-if="plan.popular"
            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
          >
            Mais Popular
          </div>

          <h3 class="text-lg font-bold text-slate-900 mb-2">{{ plan.name }}</h3>
          <p class="text-slate-500 text-sm mb-6">{{ plan.description }}</p>

          <div class="flex items-baseline gap-1 mb-8">
            <span class="text-3xl font-black text-slate-900">{{ plan.price }}</span>
            <span class="text-slate-500">{{ plan.period }}</span>
          </div>

          <ul class="space-y-4 mb-8 flex-grow">
            <li
              v-for="feature in plan.features"
              :key="feature.text"
              class="flex items-center gap-2 text-sm"
              :class="{ 'text-slate-400 line-through': !feature.included }"
            >
              <svg
                v-if="feature.included"
                class="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {{ feature.text }}
            </li>
          </ul>

          <button
            @click="router.push('/register')"
            class="w-full py-4 font-bold rounded-xl transition-colors"
            :class="{
              'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90': plan.buttonStyle === 'primary',
              'border-2 border-primary text-primary hover:bg-primary/5': plan.buttonStyle === 'outline',
              'border-2 border-slate-200 text-slate-600 hover:bg-slate-50': plan.buttonStyle === 'secondary',
            }"
          >
            {{ plan.buttonText }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
