<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

interface Props {
  paused?: boolean
}

withDefaults(defineProps<Props>(), {
  paused: false,
})

const emit = defineEmits<{
  (e: 'scan', qrcode: string): void
  (e: 'error', message: string): void
}>()

const scannerId = ref('qr-scanner-' + Math.random().toString(36).substr(2, 9))
const scanner = ref<Html5Qrcode | null>(null)
const isScanning = ref(false)
const errorMessage = ref<string | null>(null)

const startScanner = async () => {
  if (scanner.value || isScanning.value) return

  try {
    scanner.value = new Html5Qrcode(scannerId.value)

    const qrCodeSuccessCallback = (decodedText: string) => {
      emit('scan', decodedText)
    }

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    }

    await scanner.value.start(
      { facingMode: 'environment' },
      config,
      qrCodeSuccessCallback,
      undefined
    )

    isScanning.value = true
    errorMessage.value = null
  } catch {
    errorMessage.value = 'Não foi possível acessar a câmera. Verifique as permissões.'
    emit('error', errorMessage.value)
  }
}

const stopScanner = async () => {
  if (scanner.value && isScanning.value) {
    try {
      await scanner.value.stop()
      isScanning.value = false
    } catch {
      // Ignora erro ao parar scanner
    }
  }
}

const pauseScanner = async () => {
  if (scanner.value && isScanning.value) {
    try {
      await scanner.value.pause()
    } catch {
      // Ignora erro
    }
  }
}

const resumeScanner = async () => {
  if (scanner.value && isScanning.value) {
    try {
      await scanner.value.resume()
    } catch {
      // Ignora erro
    }
  }
}

// Watch props.paused
onMounted(() => {
  startScanner()
})

onBeforeUnmount(() => {
  stopScanner()
})

// Expose methods for parent component
defineExpose({
  pause: pauseScanner,
  resume: resumeScanner,
  stop: stopScanner,
  start: startScanner,
})
</script>

<template>
  <div class="relative">
    <!-- Scanner container -->
    <div
      :id="scannerId"
      class="w-full aspect-square bg-black rounded-2xl overflow-hidden"
    ></div>

    <!-- Overlay com guia -->
    <div
      v-if="isScanning && !errorMessage"
      class="absolute inset-0 pointer-events-none flex items-center justify-center"
    >
      <div class="relative w-64 h-64">
        <!-- Cantos do guia -->
        <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
        <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
        <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
        <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>

        <!-- Linha de scan animada -->
        <div class="absolute inset-x-4 top-1/2 h-0.5 bg-primary/50 animate-pulse"></div>
      </div>
    </div>

    <!-- Erro -->
    <div
      v-if="errorMessage"
      class="absolute inset-0 flex items-center justify-center bg-slate-900/90 rounded-2xl p-6"
    >
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p class="text-white text-sm">{{ errorMessage }}</p>
        <button
          @click="startScanner"
          class="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
        >
          Tentar novamente
        </button>
      </div>
    </div>

    <!-- Instrução -->
    <p v-if="isScanning && !errorMessage" class="text-center text-slate-500 text-sm mt-4">
      Aponte a câmera para o QR Code do participante
    </p>
  </div>
</template>
