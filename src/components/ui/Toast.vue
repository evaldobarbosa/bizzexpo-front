<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  show?: boolean
  type?: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  type: 'info',
  duration: 3000,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const visible = ref(props.show)

const typeClasses = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
}

watch(
  () => props.show,
  (newVal) => {
    visible.value = newVal
    if (newVal && props.duration > 0) {
      setTimeout(() => {
        visible.value = false
        emit('close')
      }, props.duration)
    }
  }
)

function close() {
  visible.value = false
  emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
  >
    <div
      v-if="visible"
      class="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 text-white rounded-lg shadow-lg"
      :class="typeClasses[props.type]"
    >
      <span>{{ props.message }}</span>
      <button class="hover:opacity-80" @click="close">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>
