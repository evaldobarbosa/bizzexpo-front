import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import type { Carrinho } from '@/types'

export const useCarrinhoStore = defineStore('carrinho', () => {
  const carrinho = ref<Carrinho | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const total = computed(() => carrinho.value?.total ?? 0)
  const quantidadeItens = computed(() => carrinho.value?.itens?.length ?? 0)
  const estaVazio = computed(() => quantidadeItens.value === 0)

  async function fetchCarrinho(eventoId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/eventos/${eventoId}/carrinho`)
      carrinho.value = response.data.data
      return carrinho.value
    } catch (e: any) {
      error.value = e.response?.data?.message ?? 'Erro ao carregar carrinho'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function adicionarItem(eventoId: string, produtoId: string, quantidade: number = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/eventos/${eventoId}/carrinho/itens`, {
        produto_id: produtoId,
        quantidade,
      })
      // Recarrega o carrinho para ter os totais atualizados
      await fetchCarrinho(eventoId)
      return response.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message ?? 'Erro ao adicionar item'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function atualizarQuantidade(eventoId: string, itemId: string, quantidade: number) {
    loading.value = true
    error.value = null
    try {
      const response = await api.patch(`/eventos/${eventoId}/carrinho/itens/${itemId}`, {
        quantidade,
      })
      await fetchCarrinho(eventoId)
      return response.data
    } catch (e: any) {
      error.value = e.response?.data?.message ?? 'Erro ao atualizar item'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function removerItem(eventoId: string, itemId: string) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/eventos/${eventoId}/carrinho/itens/${itemId}`)
      await fetchCarrinho(eventoId)
    } catch (e: any) {
      error.value = e.response?.data?.message ?? 'Erro ao remover item'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fecharCarrinho(eventoId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/eventos/${eventoId}/carrinho/fechar`)
      carrinho.value = null
      return response.data.data
    } catch (e: any) {
      error.value = e.response?.data?.message ?? 'Erro ao fechar carrinho'
      throw e
    } finally {
      loading.value = false
    }
  }

  function limparCarrinho() {
    carrinho.value = null
    error.value = null
  }

  return {
    carrinho,
    loading,
    error,
    total,
    quantidadeItens,
    estaVazio,
    fetchCarrinho,
    adicionarItem,
    atualizarQuantidade,
    removerItem,
    fecharCarrinho,
    limparCarrinho,
  }
})
