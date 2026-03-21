import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Fatura, Pagamento, Parcela } from '@/types'

export const useFaturasStore = defineStore('faturas', () => {
  const faturas = ref<Fatura[]>([])
  const faturaAtual = ref<Fatura | null>(null)
  const parcelas = ref<Parcela[]>([])
  const pagamentoAtual = ref<Pagamento | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const faturasPendentes = computed(() =>
    faturas.value.filter((f) => f.status === 'pendente')
  )

  const faturasPagas = computed(() =>
    faturas.value.filter((f) => f.status === 'paga')
  )

  async function fetchFaturas() {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/minhas-faturas')
      faturas.value = response.data.data
      return faturas.value
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      error.value = err.response?.data?.message ?? 'Erro ao carregar faturas'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchFatura(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/minhas-faturas/${id}`)
      faturaAtual.value = response.data.data
      return faturaAtual.value
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      error.value = err.response?.data?.message ?? 'Erro ao carregar fatura'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchParcelas(faturaId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/faturas/${faturaId}/parcelas`)
      parcelas.value = response.data.data
      return parcelas.value
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      error.value = err.response?.data?.message ?? 'Erro ao carregar parcelas'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function pagarComPix(faturaId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/faturas/${faturaId}/pagar`, {
        metodo: 'pix',
      })
      pagamentoAtual.value = response.data.data
      return pagamentoAtual.value
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      error.value = err.response?.data?.message ?? 'Erro ao gerar PIX'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function pagarComCartao(
    faturaId: string,
    dados: {
      metodo: 'credit_card' | 'debit_card'
      card_hash: string
      holder_name: string
      holder_document: string
      parcelas?: number
    }
  ) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/faturas/${faturaId}/pagar`, dados)
      pagamentoAtual.value = response.data.data
      return pagamentoAtual.value
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      error.value = err.response?.data?.message ?? 'Erro ao processar pagamento'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchPagamento(pagamentoId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/pagamentos/${pagamentoId}`)
      pagamentoAtual.value = response.data.data
      return pagamentoAtual.value
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      error.value = err.response?.data?.message ?? 'Erro ao carregar pagamento'
      throw e
    } finally {
      loading.value = false
    }
  }

  function limpar() {
    faturaAtual.value = null
    parcelas.value = []
    pagamentoAtual.value = null
    error.value = null
  }

  return {
    faturas,
    faturaAtual,
    parcelas,
    pagamentoAtual,
    loading,
    error,
    faturasPendentes,
    faturasPagas,
    fetchFaturas,
    fetchFatura,
    fetchParcelas,
    pagarComPix,
    pagarComCartao,
    fetchPagamento,
    limpar,
  }
})
