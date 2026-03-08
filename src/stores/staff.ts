import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import type { Staff } from '@/types'

export const useStaffStore = defineStore('staff', () => {
  const staff = ref<Staff[]>([])
  const loading = ref(false)

  async function fetchStaff(eventoId: string) {
    loading.value = true
    try {
      const response = await api.get(`/eventos/${eventoId}/staff`)
      staff.value = response.data.data
    } finally {
      loading.value = false
    }
  }

  async function addStaff(eventoId: string, email: string) {
    const response = await api.post(`/eventos/${eventoId}/staff`, { email })
    staff.value.unshift(response.data.data)
    return response.data.data
  }

  async function removeStaff(eventoId: string, staffId: string) {
    await api.delete(`/eventos/${eventoId}/staff/${staffId}`)
    staff.value = staff.value.filter((s) => s.id !== staffId)
  }

  return {
    staff,
    loading,
    fetchStaff,
    addStaff,
    removeStaff,
  }
})
